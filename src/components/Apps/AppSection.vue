<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-02-18 10:20:10
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-08-26 00:45:18
 * @FilePath: /CasaOS-UI/src/components/Apps/AppSection.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->

<template>
	<div class="home-section has-text-left">
		<!-- Title Bar Start -->
		<div class=" is-flex is-align-items-center mb-5">
			<app-section-title-tip id="appTitle1" class="is-flex-grow-1" label="Drag icons to sort."
			                       title="Apps"></app-section-title-tip>

			<b-dropdown animation="fade1" aria-role="menu" class="file-dropdown" position="is-bottom-left">
				<template #trigger>
					<b-icon icon="plus" pack="casa" size="is-20" type="is-white"></b-icon>
				</template>
				<b-dropdown-item aria-role="menuitem" @click="showInstall(0, 'custom')">
					{{ $t('Custom Install APP') }}
				</b-dropdown-item>
				<b-dropdown-item aria-role="menuitem" @click="showExternalLinkPanel">
					{{ $t('Add external link/APP') }}
				</b-dropdown-item>
			</b-dropdown>
		</div>
		<!-- Title Bar End -->

		<!-- App List Start -->
		<draggable v-model="appList" :draggable="draggable"
		           class="columns is-variable is-2 is-multiline app-list contextmenu-canvas"
		           tag="div" v-bind="dragOptions" @end="onSortEnd" @start="drag = true">
			<template v-if="!isLoading">

				<!-- App Icon Card Start -->
				<div v-for="(item) in appList" :id="'app-' + item.id" :key="'app-' + item.id"
				     class="column is-narrow is-3 handle">
					<app-card :isCasa="true" :item="item" @configApp="showConfigPanel" @updateState="getList"></app-card>
				</div>
				<!-- App Icon Card End -->

			</template>

			<b-loading slot="footer" v-model="isLoading" :is-full-page="false"></b-loading>
		</draggable>
		<!-- App List End -->
		<template v-if="notImportedList.length > 0 && exsitingAppsShow">
			<!-- Title Bar Start -->
			<div class="title-bar is-flex is-align-items-center mt-2rem  mb-5">
				<app-section-title-tip id="appTitle2" label="Click icon to import." title="Existing Docker Apps">
				</app-section-title-tip>
			</div>
			<!-- Title Bar End -->

			<!-- App List Start -->
			<div class="columns is-variable is-2 is-multiline app-list contextmenu-canvas">
				<!-- Application not imported Start -->
				<div v-for="(item) in notImportedList" :key="'app-' + item.id" class="column is-narrow is-3">
					<app-card :isCasa="false" :item="item" @configApp="showConfigPanel" @importApp="showConfigPanel"
					          @updateState="getList"></app-card>
				</div>
				<!-- Application not imported End -->
			</div>
			<!-- App List End -->
		</template>

	</div>
</template>

<script>
import AppCard from './AppCard.vue'
import AppPanel from './AppPanel.vue'
import ExternalLinkPanel from "@/components/Apps/ExternalLinkPanel";
import AppSectionTitleTip from './AppSectionTitleTip.vue'
import draggable from 'vuedraggable'
import xor from 'lodash/xor'
import concat from 'lodash/concat'
import events from '@/events/events';
import {last} from 'lodash';

const SYNCTHING_STORE_ID = 74

// meta_data :: build-in app
const builtInApplications = [
	{
		id: "1",
		name: "App Store",
		icon: require(`@/assets/img/app/appstore.svg`),
		state: "0",
		custom_id: "1",
		type: "system"
	},
	{
		id: "2",
		name: "Files",
		icon: require(`@/assets/img/app/files.svg`),
		state: "0",
		custom_id: "2",
		type: "system"
	},
]

const orderConfig = "app_order"

