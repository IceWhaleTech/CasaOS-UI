<template>
	<div class="common-card is-flex is-align-items-center is-justify-content-center  app-card"
		@mouseleave="hover = true" @mouseover="hover = true">

		<!-- Action Button Start -->
		<div v-if="item.app_type !== 'system' && !isContainerApp && !isUninstalling" class="action-btn">
			<b-dropdown ref="dro" :mobile-modal="false" :triggers="['contextmenu', 'click']" animation="fade1"
				append-to-body aria-role="list" class="app-card-drop" :position="dropdownPosition"
				@active-change="setDropState">
				<template #trigger>
					<p role="button" @click="handleDorpdownPosition">
						<b-icon class="is-clickable" icon="dots-vertical-outline" pack="casa"></b-icon>
					</p>
				</template>

				<b-dropdown-item :focusable="false" aria-role="menu-item" custom>
					<b-button v-if="item.status === 'running'" expanded tag="a" type="is-text" @click="openApp(item)">{{
						$t('Open') }}</b-button>
					<b-button v-else expanded tag="a" type="is-text" @click="openApp(item)">{{
						$t('launch-and-open') }}</b-button>
					<b-button v-if="isV2App" expanded icon-pack="casa" icon-right="question-outline" size="is-16"
						type="is-text" @click="openTips(item.name)">
						{{ $t('Tips') }}
					</b-button>
					<b-button v-if="isV2App || isLinkApp" expanded type="is-text" @click="configApp()">{{
						$t('Setting')
					}}
					</b-button>

					<b-button v-if="isV2App && !item.is_uncontrolled" expanded type="is-text" @click="checkAppVersion(item.name)">{{
						$t('Check then update')
					}}
						<b-loading :active="isCheckThenUpdate || isUpdating" :is-full-page="false">
							<img :src="require('@/assets/img/loading/waiting.svg')" alt="pending" class="ml-4 is-24x24" />
						</b-loading>
					</b-button>

					<b-button v-if="isV1App" expanded type="is-text" @click="exportYAML(item)">{{
						$t('Export as Compose')
					}}
					</b-button>

					<b-button v-if="isV1App" :loading="isRebuilding" expanded type="is-text" @click="rebuild(item)">{{
						$t('Rebuild')
					}}
					</b-button>

					<b-button v-if="isLinkApp" class="mb-1" expanded type="is-text" @click="uninstallApp(true)">
						{{ $t('Delete') }}
						<b-loading v-model="isUninstalling" :is-full-page="false">
							<img :src="require('@/assets/img/loading/waiting.svg')" alt="pending" class="ml-4 is-24x24" />
						</b-loading>
					</b-button>
					<b-button v-else class="has-text-red" expanded type="is-text" @click="uninstallConfirm">
						{{ $t('Uninstall') }}
						<b-loading v-model="isUninstalling" :is-full-page="false">
							<img :src="require('@/assets/img/loading/waiting.svg')" alt="pending" class="ml-4 is-24x24" />
						</b-loading>
					</b-button>

					<div v-if="!isLinkApp" class="gap">
						<div class="columns is-gapless _b-bor is-flex">
							<div class="column is-flex is-justify-content-center is-align-items-center">
								<b-button :loading="isRestarting" expanded type="is-text" @click="restartApp"
									:disabled="item.status != 'running'">
									<b-icon custom-size="is-size-20px" icon="restart-outline" pack="casa"></b-icon>
								</b-button>
							</div>
							<div class="column is-flex is-justify-content-center is-align-items-center">
								<b-button :class="item.status" :loading="isStarting" class="has-text-red" expanded
									type="is-text" @click="toggle(item)">
									<b-icon custom-size="is-size-20px" icon="shutdown-outline" pack="casa"
										:custom-class="shutDownClass"></b-icon>
								</b-button>
							</div>
						</div>
					</div>

				</b-dropdown-item>
			</b-dropdown>
		</div>
		<!-- Action Button End -->
		<div class="blur-background"></div>
		<div class="cards-content">
			<!-- Card Content Start -->
			<b-tooltip :always="isActiveTooltip" :animated="true" :label="tooltipLabel" :triggers="tooltipTriger"
				animation="fade1" class="in-card" type="is-white">

				<div class="has-text-centered is-flex is-justify-content-center is-flex-direction-column pt-5 pb-3px img-c">
					<div class="is-flex is-justify-content-center">
						<div class="is-relative">
							<b-image :class="dotClass(item.status, isLoading)" :src="item.icon"
								:src-fallback="require('@/assets/img/app/default.svg')" class="is-64x64"
								webp-fallback=".jpg" @click.native="openApp(item)"></b-image>
							<!-- Unstable-->
							<cTooltip v-if="newAppIds.includes(item.name)" class="__position" content="NEW"></cTooltip>
						</div>

						<!-- Loading Bar Start -->
						<b-loading :active="isLoading" :can-cancel="false" :is-full-page="false"
							class="has-background-gray-800 op80 is-64x64"
							style="top: auto;bottom: auto; right: auto; left: auto; border-radius: 11.5px">
							<img :src="require('@/assets/img/loading/waiting-white.svg')" alt="loading" class="is-20x20" />
						</b-loading>
						<!-- Loading Bar End -->
					</div>

					<p class="mt-3 one-line">
						<a class="one-line" style="cursor:default">
							{{ i18n(item.title) }}
						</a>
					</p>

				</div>
			</b-tooltip>
			<!-- Card Content End -->

		</div>
	</div>
