<!--
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-28 12:52:02
 * @FilePath: \CasaOS-UI-0.4.2\src\views\Home.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->

<template>
	<div v-if="!isLoading" class="out-container">
		<!-- NavBar Start -->
		<top-bar v-animate-css="topBarAni" :initBarData="barData" @showSideBar="showSideBar"></top-bar>
		<!-- NavBar End -->

		<!-- Content Start -->
		<div class="contents  pt-55 contextmenu-canvas" @contextmenu.prevent="openHomeContaxtMenu">
			<div class="container">
				<div class="columns is-variable is-2">
					<div class="column is-one-quarter slider-content">
						<!-- SideBar Start -->
						<side-bar v-if="!hardwareInfoLoading"></side-bar>
						<!-- SideBar End -->
					</div>
					<div :class="{ 'open': sidebarOpen }" class="column is-three-quarters main-content">
						<!-- MainContent Start -->
						<div class=" contextmenu-canvas">
							<!-- SearchBar Start -->
							<section>
								<transition name="fade">
									<search-bar v-if="searchbarShow"></search-bar>
								</transition>
							</section>
							<!-- SearchBar End -->

							<!-- core-service Start -->
							<section>
								<transition name="fade">
									<core-service></core-service>
								</transition>
							</section>
							<!-- core-service End -->

							<!-- Apps Start -->
							<section>
								<app-section ref="apps"></app-section>
							</section>
							<!-- Apps End -->

							<!-- Shortcuts Start -->
							<!-- <section>
								<shortcuts></shortcuts>
							</section> -->
							<!-- Shortcuts End -->
						</div>
						<!-- MainContent End -->
					</div>
				</div>
			</div>
		</div>
		<!-- Content End -->

		<!-- File Panel Start -->
		<b-modal v-model="isFileActive"
				 :can-cancel="['escape']"
				 :destroy-on-hide="false"
				 animation="zoom-in" aria-modal
				 custom-class="file-panel"
				 full-screen
				 has-modal-card
				 @cancel="hideMircoApp"
				 @after-enter="afterFileEnter">
			<template #default="props">
				<div id="microApp" @close="props.close"></div>
			</template>
		</b-modal>
		<!-- File Panel End -->

		<!-- Remote Access Start -->
		<div v-show="isRemoteAccessActive" id="remoteAccessMircoApp"></div>
		<!-- Remote Access End -->
	</div>
</template>

<script>

import SearchBar               from '@/components/SearchBar.vue';
import SideBar                 from '@/components/SideBar.vue';
import TopBar                  from '@/components/TopBar.vue';
import CoreService             from '@/components/CoreService.vue';
import AppSection              from '@/components/Apps/AppSection.vue';
import UpdateCompleteModal     from '@/components/settings/UpdateCompleteModal.vue';
import {mixin}                 from '@/mixins/mixin';
import events                  from '@/events/events';
import {nanoid}                from 'nanoid';
import {loadMicroApp}          from "qiankun";
import {MIRCO_APP_ACTION_ENUM} from "@/const";


const wallpaperConfig = "wallpaper"