export default {
	data() {
		return {
			user_id: localStorage.getItem("user_id"),
			appList: [],
			notImportedList: [],
			appConfig: {},
			drag: false,
			isLoading: true,
			isShowing: false,
			importHelpText: "Click icon to import.",
			appHelpText: 'Drag icons to sort.',
			draggable: ".handle"
		}
	},
	components: {
		AppCard,
		draggable,
		AppSectionTitleTip
	},
	provide() {
		return {
			openAppStore: this.showInstall,
		};
	},
	computed: {
		dragOptions() {
			return {
				animation: 300,
				group: "description",
				disabled: false,
				ghostClass: "ghost"
			};
		},
		showDragTip() {
			return this.draggable == ".handle"
		},
		exsitingAppsShow() {
			return this.$store.state.existingAppsSwitch
		}
	},
	created() {
		this.getList();
		this.draggable = this.isMobile() ? "" : ".handle";
		this.$EventBus.$on(events.OPEN_APP_STORE_AND_GOTO_SYNCTHING, () => {
			this.showInstall(SYNCTHING_STORE_ID)
		});

		this.$EventBus.$on(events.RELOAD_APP_LIST, () => {
			this.getList();
		});
	},
	// mounted() {
	//
	// },
	beforeDestroy() {
		this.$EventBus.$off(events.OPEN_APP_STORE_AND_GOTO_SYNCTHING);
	},
	methods: {

		isMobile() {
			let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
			return flag
		},
		/**
		 * @description: Fetch the list of installed apps
		 * @return {*} void
		 */
		async getList() {
			this.isLoading = true;
			try {
				const listRes = await this.$api.container.getMyAppList();
				let listLinkApp = await this.$api.users.getLinkAppDetail().then(v => v.data.data);
				if (listLinkApp === "") {
					listLinkApp = []
				}
				localStorage.setItem("listLinkApp", JSON.stringify(listLinkApp))
				const orgAppList = listRes.data.data.casaos_apps
				let casaAppList = concat(builtInApplications, orgAppList, listLinkApp)
				casaAppList.reverse()
				let sortRes = await this.$api.users.getCustomStorage(orderConfig)
				let sortList = sortRes.data.data.data
				let newList = casaAppList.map((item) => {
					return item.custom_id
				})
				if (sortList != "") {
					// Resort list
					sortList = this.getNewSortList(sortList, newList)
					casaAppList.sort((a, b) => {
						return sortList.indexOf(a.custom_id) - sortList.indexOf(b.custom_id);
					});
				}
				this.appList = casaAppList;
				this.$nextTick(() => {
					this.scrollToNewApp();
				})
				if (xor(sortList, newList).length > 0) {
					this.saveSortData()
				}
				this.notImportedList = listRes.data.data.local_apps
				this.isLoading = false;
			} catch (error) {
				this.isLoading = false;
			}

		},

		/**
		 * @description:
		 * @param {Array} oriList
		 * @param {Array} newList
		 * @return {*}
		 */
		getNewSortList(oriList, newList) {
			let xorList = xor(oriList, newList)
			xorList.reverse()
			return concat(oriList, xorList)
		},

		/**
		 * @description: Save Sort Table
		 * @param {*}
		 * @return {*}
		 */
		saveSortData() {
			let newList = this.appList.map((item) => {
				return item.custom_id
			})
			let data = {
				data: newList
			}
			this.$api.users.setCustomStorage(orderConfig, data)
		},
		/**
		 * @description: Handle on Sort End
		 * @param {*}
		 * @return {*}
		 */
		onSortEnd() {
			this.drag = false
			this.saveSortData()
		},

		/**
		 * @description: Show Install Panel Programmatic
		 * @return {*} void
		 */
		async showInstall(storeId = 0, mode) {

			this.isShowing = true

			const networks = await this.$api.container.getNetworks();
			const memory = this.$store.state.hardwareInfo.mem;
			const configData = {
				networks: networks.data.data,
				memory: memory
			}
			this.isShowing = false
			this.$buefy.modal.open({
				parent: this,
				component: AppPanel,
				hasModalCard: true,
				customClass: 'app-panel',
				trapFocus: true,
				canCancel: ['escape'],
				scroll: "keep",
				animation: "zoom-in",
				events: {
					'updateState': () => {
						this.getList()
					}
				},
				props: {
					id: "0",
					state: "install",
					configData: configData,
					storeId: storeId,
					settingData: mode !== 'custom' ? undefined : {}
				}
			})
		},

		/**
		 * @description: Show Settings Panel Programmatic
		 * @param {Object} {id:String,status:String }
		 * @param {Boolean} isCasa
		 * @return {*}
		 */
		async showConfigPanel(item, isCasa) {
			if (item.type === 'LinkApp') {
				await this.showExternalLinkPanel(item)
				return
			}
			let state = item.state
			let id = item.id
			const networks = await this.$api.container.getNetworks();
			const memory = this.$store.state.hardwareInfo.mem;
			const configData = {
				networks: networks.data.data,
				memory: memory
			}
			const ret = await this.$api.container.getInfo(id);
			this.$buefy.modal.open({
				parent: this,
				component: AppPanel,
				hasModalCard: true,
				customClass: '',
				trapFocus: true,
				canCancel: [''],
				scroll: "keep",
				animation: "zoom-in",
				events: {
					'updateState': () => {
						this.getList()
					}
				},
				props: {
					id: id,
					state: "update",
					isCasa: isCasa,
					runningStatus: state,
					configData: configData,
					settingData: ret.data.data
				}
			})
		},
		async showExternalLinkPanel(item = {}) {
			this.$buefy.modal.open({
				parent: this,
				component: ExternalLinkPanel,
				hasModalCard: true,
				customClass: '',
				trapFocus: true,
				canCancel: [''],
				scroll: "keep",
				animation: "zoom-in",
				events: {
					'updateState': () => {
						this.getList()
					}
				},
				props: {
					linkId: item.id,
					linkName: item.name,
					linkHost: item.host,
					linkIcon: item.icon
				}
			})
		},

		scrollToNewApp() {
			// business :: scroll to last position
			let business_new_app = localStorage.getItem("business_new_app") || [];
			const el = business_new_app[business_new_app.length - 1];
			el && document.getElementById(last(business_new_app)).scrollIntoView();
		}
	},
	sockets: {
		app_install(res) {
			if (res.finished) {
				this.getList();
			}
		},
		app_uninstall() {
			this.getList();
		},
	}
}
</script>

<style lang="scss" scoped>
.app-list {
	position: relative;
}

@media screen and (max-width: 480px) {
	.app-list {
		display: flex;

		.column {
			flex: none;
			width: 50%;
		}
	}
}

@media screen and (min-width: $tablet) {
	.app-list {
		.column {
			flex: none;
			width: 50%;
		}
	}
}

@media screen and (min-width: $desktop) {
	.app-list {
		.column {
			flex: none;
			width: 33.333333%;
		}
	}
}

@media screen and (min-width: $widescreen) {
	.app-list {
		.column {
			flex: none;
			width: 25%;
		}
	}
}

@media screen and (min-width: $fullhd) {
	.app-list {
		.column {
			flex: none;
			width: 20%;
		}
	}
}
</style>
