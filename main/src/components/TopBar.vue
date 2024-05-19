<template>
	<div class="navbar top-bar is-flex is-align-items-center _fixed-height">
		<div class="navbar-brand ml-4 _fixed-height">
			<!-- SideBar Button Start -->
			<div id="sidebar-btn" class="is-flex is-align-items-center navbar-item">
				<b-tooltip
					:active="!$store.state.isMobile"
					:label="sidebarIconLabel"
					position="is-right"
					type="is-dark"
				>
					<div role="button" @click="showSideBar">
						<b-icon :icon="sidebarIcon" class="picon" pack="casa" size="is-20"></b-icon>
					</div>
				</b-tooltip>
			</div>
			<!-- SideBar Button Start -->

			<!-- Account Dropmenu Start -->
			<b-dropdown
				animation="fade1"
				aria-role="list"
				class="navbar-item"
				@active-change="getUserInfo"
				:close-on-click="true"
			>
				<template #trigger>
					<b-tooltip
						:active="!$store.state.isMobile"
						:label="$t('Account')"
						position="is-right"
						type="is-dark"
						@click.native="$messageBus('account_setting')"
					>
						<p role="button">
							<b-icon class="picon" icon="account-outline" pack="casa" size="is-20"></b-icon>
						</p>
					</b-tooltip>
				</template>

				<b-dropdown-item :focusable="false" aria-role="menu-item" class="p-0" custom>
					<account-panel></account-panel>
				</b-dropdown-item>
			</b-dropdown>
			<!-- Account Dropmenu End -->

			<!-- Settings Dropmenu Start -->
			<b-dropdown
				ref="settingsDrop"
				animation="fade1"
				aria-role="list"
				class="navbar-item"
				@active-change="onOpen"
			>
				<template #trigger>
					<b-tooltip
						:active="!$store.state.isMobile"
						:label="$t('Settings')"
						position="is-right"
						type="is-dark"
						@click.native="$messageBus('dashboardsetting')"
					>
						<p role="button">
							<b-icon
								:class="{ 'update-icon-dot': updateInfo.need_update }"
								class="picon"
								icon="control-outline"
								pack="casa"
								size="is-20"
							></b-icon>
						</p>
					</b-tooltip>
				</template>

				<b-dropdown-item :focusable="false" aria-role="menu-item" class="p-0" custom>
					<h2 class="_title mb-4">{{ $t("Settings") }}</h2>
					<!-- Search Engine Switch Start  -->
					<div
						class="is-flex is-align-items-center mb-1 _is-large _box hover-effect _is-radius pr-2 mr-4 ml-4"
					>
						<div class="is-flex is-align-items-center is-flex-grow-1 _is-normal">
							<b-icon class="mr-1 ml-2" icon="show-search-outline" pack="casa" size="is-20"></b-icon>
							{{ $t("Show Search Bar") }}
						</div>
						<div>
							<b-field>
								<b-switch
									v-model="barData.search_switch"
									class="is-flex-direction-row-reverse mr-0 _small"
									type="is-dark"
									@input="saveData"
								></b-switch>
							</b-field>
						</div>
					</div>
					<!-- Search Engine Switch End  -->

					<!-- Search Engine Start -->
					<div
						v-if="barData.search_switch"
						class="is-flex is-align-items-center mb-1 _is-large _box hover-effect _is-radius pr-2 mr-4 ml-4"
					>
						<div class="is-flex is-align-items-center is-flex-grow-1 _is-normal">
							<b-icon class="mr-1 ml-2" icon="search-outline" pack="casa" size="is-20"></b-icon>
							{{ $t("Search Engine") }}
						</div>
						<div>
							<b-field>
								<b-select
									v-model="barData.search_engine"
									class="set-select"
									size="is-small"
									@input="saveData"
								>
									<option v-for="item in searchEngines" :key="item.name" :value="item.url">
										{{ item.name }}
									</option>
								</b-select>
							</b-field>
						</div>
					</div>
					<!-- Search Engine End -->

					<!-- Language Start -->
					<div
						class="is-flex is-align-items-center mb-1 _is-large _box hover-effect _is-radius pr-2 mr-4 ml-4"
					>
						<div class="is-flex is-align-items-center is-flex-grow-1 _is-normal">
							<b-icon class="mr-1 ml-2" icon="language-outline" pack="casa" size="is-20"></b-icon>
							{{ $t("Language") }}
						</div>
						<div>
							<b-field>
								<b-select v-model="barData.lang" class="set-select" size="is-small" @input="saveData">
									<option v-for="lang in languages" :key="lang.lang" :value="lang.lang">
										{{ lang.name }}
									</option>
								</b-select>
							</b-field>
						</div>
					</div>
					<!-- Language End -->

					<!-- WebUI Port Start -->
					<div
						class="is-flex is-align-items-center mb-1 _is-large _box hover-effect _is-radius pr-2 mr-4 ml-4"
					>
						<div class="is-flex is-align-items-center is-flex-grow-1 _is-normal">
							<b-icon class="mr-1 ml-2" icon="port-outline" pack="casa" size="is-20"></b-icon>
							{{ $t("WebUI Port") }}
						</div>
						<div>
							{{ port }}
						</div>
						<div class="ml-2">
							<b-button rounded size="is-small" type="is-dark" @click="showPortPanel"
								>{{ $t("Change") }}
							</b-button>
						</div>
					</div>
					<!-- WebUI Port End -->

					<!-- Background Start -->
					<div
						class="is-flex is-align-items-center mb-1 _is-large _box hover-effect _is-radius pr-2 mr-4 ml-4"
					>
						<div class="is-flex is-align-items-center is-flex-grow-1 _is-normal">
							<b-icon class="mr-1 ml-2" icon="wallpaper-outline" pack="casa" size="is-20"></b-icon>
							{{ $t("Wallpaper") }}
						</div>
						<div class="ml-2">
							<b-button rounded size="is-small" type="is-dark" @click="showChangeWallpaperModal"
								>{{ $t("Change") }}
							</b-button>
						</div>
					</div>
					<!-- Background End -->

					<!--  Show other Docker container app(s) Switch Start  -->
					<div
						v-if="this.$store.state.notImportList.length > 0"
						class="is-flex is-align-items-center mb-1 _is-large _box hover-effect _is-radius pr-2 mr-4 ml-4"
					>
						<div class="is-flex is-align-items-center is-flex-grow-1 _is-normal">
							<b-icon class="mr-1 ml-2" icon="docker-outline" pack="casa" size="is-20"></b-icon>
							{{ $t("Show other Docker container app(s)") }}
						</div>
						<div>
							<b-field>
								<b-switch
									v-model="barData.existing_apps_switch"
									class="is-flex-direction-row-reverse mr-0 _small"
									type="is-dark"
									@input="saveData"
								></b-switch>
							</b-field>
						</div>
					</div>
					<!--  Show other Docker container app(s) Switch End  -->

					<!--  Show other Docker container app(s) Switch Start  -->
					<div
						class="is-flex is-align-items-center mb-1 _is-large _box hover-effect _is-radius pr-2 mr-4 ml-4"
					>
						<div class="is-flex is-align-items-center is-flex-grow-1 _is-normal">
							<b-icon class="mr-1 ml-2" icon="news-outline" pack="casa" size="is-20"></b-icon>
							{{ $t("Show news feed from CasaOS Blog") }}
						</div>
						<div>
							<b-field>
								<b-switch
									v-model="rss_switch"
									:native-value="barData.rss_switch"
									class="is-flex-direction-row-reverse mr-0 _small"
									type="is-dark"
									@input="rssConfirm"
								></b-switch>
							</b-field>
						</div>
					</div>
					<!--  Show other Docker container app(s) Switch End  -->
					<!--  Recommended modules Switch Start  -->
					<div
						class="is-flex is-align-items-center mb-1 _is-large _box hover-effect _is-radius pr-2 mr-4 ml-4"
					>
						<div class="is-flex is-align-items-center is-flex-grow-1 _is-normal">
							<b-icon
								class="mr-1 ml-2"
								icon="display-applications-outline"
								pack="casa"
								size="is-20"
							></b-icon>
							{{ $t("Show Recommended Apps") }}
						</div>
						<div>
							<b-field>
								<b-switch
									v-model="barData.recommend_switch"
									class="is-flex-direction-row-reverse mr-0 _small"
									type="is-dark"
									@input="saveData"
								></b-switch>
							</b-field>
						</div>
					</div>
					<!-- Recommended modules Switch End  -->

					<!-- Automount USB Drive Start  -->
					<div
						class="is-flex is-align-items-center mb-1 _is-large _box hover-effect _is-radius pr-2 mr-4 ml-4"
					>
						<div class="is-flex is-align-items-center is-flex-grow-1 _is-normal">
							<b-icon class="mr-1 ml-2" icon="usb-outline" pack="casa" size="is-20"></b-icon>
							{{ $t("Automount USB Drive") }}
							<b-tooltip
								v-if="isRaspberryPi"
								:label="
									$t(
										'Enabling this function may cause boot failures when the Raspberry Pi device is booted from USB'
									)
								"
								multilined
								type="is-dark"
							>
								<b-icon class="ml-1" icon="question-outline" pack="casa" size="is-small"></b-icon>
							</b-tooltip>
						</div>
						<div>
							<b-field>
								<b-switch
									v-model="autoUsbMount"
									class="is-flex-direction-row-reverse mr-0 _small"
									type="is-dark"
									@input="usbAutoMount"
								></b-switch>
							</b-field>
						</div>
					</div>
					<!-- Automount USB Drive End  -->

					<!-- Update Start -->
					<div class="_is-large hover-effect _is-radius pr-2 mr-4 ml-4">
						<div class="is-flex is-align-items-center">
							<div class="is-flex is-align-items-center is-flex-grow-1 _is-normal">
								<b-icon class="mr-1 ml-2" icon="update-outline" pack="casa" size="is-20"></b-icon>
								<div :class="{ 'update-text-dot': updateInfo.need_update }">{{ $t("Update") }}</div>
							</div>
							<div class="_has-text-gray">v{{ updateInfo.current_version }}</div>
						</div>

						<div v-if="!updateInfo.need_update" class="is-flex is-align-items-center pl-55 ml-1 is-size-7">
							{{ $t(latestText) }}
							<b-icon class="ml-1" custom-size="mdi-18px" icon="check" type="is-success"></b-icon>
						</div>
						<div v-else class="is-flex is-align-items-center is-justify-content-end update-container pl-5">
							<div class="is-flex-grow-1 is-size-7">{{ $t(updateText) }}</div>
							<b-button class="ml-2" rounded size="is-small" type="is-dark" @click="showUpdateModal"
								>{{ $t("Update") }}
							</b-button>
						</div>
					</div>
					<!-- Update End -->
					<!-- Restart or Shutdown Start -->
					<div
						class="is-flex is-align-content-center is-justify-content-center _footer mt-4 pl-3 pr-3 pt-2 pb-2"
					>
						<div
							class="mr-1 column is-half is-flex is-align-items-center is-justify-content-center hover-effect is-clickable _is-radius _is-normal"
							@click="power('Restart')"
						>
							<b-icon class="mr-1" icon="restart-outline" pack="casa"></b-icon>
							{{ $t(restart) }}
						</div>
						<div
							class="ml-1 column is-half is-flex is-align-items-center is-justify-content-center is-clickable hover-effect-attention _has-text-attention _is-radius"
							@click="power('Shutdown')"
						>
							<b-icon
								class="mr-1"
								custom-class="_has-text-attention"
								icon="shutdown-outline"
								pack="casa"
							></b-icon>
							{{ $t(shutdown) }}
						</div>
					</div>
					<!-- Restart or Shutdown End -->
				</b-dropdown-item>
			</b-dropdown>
			<!-- Settings Dropmenu End -->

			<!-- Terminal  Start -->
			<div class="is-flex is-align-items-center ml-3 _fixed-height" @click="showTerminalPanel">
				<b-tooltip
					:active="!$store.state.isMobile"
					:label="$t('Terminal & Logs')"
					position="is-right"
					style="height: 1.25rem"
					type="is-dark"
				>
					<b-icon class="picon" icon="terminal-outline" pack="casa" size="is-20"></b-icon>
				</b-tooltip>
			</div>
			<!-- Terminal  End -->
		</div>

		<div class="navbar-menu">
			<div class="navbar-end mr-3">
				<!-- <b-icon pack="far" icon="comment-alt"></b-icon> -->
			</div>
		</div>

		<b-modal v-model="showPower" :can-cancel="false" class="_modal" scroll="clip" width="20rem">
			<b-message @close="resetPower">
				<template #header>
					{{ $t(showPowerTitle) }}
					<img
						v-if="showPowerTitle === 'Now shutting down'"
						:src="require('@/assets/img/loading/waiting.svg')"
						alt="pending"
						class="ml-1 is-24x24"
					/>
				</template>
				<div
					:class="showPowerTitle === 'Now shutting down' ? 'mb-4' : ''"
					class="is-flex is-align-items-center is-justify-content-start _is-normal"
				>
					{{ $t(showPowerMessage) }}
				</div>
			</b-message>
			<footer
				v-if="showPowerTitle !== 'Now shutting down'"
				class="has-background-white is-flex is-flex-direction-row-reverse"
			>
				<button
					class="ml-2 mr-5 mt-3 mb-3 pr-4 pl-4 _is-normal _has-background-blue is-flex is-align-items-center is-justify-content-center"
				>
					{{ $t("Connecting") }}
					<img :src="require('@/assets/img/power/waiting-white.svg')" alt="loading" class="ml-1" />
				</button>
			</footer>
		</b-modal>
	</div>