export default {
	name: "home-page",
	mixins: [mixin],
	components: {
		SideBar,
		SearchBar,
		AppSection,
		TopBar,
		CoreService,
	},
	data() {
		return {
			isLoading: true,
			hardwareInfoLoading: true,
			user_id: localStorage.getItem("user_id") ? localStorage.getItem("user_id") : 1,
			isFileActive: false,
			isRemoteAccessActive: false,
			barData: {},
			topBarAni: {
				classes: 'fadeInDown',
				duration: 800
			},
			mircoAppInstanceMap: new Map(),
		}
	},
	provide() {
		return {
			homeShowFiles: this.showMircoApp,
			showMircoApp: this.showMircoApp,
		};
	},

	computed: {
		sidebarOpen() {
			return this.$store.state.sidebarOpen
		},
		searchbarShow() {
			return this.$store.state.searchEngineSwitch
		},
	},
	created() {
		this.getHardwareInfo();
		this.getWallpaperConfig();
		this.getConfig();
		this.$store.commit('SET_ACCESS_ID', nanoid());
	},
	mounted() {
		window.addEventListener("resize", this.onResize);
		this.onResize()
		if (localStorage.getItem('is_update') === "true") {
			this.showUpdateCompleteModal()
			localStorage.removeItem('is_update')
		}
		if (sessionStorage.getItem('fromWelcome')) {
			this.$messageBus('global_newvisit')
			// this.rssConfirm()
			// one-off consumption
			sessionStorage.removeItem('fromWelcome')
		}
		this.$messageBus('global_visit')

		this.$EventBus.$on('casaUI:openStorageManager', () => {
			this.showStorageManagerPanelModal();
		});

	},
	methods: {

		/**
		 * @description: Get CasaOS Configs
		 * @param {*}
		 * @return {*}
		 */
		async getConfig() {
			try {
				let systemConfig = await this.$api.users.getCustomStorage("system")
				if (systemConfig.data.success != 200 || systemConfig.data.data == "") {
					const barData = {
						lang: this.getLangFromBrowser(),
						search_engine: "https://duckduckgo.com/?q=",
						search_switch: true,
						recommend_switch: true,
						shortcuts_switch: true,
						widgets_switch: true,
						existing_apps_switch: true,
						// first::form vuex
						rss_switch: this.$store.state.rssSwitch,
					}
					// save
					const saveRes = await this.$api.users.setCustomStorage("system", barData)
					if (saveRes.data.success === 200) {
						systemConfig = saveRes
						this.barData = saveRes.data.data
					}
				}

				this.$store.commit('SET_SEARCH_ENGINE_SWITCH', systemConfig.data.data.search_switch);
				this.$store.commit('SET_RECOMMEND_SWITCH', systemConfig.data.data.recommend_switch);
				this.$store.commit('SET_RSS_SWITCH', systemConfig.data.data.rss_switch);
				this.barData = systemConfig.data.data
				this.isLoading = false
			} catch (e) {
				console.error('GETTING SYSTEM INFO HAS ERROR:', e)
			}

		},

		/**
		 * @description: Show SideBar
		 * @param {*}
		 * @return {*} void
		 */
		showSideBar() {
			console.log("showSidebar");
		},

		/**
		 * @description: Show MircoApp
		 * @param {*}
		 * @return {*} void
		 */
		showMircoApp(app) {
			const appInstance = this.mircoAppInstanceMap.get(app.name);
			if (!appInstance) {
				this.createMircoApp(app);
			} else if (app.name === 'Files') {
				if (!this.isFileActive) {
					this.$messageBus('mircoapp_communicate', {action: MIRCO_APP_ACTION_ENUM.OPEN, peerType: 'file'});
					this.isFileActive = true;
				}
			} else if (app.name === 'Remote Access') {
				if (!this.isRemoteAccessActive) {
					this.$messageBus('mircoapp_communicate', {
						action: MIRCO_APP_ACTION_ENUM.OPEN,
						peerType: 'remoteAccess'
					});
					this.isRemoteAccessActive = true;
				}
			}
		},

		hideMircoApp(peerType = '') {
			this.isFileActive = false;
			this.isRemoteAccessActive = false;
		},

		createMircoApp(app) {
			if (app.name === 'Files') {
				const fileAppInstance = loadMicroApp(
					{
						name: 'microApp',
						entry: app.entry,
						container: '#microApp',
						props: {
							store: { // sync necessary store status to child mirco app
								device_id: this.$store.state.device_id,
								access_id: this.$store.state.access_id,
								access_token: this.$store.state.access_token,
								refresh_token: this.$store.state.refresh_token,
								casaos_lang: this.$store.state.casaos_lang,
							}
						}
					},
					{
						sandbox: {
							experimentalStyleIsolation: true
						}
					}
				);
				this.mircoAppInstanceMap.set(app.name, fileAppInstance);
				this.$nextTick(() => {
					this.isFileActive = true;
				});
			} else {
				const remoteAccessAppInstance = loadMicroApp(
					{
						name: 'remoteAccessMircoApp',
						entry: app.entry,
						container: '#remoteAccessMircoApp',
						props: {
							store: { // sync necessary store status to child mirco app
								device_id: this.$store.state.device_id,
								access_id: this.$store.state.access_id,
								access_token: this.$store.state.access_token,
								refresh_token: this.$store.state.refresh_token,
								casaos_lang: this.$store.state.casaos_lang,
							}
						},
					},
					{
						sandbox: {
							strictStyleIsolation: true
						}
					}
				);
				this.mircoAppInstanceMap.set(app.name, remoteAccessAppInstance);
				this.$nextTick(() => {
					this.isRemoteAccessActive = true;
				});
			}
		},

		destroyMircoApp(name = '') {
			this.hideMircoApp();
			const instance = this.mircoAppInstanceMap.get(name);
			if (instance) {
				instance.unmount();
				this.mircoAppInstanceMap.delete(name);
			}
		},

		afterFileEnter() {
			console.log("afterFileEnter");
			this.$EventBus.$emit(events.AFTER_FILES_ENTER);
		},

		/**
		 * @description: Window Resize Handler
		 * @param {*}
		 * @return {*} void
		 */
		onResize() {
			if (window.innerWidth > 480 && this.sidebarOpen) {
				this.$store.commit('SET_SIDEBAR_CLOSE');
			}
		},

		/**
		 * @description: Get Hardware info and save to store
		 * @param {*}
		 * @return {*} void
		 */

		getHardwareInfo() {
			this.$api.sys.getUtilization().then(res => {
				if (res.data.success === 200) {
					this.hardwareInfoLoading = false
					this.$store.commit('SET_HARDWARE_INFO', res.data.data);
				}
			})
		},

		openHomeContaxtMenu(e) {
			// console.log(e.target);
			this.$EventBus.$emit(events.SHOW_HOME_CONTEXT_MENU, e);
		},

		getWallpaperConfig() {
			this.$api.users.getCustomStorage(wallpaperConfig).then(res => {
				if (res.data.success === 200 && res.data.data != "") {
					this.$store.commit('SET_WALLPAPER', {
						path: res.data.data.path,
						from: res.data.data.from
					})
				}
			})
		},

		async showUpdateCompleteModal() {
			const versionRes = await this.$api.sys.getVersion();
			if (versionRes.data.success == 200) {
				this.$buefy.modal.open({
					parent: this,
					component: UpdateCompleteModal,
					hasModalCard: true,
					customClass: 'network-storage-modal',
					trapFocus: true,
					canCancel: [],
					scroll: "keep",
					animation: "zoom-in",
					props: {
						changeLog: versionRes.data.data.version.change_log
					}
				})
			}
		},

		// one-off
		rssConfirm() {
			this.$buefy.dialog.confirm({
				title: this.$t('Show news feed from CasaOS Blog'),
				message: this.$t('CasaOS dashboard will get the the latest news feed of https://blog.casaos.io via Internet, which might leave your visit records to the site. Do you accept?'),
				type: 'is-dark',
				confirmText: this.$t('Accept'),
				cancelText: this.$t('Cancel'),
				onConfirm: async () => {
					let systemConfig = await this.$api.users.getCustomStorage("system")
					let barData = systemConfig.data.data
					barData.rss_switch = true
					const saveRes = await this.$api.users.setCustomStorage("system", barData)
					this.barData = saveRes.data.data
				},
				onCancel: () => {
					this.barData.rss_switch = false
				}
			})
		},

		// show storage settings modal
		async showStorageManagerPanelModal() {
			this.$messageBus('widget_storagemanager');
			this.$buefy.modal.open({
				parent: this,
				component: () => import("@/components/Storage/StorageManagerPanel.vue"),
				hasModalCard: true,
				customClass: 'storage-modal',
				trapFocus: true,
				canCancel: [],
				scroll: "keep",
				animation: "zoom-in",
			})
		},

	},
	sockets: {
		"casaos-ui:app:mircoapp_communicate"(res) {
			const data = res.Properties;
			if (data.access_id === this.$store.state.access_id) {
				switch (data.action) {
					case MIRCO_APP_ACTION_ENUM.MOUNT:
						this.showStorageManagerPanelModal();
						break;
					case MIRCO_APP_ACTION_ENUM.CLOSE:
						this.hideMircoApp(data.peerType);
						break;
					case MIRCO_APP_ACTION_ENUM.LOGIN:
						this.$router.push("/login");
						break;
					default:
						break;
				}
			}
		}
	},
	beforeDestroy() {
		this.destroyMircoApp('Files');
		this.destroyMircoApp('Remote Access');
		window.removeEventListener("resize", this.onResize);
		this.$EventBus.$off('casaUI:openStorageManager');
	},

}
</script>