</template>

<script>
import events from '@/events/events';
import cTooltip from '@/components/basicComponents/tooltip/tooltip.vue';
import business_ShowNewAppTag from "@/mixins/app/Business_ShowNewAppTag";
import business_OpenThirdApp from "@/mixins/app/Business_OpenThirdApp";
import business_LinkApp from "@/mixins/app/Business_LinkApp";
import isNull from "lodash/isNull";
import tipEditorModal from "@/components/Apps/TipEditorModal.vue";
import YAML from "yaml";
import commonI18n, { ice_i18n } from "@/mixins/base/common-i18n";
import FileSaver from 'file-saver';

export default {
	name: "app-card",
	components: {
		cTooltip,
		tipEditorModal,
	},
	mixins: [business_ShowNewAppTag, business_OpenThirdApp, business_LinkApp, commonI18n],
	inject: ["homeShowFiles", "openAppStore"],
	data() {
		return {
			hover: false,
			dropState: false,
			isUninstalling: false,
			isCloning: false,
			isCheckThenUpdate: false,
			isUpdating: false,
			isRestarting: false,
			isStarting: false,
			isRebuilding: false,
			// isStoping: false,
			// Public. Only changes the state of the card, not the state of the button.
			isSaving: false,
			isActiveTooltip: false,
			dropdownPosition: "is-bottom-right",
		}
	},
	props: {
		item: {
			type: Object
		},
	},

	computed: {
		tooltipLabel() {
			if (this.isContainerApp) {
				return this.$t('Import to CasaOS');
			} else if (this.item.app_type === "system") {
				return this.$t('Open');
			} else if (this.isUpdating) {
				return this.$t('Updating');
			} else if (this.isUninstalling) {
				return this.$t('Uninstalling');
			} else if (this.isCloning) {
				return this.$t('Cloning');
			} else if (this.isRestarting) {
				return this.$t('Restarting');
			} else if (this.isStarting) {
				return this.$t('updateState');
			} else if (this.isRebuilding) {
				return this.$t('Rebuilding');
			} else if (this.isCheckThenUpdate) {
				return this.$t('CheckThenUpdate');
			} else if (this.item.status === 'running') {
				return this.$t('Open');
			} else {
				return this.$t('launch-and-open');
			}
		},
		tooltipTriger() {
			return ['hover'];
			// if (this.isContainerApp || this.item.app_type === "system" || this.item.status === 'running') {
			// 	return ['hover'];
			// } else {
			// 	return [];
			// }
		},
		isLoading() {
			let active = this.isUninstalling || this.isUpdating || this.isRestarting || this.isStarting || this.isSaving || this.isRebuilding // || this.isStoping || this.isSaving
			return active
		},
		isV1App() {
			return this.item.app_type === "v1app"
		},
		isV2App() {
			return this.item.app_type === "v2app"
		},
		isContainerApp() {
			return this.item.app_type === "container"
		},
		isLinkApp() {
			return this.item.app_type === "LinkApp"
		},
		shutDownClass() {
			return this.item.status !== 'running'? "shutdown-rounded": ""
		},

	},

	watch: {
		hover(val) {
			if (!val && this.dropState)
				this.$refs.dro.toggle();
		},
		isLoading(active) {
			// design :: The first display is three seconds long
			if (this.isCheckThenUpdate && this.activeTimer === undefined) {
				this.activeTimer = setTimeout(() => {
					this.isActiveTooltip = false;
					clearTimeout(this.activeTimer);
					this.activeTimer = undefined;
				}, 3000)
				this.isActiveTooltip = true;
			} else if (active === false && this.isCheckThenUpdate === false && this.activeTimer) {
				clearInterval(this.activeTimer);
				this.activeTimer = undefined;
				this.isActiveTooltip = false;
			}
		},
	},

	methods: {
		handleDorpdownPosition(event) {
			this.$nextTick(() => {
				const rightOffset = window.innerWidth - event.clientX - 160
				const horizontalPos = rightOffset > 0 ? "right" : "left"
				const bottomOffset = window.innerHeight - event.clientY - 212
				const verticalPos = bottomOffset > 0 ? "bottom" : "top"
				this.dropdownPosition = `is-${verticalPos}-${horizontalPos}`
			})
		},
		/**
		 * @description: Open app in new windows
		 * @param {String} status App status
		 * @param {String} port App access port
		 * @param {String} index App access index
		 * @return {*} void
		 */
		openApp(item) {
			if (this.isContainerApp) {
				this.$emit("importApp", item, false)
				return false
			}
			if (item.app_type === "system") {
				this.openSystemApps(item)
			} else if (this.isLinkApp) {
				window.open(item.hostname, '_blank');
				this.removeIdFromSessionStorage(item.name);
			} else {
				// type is one of 'official' or 'community'.
				this.$refs.dro.isActive = false
				if (item.status === 'running') {
					this.openAppToNewWindow(item)
				} else {
					this.toggle(item)
					this.firstOpenThirdApp(item)
				}
			}
		},

		openSystemApps(item) {
			switch (item.name) {
				case "App Store":
					this.openAppStore()
					break;
				case "Files":
					this.homeShowFiles()
					break;
				default:
					break;
			}
		},

		/**
		 * @description: Set drop-down menu status
		 * @param {Boolean} e
		 * @return {*} void
		 */
		setDropState(e) {
			this.dropState = e
		},

		/**
		 * @description: Restart Application
		 * @return {*} void
		 */
		restartApp() {
			this.$messageBus('apps_restart', this.item.name);
			this.isRestarting = true
			if (this.isV2App) {
				this.restartAppV2();
			} else if (this.isV1App) {
				this.restartAppV1();
			}
			this.$refs.dro.isActive = false;
		},

		restartAppV1() {
			this.$api.container.updateState(this.item.name, "restart").then((res) => {
				if (res.data.success === 200) {
					this.updateState()
				}
			}).catch((err) => {
				this.$buefy.toast.open({
					message: err.response.data.data || err.response.data.message,
					type: 'is-danger',
					position: 'is-top',
					duration: 5000
				})
			}).finally(() => {
				this.isRestarting = false;
			})
		},

		restartAppV2() {
			this.$openAPI.appManagement.compose.setComposeAppStatus(this.item.name, "restart").then((res) => {
				this.updateState()
			}).catch((err) => {
				this.$buefy.toast.open({
					message: err.response.data.data || err.response.data.message,
					type: 'is-danger',
					position: 'is-top',
					duration: 5000
				})
			})
		},

		/**
		 * @description: Confirm before uninstall
		 * @return {*} void
		 */
		uninstallConfirm() {
			this.$messageBus('apps_uninstall', this.item.name);
			this.$refs.dro.isActive = false
			this.$buefy.dialog.confirm({
				title: this.$t('Attention'),
				message: this.$t(`Data cannot be recovered after deletion! <br/>Continue on to uninstall this application?<br/>{divS}Delete userdata ( config folder ){divE}`, {
					divS: `<div class="is-flex is-align-items-center mt-4"><input type="checkbox" checked id="checkDelConfig">`,
					divE: `</input></div>`
				}),
				type: 'is-dark',
				confirmText: this.$t('Uninstall'),
				cancelText: this.$t('Cancel'),
				onConfirm: () => {
					let checkDelConfig = document.getElementById("checkDelConfig") ? document.getElementById("checkDelConfig").checked : false;
					this.uninstallApp(checkDelConfig)
				}
			})
		},

		/**
		 * @description: Uninstall app
		 * @return {*} void
		 */
		uninstallApp(checkDelConfig) {
			this.isUninstalling = true
			this.removeIdFromSessionStorage(this.item.name);
			if (this.isLinkApp) {
				this.deleteLinkAppByName(this.item.name).then(res => {
					if (res.data.success === 200) {
						this.$EventBus.$emit(events.RELOAD_APP_LIST);
					}
				})
			} else if (this.isV2App) {
				this.$openAPI.appManagement.compose.uninstallComposeApp(this.item.name, checkDelConfig).then((res) => {
					if (res.status === 200) {
						this.$EventBus.$emit(events.UPDATE_SYNC_STATUS);
					}
				}).catch((err) => {
					this.$buefy.toast.open({
						message: err.response.data.data,
						type: 'is-danger',
						position: 'is-top',
						duration: 5000
					})
				})
			} else {
				// former app uninstall
				this.$api.container.uninstall(this.item.name, { 'delete_config_folder': checkDelConfig }).then((res) => {
					if (res.data.success === 200) {
						this.$EventBus.$emit(events.UPDATE_SYNC_STATUS);
					}
				}).catch((err) => {
					this.$buefy.toast.open({
						message: err.response.data.data,
						type: 'is-danger',
						position: 'is-top',
						duration: 5000
					})
				})
			}

		},

		/**
		 * @description: Emit the event that the app has been updated
		 * @return {*} void
		 */
		updateState() {
			this.$refs.dro.isActive = false
			this.$emit("updateState")
			this.$EventBus.$emit(events.UPDATE_SYNC_STATUS);
		},

		async openTips(name) {
			try {
				const ret = await this.$openAPI.appManagement.compose.myComposeApp(name, {
					headers: {
						'content-type': 'application/yaml',
						'accept': 'application/yaml'
					}
				}).then(res => res.data)
				this.$refs.dro.isActive = false
				this.$buefy.modal.open({
					parent: this,
					component: tipEditorModal,
					hasModalCard: true,
					customClass: 'network-storage-modal',
					trapFocus: true,
					canCancel: [],
					// scroll: "keep",
					animation: "zoom-in",
					props: {
						composeData: YAML.parse(ret),
						name
					}
				})
			} catch (e) {
				console.log('openTips Error:', e)
			}
		},

		/**
		 * @description: Emit the event that the app has been updated with custom_id
		 * @return {*} void
		 */
		configApp() {
			this.$messageBus('apps_setting', this.item.name);
			this.$refs.dro.isActive = false;
			this.$emit("configApp", this.item, this.isV2App);
		},

		/**
		 * @description: Start or Stop App
		 * @param {Object} item the app info object
		 * @return {*} void
		 */
		toggle(item) {
			// only have 'apps_stop' event
			this.$messageBus('apps_stop', item.name);
			this.isStarting = true;
			const status = item.status === "running" ? "stop" : "start"
			if (this.isV2App) {
				this.toggleAppV2(item, status);
			} else if (this.isV1App) {
				this.toggleAppV1(item, status);
			}
			this.$refs.dro.isActive = false
		},

		toggleAppV1(item, status) {
			this.$api.container.updateState(item.name, status).then((res) => {
				if (res.data.success === 200) {
					item.status = res.data.data
					this.updateState()
				} else {
					this.$buefy.dialog.alert({
						title: 'Error',
						message: res.data.data || res.data.message,
						type: 'is-danger',
						ariaRole: 'alertdialog',
						ariaModal: true
					})
				}
			}).catch((err) => {
				this.$buefy.toast.open({
					message: err.response.data.data || err.response.data.message,
					type: 'is-danger',
					position: 'is-top',
					duration: 3000
				})
			}).finally(() => {
				this.isStarting = false
			})
		},

		toggleAppV2(item, status) {
			this.$openAPI.appManagement.compose.setComposeAppStatus(item.name, status).then((res) => {
				this.updateState()
				item.status = status
			}).catch((err) => {
				this.$buefy.dialog.alert({
					title: 'Error',
					message: err.response.data.data || err.response.data.message,
					type: 'is-danger',
					ariaRole: 'alertdialog',
					ariaModal: true
				})
			})
		},

		appClone(name) {
			this.isCloning = true;
			this.$api.apps.getAppInfo(name).then(resp => {
				if (resp.data.success == 200) {
					let respData = resp.data.data
					// messageBus :: apps_clone
					this.$messageBus('apps_clone', this.item.name.toString());

					let initData = {}
					initData.protocol = respData.protocol
					initData.host = respData.host
					initData.port_map = respData.port_map
					initData.cpu_shares = 50
					initData.memory = respData.max_memory
					initData.restart = "always"
					initData.label = respData.title
					initData.position = true
					initData.index = respData.index
					initData.icon = respData.icon
					initData.network_model = respData.network_model
					initData.image = respData.image
					initData.description = respData.description
					initData.origin = respData.origin
					initData.ports = isNull(respData.ports) ? [] : respData.ports
					initData.volumes = isNull(respData.volumes) ? [] : respData.volumes
					initData.envs = isNull(respData.envs) ? [] : respData.envs
					initData.devices = isNull(respData.devices) ? [] : respData.devices
					initData.cap_add = isNull(respData.cap_add) ? [] : respData.cap_add
					initData.cmd = isNull(respData.cmd) ? [] : respData.cmd
					initData.privileged = respData.privileged
					initData.host_name = respData.host_name
					initData.appstore_id = name

					this.$api.container.install(initData).catch((err) => {
						this.$buefy.toast.open({
							message: err.response.data.message,
							type: 'is-warning'
						})
					}).then(() => {
						this.isCloning = false;
						this.$refs.dro.isActive = false
					})
				}
			}).catch(() => {
				this.$buefy.toast.open({
					message: this.$t(`There was an error loading the data, please try again!`),
					type: 'is-danger'
				})
			})
		},

		exportYAML(item) {
			this.$api.container.exportAsCompose(item.name).then(res => {
				const blob = new Blob([res.data], { type: '' });
				FileSaver.saveAs(blob, `${item.image}.yaml`);
			}).catch((err) => {
				this.$buefy.toast.open({
					message: err.response.data.message,
					type: 'is-warning'
				})
			})
		},

		async rebuild(app) {
			this.isRebuilding = true;
			try {
				// 1. get yaml
				const file = await this.$api.container.exportAsCompose(app.name).then(res => res.data)
				// 2. archive
				await this.$api.container.archive(app.name)
				// 3.install compose
				await this.$openAPI.appManagement.compose.installComposeApp(file, { name: app.name })
			} catch (e) {
				this.isRebuilding = false;
				console.error('rebuild Error:', e)
				this.$buefy.toast.open({
					message: this.$t(`Rebulid error`),
					type: 'is-danger'
				})
			}
			// 4.sockiet :: install-end :: change UI status.
			// this.isRebuilding = false;
			this.$refs.dro.isActive = false;
		},

		checkAppVersion(name) {
			this.isCheckThenUpdate = true;
			this.$openAPI.appManagement.compose.updateComposeApp(name).then(resp => {
				// 200:
				if (resp.status === 200) {
					// messageBus :: apps_checkThenUpdate
					this.$messageBus('apps_checkupdate', this.item.name.toString());
					this.$buefy.toast.open({
						// value is `In the process of asynchronous updating.` or `compose app `app Name` is up to date`
						message: resp.data.message,
						type: 'is-success'
					})

				} else {
					this.$buefy.toast.open({
						message: this.$t(`No updates are currently available for the application.`),
						type: 'is-success'
					})
				}
			}).catch(() => {
				this.$buefy.toast.open({
					message: this.$t(`Unable to update at the moment!`),
					type: 'is-danger'
				})
			}).finally(() => {
				this.$refs.dro.isActive = false
				this.isCheckThenUpdate = false;
			})
		},
		/**
		 * @description: Format Dot Class
		 * @param {String} status
		 * @return {String}
		 */
		dotClass(status, loadState) {
			// For updating
			if (loadState) {
				if (status === "0" || status === "running") {
					return 'disabled start'
				}
				return 'disabled stop'
			}
			if (status === "0") {
				return "start"
			} else {
				return status === 'running' ? 'start' : 'stop'
			}

		},

	},

	sockets: {
		"app:start-error"(res) {
			// toast info.
			this.$buefy.toast.open({
				message: res.Properties["message"],
				duration: 5000,
				type: "is-danger",
			})
		},
		"app:start-end"(res) {
			if (res.Properties["app:name"] === this.item.name) {
				this.isRestarting = false
				this.isStarting = false
			}
		},
		"app:stop-error"(res) {
			// toast info.
			this.$buefy.toast.open({
				message: res.Properties["message"],
				duration: 5000,
				type: "is-danger",
			})
		},
		"app:stop-end"(res) {
			if (res.Properties["app:name"] === this.item.name) {
				this.isRestarting = false
				this.isStarting = false
			}
		},
		"app:restart-error"(res) {
			// toast info.
			this.$buefy.toast.open({
				message: res.Properties["message"],
				duration: 5000,
				type: "is-danger",
			})
		},
		"app:restart-end"(res) {
			if (res.Properties["app:name"] === this.item.name) {
				this.isRestarting = false
				this.isStarting = false
			}
		},
		"app:apply-changes-begin"(res) {
			if (res.Properties["app:name"] === this.item.name) {
				this.isSaving = true
			}
		},
		"app:apply-changes-error"(res) {
			// toast info.
			this.$buefy.toast.open({
				message: res.Properties["message"],
				duration: 5000,
				type: "is-danger",
			})
		},
		"app:apply-changes-end"(res) {
			if (res.Properties["app:name"] === this.item.name) {
				this.isRestarting = false
				this.isStarting = false
				this.isSaving = false
			}
		},
		/**
		 * @description: Update App Status
		 * @param {Object} data
		 * @return {void}
		 */
		'app:update-begin'() {
			
		},

		'docker:image:pull-end'(data) {
			if (data.Properties["app:name"] === this.item.name) {
				if (data.Properties['docker:image:updated'] === 'true') {
					this.isUpdating = true;
				}
				this.isCheckThenUpdate = false;
			}
		},

		'docker:image:pull-error'(data) {
			if (data.Properties["app:name"] === this.item.name) {
				this.isCheckThenUpdate = false;
			}
		},

		/**
		 * @description: Update App Version
		 * @param {Object} data
		 * @return {void}
		 */
		'app:update-end'(data) {
			if (data.Properties["app:name"] !== this.item.name)
				return
			if (data.Properties['docker:image:updated'] === 'true') {
				return
			}
			this.isUpdating = false;
			this.$buefy.toast.open({
				message: this.$t(`{appName} is the latest version!`, { appName: this.item.name }),
				type: 'is-success',
				duration: 5000
			})
		},
		"app:install-end"(res) {
			if (res.Properties["dry_run.name"] === this.item.name) {
				// 4.sockiet :: install-end :: change UI status.
				this.isRebuilding = false;
				// 5.message toast
				this.$buefy.toast.open({
					message: this.$t(`{title} rebulid completed`, { title: ice_i18n(this.item.title) }),
					type: 'is-success'
				})
			}
		},
		"app:install-error"(res) {
			if (res.Properties["dry_run.name"] === this.item.name) {
				// 4.sockiet :: install-end :: change UI status.
				this.isRebuilding = false;
				// 5.message toast
				this.$buefy.toast.open({
					message: res.Properties["message"],
					type: 'is-warning'
				})
			}
		},
		"app:uninstall-error"(res) {
			if (res.Properties['id'] === this.item.name) {
				this.isUninstalling = false;
			}
		},
	}

}
</script>