</template>

<script>
import AccountPanel from "./account/AccountPanel.vue";
import TerminalPanel from "./logsAndTerminal/TerminalPanel.vue";
import PortPanel from "./settings/PortPanel.vue";
import UpdateModal from "./settings/UpdateModal.vue";
import { mixin } from "@/mixins/mixin";
import messages from "@/assets/lang";

import events from "@/events/events";

const systemConfigName = "system";

export default {
	name: "top-bar",
	components: {
		AccountPanel,
	},
	mixins: [mixin],
	data() {
		return {
			timer: 0,
			// User
			userInfo: this.$store.state.user,
			// System
			barData: {
				lang: this.getInitLang(),
				search_engine: "https://duckduckgo.com/?q=",
				search_switch: true,
				recommend_switch: true,
				shortcuts_switch: false, // Not used
				widgets_switch: false, // Not used
				existing_apps_switch: true,
				rss_switch: false,
			},
			rss_switch: false,
			updateInfo: {
				current_version: "0",
				need_update: false,
				version: Object,
			},
			isUpdating: false,
			latestText: "Currently at the latest version",
			updateText: "A new version is available!",

			port: "",
			autoUsbMount: false,
			deviceModel: "",
			// Language Sets
			languages: Object.entries(messages).map(([key, value]) => ({
				lang: key,
				name: value.lang_name,
			})),
			// Search Engine Sets
			searchEngines: [
				{ url: "https://duckduckgo.com/?q=", name: "DuckDuckGo" },
				{ url: "https://www.google.com/search?q=", name: "Google" },
				{ url: "https://www.bing.com/search?q=", name: "Bing" },
				{ url: "https://www.startpage.com/do/search?cat=web&pl=chrome&query=", name: "StartPage" },
				{ url: "https://search.brave.com/search?source=web&q=", name: "Brave" },
			],
			restart: "Restart",
			shutdown: "Shutdown",
			showPower: false,
			showPowerTitle: "",
			showPowerMessage: "",
		};
	},
	props: {
		initBarData: {
			type: Object,
		},
	},
	computed: {
		sidebarIcon() {
			return this.$store.state.sidebarOpen ? "close-outline" : "menu-outline";
		},
		sidebarIconLabel() {
			return this.$store.state.sidebarOpen ? "Hide Sidebar" : "Show SideBar";
		},
		isRaspberryPi() {
			return this.deviceModel.toLowerCase().indexOf("raspberry") >= 0;
		},
	},
	watch: {
		"barData.lang": {
			handler(val, oldValue) {
				if (val === oldValue) {
					return;
				}
				const lang = val.includes("_") ? val : "en_us";
				this.$messageBus("dashboardsetting_language", lang);
				this.setLang(lang);
			},
			deep: true,
		},
		"barData.search_engine": {
			handler(val, oldValue) {
				if (val === oldValue) {
					return;
				}
				this.$messageBus("dashboardsetting_searchengine", val.toString());
				this.$store.commit("SET_SEARCH_ENGINE", val);
			},
			deep: true,
		},
		"barData.search_switch": {
			handler(val, oldValue) {
				if (val === oldValue) {
					return;
				}
				this.$messageBus("dashboardsetting_showsearchbar", val.toString());
				this.$store.commit("SET_SEARCH_ENGINE_SWITCH", val);
			},
			deep: true,
		},
		// "barData.existing_apps_switch": {
		// 	handler(val, oldValue) {
		// 		if (val === oldValue) {
		// 			return
		// 		}
		// 		this.$messageBus('dashboardsetting_showexistingapp', val.toString());
		// 		this.$store.commit('SET_EXISTING_APPS_SWITCH', val);
		// 	},
		// 	deep: true
		// },
		"barData.recommend_switch": {
			handler(val) {
				this.$store.commit("SET_RECOMMEND_SWITCH", val);
			},
			deep: true,
		},
		"barData.rss_switch": {
			handler(val, oldValue) {
				this.rss_switch = val;
				this.$store.commit("SET_RSS_SWITCH", val);
				if (val === oldValue || val === undefined) {
					return;
				}
				this.$messageBus("dashboardsetting_news", val.toString());
			},
			deep: true,
		},
		initBarData(val) {
			this.barData = val;
		},
	},
	created() {
		this.barData = this.initBarData;
		// this.getConfig();
		this.getPort();
	},
	mounted() {
		this.checkVersion();
		this.getUserInfo();
		this.getUsbStatus();
		this.getHardwareInfo();
	},

	methods: {
		/*************************************************
		 * PART 0  Common
		 **************************************************/
		/**
		 * @description: Save CasaOs Configs
		 * @param {*}
		 * @return {*}
		 */
		async saveData() {
			const saveRes = await this.$api.users.setCustomStorage(systemConfigName, this.barData);
			if (saveRes.data.success === 200) {
				this.barData = saveRes.data.data;
			}
		},

		/**
		 * @description: Handle Dropmenu state
		 * @param {Boolean} isOpen
		 * @return {*}
		 */
		onOpen(isOpen) {
			if (isOpen) {
				this.$store.commit("SET_SIDEBAR_CLOSE");
				this.checkVersion();
			} else {
				// Reset the text when the Settings layer closes
				// this.resetPower(true)
				this.restart = "Restart";
				this.shutdown = "Shutdown";
			}
		},

		/**
		 * @description: Show SideBar
		 * @param {*}
		 * @return {*}
		 */
		showSideBar() {
			this.$store.commit("TOOGLE_SIDEBAR_STATE");
		},

		/*************************************************
		 * PART 1-2  Dashboard Setting - Language
		 **************************************************/

		/**
		 * @description: Get Initnal Language
		 * @param {*}
		 * @return {String} lang
		 */
		getInitLang() {
			let lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : this.getLangFromBrowser();
			lang = lang.includes("_") ? lang : "en_us";
			return lang;
		},

		/*************************************************
		 * PART 1-3  Dashboard Setting - Web UI Port
		 **************************************************/

		/**
		 * @description: Get CasaOs WebUI port
		 * @return {*}
		 */
		getPort() {
			this.$api.sys.getServerPort().then((res) => {
				if (res.data.success == 200) {
					this.port = res.data.data;
				}
			});
		},

		/**
		 * @description: Show Port panel
		 * @return {*}
		 */
		showPortPanel() {
			this.$refs.settingsDrop.toggle();
			this.$buefy.modal.open({
				parent: this,
				component: PortPanel,
				hasModalCard: true,
				customClass: "account-modal",
				trapFocus: true,
				canCancel: ["escape"],
				scroll: "keep",
				animation: "zoom-in",
				props: {
					initPort: this.port,
				},
			});
		},
		showChangeWallpaperModal() {
			this.$EventBus.$emit(events.SHOW_CHANGE_WALLPAPER_MODAL);
			this.$refs.settingsDrop.toggle();
		},

		/*************************************************
		 * PART 1-4  Dashboard Setting - Auto USB Mount Switch
		 **************************************************/
		/**
		 * @description: Get Auto USB Mount State
		 * @return {*}
		 */
		getUsbStatus() {
			this.$api.sys.getUsbStatus().then((res) => {
				if (res.data.success == 200) {
					this.autoUsbMount = res.data.data === "True";
				}
			});
		},

		/**
		 * @description: Enable or Disable USB Auto Mount
		 * @param {*}
		 * @return {*}
		 */
		usbAutoMount() {
			if (this.autoUsbMount) {
				this.$messageBus("dashboardsetting_automountusb", true.toString());
				this.$api.sys.toggleUsbAutoMount({ state: "on" });
				// Show
				if (this.isRaspberryPi) {
					this.$buefy.snackbar.open({
						message: this.$t(
							"Enabling this function may cause boot failures when the Raspberry Pi device is booted from USB"
						),
						type: "is-warning",
						position: "is-top",
					});
				}
			} else {
				this.$messageBus("dashboardsetting_automountusb", false.toString());
				this.$api.sys.toggleUsbAutoMount({ state: "off" });
			}
		},
		/**
		 * @description: Get Hardware Info etc. Board Info
		 * @param {*}
		 * @return {*}
		 */
		getHardwareInfo() {
			this.$api.sys.hardwareInfo().then((res) => {
				if (res.data.success == 200) {
					this.deviceModel = res.data.data.drive_model;
					localStorage.setItem("arch", res.data.data.arch || "");
				}
			});
		},

		/*************************************************
		 * PART 1-5  Dashboard Setting - Update
		 **************************************************/

		/**
		 * @description: Get Version info
		 * @return {*} void
		 */
		checkVersion() {
			this.$api.sys.getVersion().then((res) => {
				if (res.data.success === 200) {
					this.updateInfo = res.data.data;
					if (res.data.data.need_update) {
						this.$messageBus("dashboardsetting_versionavailable_show", true.toString());
					}
				}
			});
		},

		/**
		 * @description: Open Update Modal
		 * @return {*} void
		 */
		showUpdateModal() {
			this.$messageBus("dashboardsetting_versionupdate", true.toString());
			this.$buefy.modal.open({
				parent: this,
				component: UpdateModal,
				hasModalCard: true,
				trapFocus: true,
				canCancel: ["escape"],
				scroll: "keep",
				animation: "zoom-in",
				props: {
					changeLog: this.updateInfo.version.change_log,
				},
			});
		},

		/*************************************************
		 * PART 2  Userinfo
		 **************************************************/
		/**
		 * @description: Get user info
		 * @return {*} void
		 */
		async getUserInfo() {
			this.userInfo = this.$store.state.user;
			this.$store.commit("SET_SIDEBAR_CLOSE");
			if (this.$store.state.user.id == 0) {
				try {
					const userRes = await this.$api.users.getUserInfo();
					this.userInfo = userRes.data.data;
					this.$store.commit("SET_USER", this.userInfo);
				} catch (error) {
					console.error(error);
				}
			}
		},
		/*************************************************
		 * PART 3  Terminal
		 **************************************************/

		/**
		 * @description: Show Terminal panel
		 * @return {*} void
		 */
		showTerminalPanel() {
			this.$messageBus("terminallogs");
			this.$store.commit("SET_SIDEBAR_CLOSE");
			this.$buefy.modal.open({
				parent: this,
				component: TerminalPanel,
				hasModalCard: true,
				customClass: "terminal-modal",
				trapFocus: true,
				canCancel: [],
				scroll: "keep",
				animation: "zoom-in",
			});
		},

		rssConfirm() {
			if (this.rss_switch == false) {
				this.barData.rss_switch = false;
				return this.saveData();
			}
			this.$buefy.dialog.confirm({
				title: this.$t("Show news feed from CasaOS Blog"),
				message: this.$t(
					"CasaOS dashboard will get the the latest news feed of https://blog.casaos.io via Internet, which might leave your visit records to the site. Do you accept?"
				),
				type: "is-dark",
				confirmText: this.$t("Accept"),
				cancelText: this.$t("Cancel"),
				onConfirm: () => {
					this.barData.rss_switch = true;
					this.saveData();
				},
				onCancel: () => {
					this.barData.rss_switch = false;
					this.rss_switch = false;
				},
			});
		},
		power(key) {
			if (this[key.toLowerCase()] !== "Are you sure?") {
				this[key.toLowerCase()] = "Are you sure?";
				return;
			}
			this.$refs.settingsDrop.toggle();
			this.showPower = true;
			switch (key) {
				case "Restart":
					this.$messageBus("dashboardsetting_reboot");
					this[key.toLowerCase()] = key;
					this.showPowerTitle = "Restarting now";
					this.showPowerMessage = "Please wait for about 90 seconds.";
					break;
				case "Shutdown":
					this.$messageBus("dashboardsetting_shutdown");
					this[key.toLowerCase()] = key;
					this.showPowerTitle = "Now shutting down";
					this.showPowerMessage = "Please wait for about 30 seconds before cutting off the power.";
					break;
			}
			let timer;
			let path = key === "Shutdown" ? "off" : "restart";
			this.$api.sys.power(path).then((res) => {
				if (res.data.success === 200) {
					this.showPowerMessage = res.data.data;
					timer = setInterval(() => {
						this.$api.users.getUserStatus().then((res) => {
							if (res.data.data.initialized) {
								clearInterval(timer);
								location.reload();
							}
						});
					}, 30000);
				}
			});
		},
		resetPower() {
			this.showPower = false;
			this.restart = "Restart";
			this.shutdown = "Shutdown";
		},
	},
};
</script>