<style lang="scss" scoped>
.out-container {
	position: relative;
	height: 100%;
}

.contents {
	flex: 1;
	overflow-y: hidden;
	overflow-x: hidden;
	height: calc(100% - 7rem);
}

.main-content {
	z-index: 10;

	@include until-widescreen {
		width: calc(100% - 18rem);
	}
}

.dark-bg {
	position: fixed;
	transition: all 0.3s ease;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 1);
	z-index: 19;
	opacity: 0;
	visibility: hidden;

	&.open {
		opacity: 1;
		visibility: visible;
	}
}

.slider-content {
	min-width: 18rem;
	position: relative;
}

@media screen and (max-width: 480px) {
	.slider-content {
		position: absolute;
		width: 100%;
	}

	.contents {
		height: calc(100vh - 4rem) !important;
	}

	.container {
		height: 100%;
	}

	.columns {
		height: 100%;
	}

	.column {
		padding: 0;
		width: 100%;
		right: 0;
	}

	.main-content {
		margin-left: 0;
		transition: all 0.3s;

		&.open {
			transform: scale(0.9);
			opacity: 0;
		}
	}
}

@media screen and (max-width: $tablet) {
	.columns {
		display: flex;
	}
}
</style>
<style lang="scss">
#microApp {
	width: 100%;
	height: 100%;

	[data-name^="microApp"] {
		width: 100%;
		height: 100%;
	}
}

#remoteAccessMircoApp {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>