<style lang="scss">
.pb-3px {
	padding-bottom: 3px;
}

.shutdown-rounded {
	border-radius: 50%;
	background-color: #000;
	color: #fff;
}

.app-card-drop {
	.dropdown-menu {
		min-width: 10rem;

		.dropdown-content {
			padding: 4px !important;
			width: 160px;
			background: none;
			background: hsla(0, 0%, 100%, 1);
			border-radius: 10px;

			.dropdown-item {
				padding: 0;

				&>* {
					margin: 1px 0;
				}
			}

			.button {
				padding-left: 1rem;
				padding-right: 1rem;
				border-radius: 5px;

				span {
					line-height: 1.25rem !important;
					height: 1.25rem !important;
				}

				span+span i {
					color: hsla(208, 16%, 42%, 1);
				}

				&.is-text {
					text-decoration: none;
					justify-content: flex-start;
					outline: none;
					transition: all 0.2s;
					border: none !important;
					height: 2rem;
					font-size: 0.875rem;
					color: hsla(208, 20%, 20%, 1);

					&.running {
						color: #779e2a !important;
					}

					&.exited {
						color: #ff1616 !important;
					}
				}

				&.has-text-red {
					&:hover {
						background: hsla(18, 98%, 94%, 1);
					}

					&:active {
						background: hsla(18, 100%, 80%, 1);
					}
				}

				&:focus {
					background: none;
					box-shadow: none;
					outline: none;
				}

				&:hover {
					background-color: hsla(208, 16%, 96%, 1);
				}

				&:active {
					/* Gary/200 */
					background-color: hsla(208, 16%, 94%, 1);
				}
			}

			.gap {
				margin-left: -4px;
				margin-right: -4px;
			}

			._b-bor {
				border-top: hsla(208, 16%, 94%, 1) 1px solid;

				.is-text {
					text-decoration: none;
					justify-content: center !important;
				}

				.column {
					margin-bottom: -4px;

					.button {
						margin: 4px;
						height: 2rem;
					}
				}

				.column:first-child {
					border-right: hsla(208, 16%, 94%, 1) 1px solid;
				}
			}

			/*common*/
			.loading-overlay {
				&.is-active {
					background: hsla(208, 16%, 96%, 1) !important;
					justify-content: flex-start;
				}

				.loading-background {
					background: none;
				}
			}


			.is-24x24 {
				width: 1.5rem;
				height: 1.5rem;
			}

		}
	}
}