<style lang="scss">
._is-large {
	// bulma 3rem;
	//height: 2.5rem;
	padding-bottom: 0.625rem;
	padding-top: 0.625rem;
}

._box {
	height: 2.5rem;
}

._footer {
	height: 3.5rem;
	border-top: 1px solid rgb(228 233 237);
}

._title {
	font-family: $family-sans-serif;
	font-size: 1rem;
	font-weight: 500;
	line-height: 1.5rem;
	letter-spacing: 0em;
	text-align: left;
	padding: 1.25rem 1.25rem 0.5rem 1.5rem;
	border-bottom: 1px solid rgb(228 233 237);
}

._is-normal {
	font-family: $family-sans-serif;
	font-size: 0.875rem;
	font-weight: 400;
	line-height: 1.25rem;
	letter-spacing: 0em;
	text-align: left;
}

._has-text-attention {
	color: hsla(18, 98%, 55%, 1);
}

._has-text-gray {
	color: hsla(208, 14%, 58%, 1);
}

._fixed-height {
	height: 2.75rem;
	min-height: 2.75rem;
}

.top-bar {
	position: relative;
	z-index: 20;
	height: 2.75rem;
	background: rgba(255, 255, 255, 1);

	.navbar-brand {
		margin-left: 1.25rem;

		.picon {
			cursor: pointer;
		}

		.navbar-item {
			height: 2.75rem;
			padding: 0.75rem 0.75rem 0.5rem;

			.icon {
				&:only-child {
					margin-left: 0;
					margin-right: 0;
				}
			}
		}

		.dropdown + .dropdown {
			margin-left: 0;
		}

		.dropdown-trigger,
		.tooltip-trigger {
			height: 1.5rem;
		}

		.dropdown-menu {
			margin-top: 0.5rem;
			min-width: 22.5rem;

			.dropdown-content {
				background: rgba(255, 255, 255, 1);
				border-radius: 10px;

				.dropdown-item {
					padding: 0.875rem 1.25rem;
					text-align: left;

					.item {
						height: 2rem;
					}
				}
			}
		}
	}

	.set-select {
		.select {
			&::after {
				border-color: #000 !important;
			}
		}

		select {
			background-color: transparent !important;
			border-color: #000 !important;
		}
	}

	.field {
		line-height: 1rem;
	}

	.switch {
		&.is-flex-direction-row-reverse {
			.control-label {
				padding-left: 0;
				padding-right: calc(0.75em - 1px);
			}
		}

		// TODO: remove this when the switch to be component.
		&._small input[type="checkbox"] {
			& + .check {
				width: 2.286em;
				height: 1.429em;
				padding: 0;

				&::before {
					width: 1.143em;
					height: 1.143em;
					margin-left: 2px;
					margin-right: 2px;
				}
			}

			&:checked + .check {
				&::before {
					transform: translate3d(80%, 0, 0);
				}
			}
		}
	}

	.update-container {
		.button.is-rounded {
			padding-left: calc(1em + 0.25em);
			padding-right: calc(1em + 0.25em);
			border-radius: 9999px !important;
		}
	}

	.button {
		&.is-small {
			height: 2em;
		}
	}

	.icon {
		color: rgb(74, 74, 74);
	}
}

.update-text-dot {
	position: relative;

	&::after {
		content: "";
		position: absolute;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background-color: $danger;
		right: -0.5rem;
		top: 0rem;
	}
}

.update-icon-dot {
	position: relative;

	&::after {
		content: "";
		position: absolute;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background-color: $danger;
		right: 0;
		top: 0;
	}
}

#sidebar-btn {
	display: none !important;
}

@media screen and (max-width: 480px) {
	#sidebar-btn {
		display: flex !important;
	}
}

@media (prefers-color-scheme: dark) {
	.top-bar {
		background: rgba(53, 54, 58, 1);

		.picon {
			color: #fff;
		}
	}
}

// TODO
._is-normal {
	/* Text 400Regular/Text03 */
	font-family: $family-sans-serif;
	font-style: normal;
	font-weight: 400;
	font-size: 0.875rem;
	line-height: 1.25rem;
	/* or 143% */
	font-feature-settings: "pnum" on, "lnum" on;
}

._has-background-blue {
	background: hsla(208, 100%, 75%, 1);
}

._modal {
	.modal-content {
		border-radius: 0.625rem;

		.message {
			margin-bottom: 0rem;
			border-radius: 0rem;

			.message-header {
				background: hsla(0, 0%, 100%, 1);
				border-bottom: 1px solid hsla(208, 16%, 94%, 1);
				//margin-top: 1.25rem;
				//margin-left: 1.5rem;
				padding: 1.25rem 1.5rem 0.75rem 1.5rem;

				> div {
					display: flex;
					//align-items: center;
					justify-content: center;
					vertical-align: middle;

					color: hsla(208, 20%, 20%, 1);

					font-family: $family-sans-serif;
					font-size: 1rem;
					font-weight: 500;
					line-height: 1.5rem;
					letter-spacing: 0em;
					text-align: left;
					font-feature-settings: "pnum" on, "lnum" on;

					.is-24x24 {
						width: 1.5rem;
						height: 1.5rem;
					}
				}

				> button {
					width: 1.5rem;
					height: 1.5rem;
					max-height: 1.5rem;
					max-width: 1.5rem;
					min-height: 1.5rem;
					min-width: 1.5rem;
					display: none;
				}
			}

			.message-body {
				background: hsla(0, 0%, 100%, 1);
				padding-top: 1rem;
				padding-bottom: 1rem;
			}
		}

		footer {
			border: 1px solid hsla(208, 16%, 94%, 1);

			button {
				border-radius: 0.875rem;
				border: none;
				color: hsla(0, 0%, 100%, 1);
				height: 2rem;

				img {
					width: 1.25rem;
					height: 1.25rem;
				}
			}
		}
	}
}
</style>