.in-card.b-tooltip {
	&.is-top .tooltip-content {
		bottom: auto;
		top: -15%;
	}

	.tooltip-content {
		box-shadow: none;
		padding: 0.375rem 0.75rem;
		border-radius: 0.5rem;
		font-family: $family-sans-serif;
		font-style: normal;
		line-height: 1.25rem;
		font-feature-settings: 'pnum' on, 'lnum' on;

		color: hsla(208, 20%, 20%, 1);

	}

}

.__position {
	position: absolute !important;
	top: -0.75rem !important;
	left: 3rem !important;
	z-index: 30;
}

// 0.4.4
.dropdown.is-right .dropdown-menu {
	top: 0;
	left: calc(100% + 6px);
}

.dropdown.is-left .dropdown-menu {
	top: 0;
	left: calc(-100% - 14px);
}
</style>
<style lang="scss">
.dialog {
	.modal-card-head {
		padding-left: 1.5rem;
		padding-top: 1.5rem;
		padding-bottom: 0.75rem;
		border: 1px solid hsla(208, 16%, 94%, 1);
	}

	.modal-card-body {
		padding: 1rem 1.5rem 1.5rem;

		#checkDelConfig {
			margin-right: 0.5rem;
			height: 1.25rem;
			width: 1.25rem;
		}

		border: 1px solid hsla(208, 16%, 94%, 1);
	}

	.modal-card-foot {
		padding-top: 0.75rem;
		padding-bottom: 1.5rem;
		padding-right: 1.5rem;


		font-size: 14px;
		font-weight: 400;
		line-height: 20px;
		letter-spacing: 0;
		text-align: left;

		.button {
			margin-right: 0;
		}

		.is-dark {
			margin-left: 1rem;
			background: hsla(208, 100%, 45%, 1);
		}
	}
}
</style>
