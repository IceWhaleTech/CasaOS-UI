<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2022/12/13 下午4:43
  * @FilePath: /CasaOS-UI/src/components/Apps/AppCard.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
	<div class="common-card is-flex is-align-items-center is-justify-content-center p-55 app-card"
	     @mouseleave="hover = true" @mouseover="hover = true">

		<!-- Action Button Start -->
		<div v-if="item.type !== 'system' && isCasa && !isUninstalling" class="action-btn">
			<b-dropdown ref="dro" :mobile-modal="false" :triggers="['contextmenu','click']" animation="fade1"
			            append-to-body aria-role="list" class="app-card-drop" position="is-bottom-left"
			            @active-change="setDropState">
				<template #trigger>
					<p role="button">
						<b-icon class="is-clickable" icon="dots-vertical"></b-icon>
					</p>
				</template>

				<b-dropdown-item :focusable="false" aria-role="menu-item" custom>
					<b-button expanded tag="a" type="is-text" @click="openApp(item)">{{ $t('Open') }}</b-button>
					<b-button expanded type="is-text" @click="configApp">{{ $t('Setting') }}</b-button>
					<b-button v-if="item.appstore_id != 0" :loading="isCloning" expanded type="is-text"
					          @click="qucikInstall(item.appstore_id)">{{
							$t('Clone')
						}}
					</b-button>
					<b-button :loading="isUninstalling" class="mb-1" expanded type="is-text" @click="uninstallConfirm">
						{{ $t('Uninstall') }}
					</b-button>
					<div v-if="item.type !== 'LinkApp'" class="gap">
						<div class="columns is-gapless bbor is-flex">
							<div class="column is-flex is-justify-content-center is-align-items-center">
								<b-button :loading="isRestarting" expanded type="is-text" @click="restartApp">
									<b-icon custom-size="mdi-18px" icon="sync"></b-icon>
								</b-button>
							</div>
							<div class="column is-flex is-justify-content-center is-align-items-center">
								<b-button :class="item.state" :loading="isStarting" expanded type="is-text" @click="toggle(item)">
									<b-icon custom-size="mdi-18px" icon="power-standby"></b-icon>
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
			<b-tooltip :animated="true" :label="tooltipLabel" :triggers="tooltipTriger" animation="fade1" type="is-dark">
				<div class="has-text-centered is-flex is-justify-content-center is-flex-direction-column pt-3 pb-3 img-c">
					<a class="is-flex is-justify-content-center" @click="openApp(item)">
						<b-image :class="item.state | dotClass" :src="item.icon"
						         :src-fallback="require('@/assets/img/app/default.png')"
						         class="is-64x64" webp-fallback=".jpg"></b-image>
						<!-- Unstable-->
						<cTooltip v-if="newAppIds.includes(item.id)" class="__position" content="New"></cTooltip>
					</a>
					<p class="mt-3 one-line">
						<a class="one-line" @click="openApp(item)">
							{{ item.name }}
						</a>
					</p>

				</div>
			</b-tooltip>
			<!-- Card Content End -->

			<!-- Loading Bar Start -->
			<b-loading v-model="isUninstalling" :can-cancel="false" :is-full-page="false"></b-loading>
			<!-- Loading Bar End -->
		</div>
	</div>

</template>

<script>
import events from '@/events/events';
import cTooltip from '@/components/basicComponents/tooltip/tooltip.vue';
import business_ShowNewAppTag from "@/mixins/app/Business_ShowNewAppTag";
import business_OpenThirdApp from "@/mixins/app/Business_OpenThirdApp";
import isNull from "lodash/isNull";

export default {
	name: "app-card",
	components: {
		cTooltip
	},
	mixins: [business_ShowNewAppTag, business_OpenThirdApp],
	inject: ["homeShowFiles", "openAppStore"],
	data() {
		return {
			hover: false,
			dropState: false,
			isUninstalling: false,
			isCloning: false,
			isRestarting: false,
			isStarting: false,
			isStoping: false,
			isSaving: false,
		}
	},
	props: {
		item: {
			type: Object
		},
		isCasa: {
			type: Boolean
		}
	},
	computed: {
		tooltipLabel() {
			if (!this.isCasa) {
				return this.$t('Import to CasaOS')
			} else {
				if (this.item.type === "system" || this.item.port !== "" && this.item.state === 'running') {
					return this.$t('Open')
				} else {
					return this.$t('Setting')
				}
			}
		},
		tooltipTriger() {
			if (!this.isCasa) {
				return ['hover']
			} else {
				if (this.item.type === "system" || this.item.port !== "" && this.item.state === 'running') {
					return ['hover']
				} else {
					return []
				}
			}
		}
	},
	methods: {
		/**
		 * @description: Open app in new windows
		 * @param {String} state App state
		 * @param {String} port App access port
		 * @param {String} index App access index
		 * @return {*} void
		 */
		openApp(item) {
			if (!this.isCasa) {
				this.$emit("importApp", item, false)
				return false
			}
			if (item.type === "system") {
				this.openSystemApps(item)
			} else if (item.type === "LinkApp") {
				window.open(item.host, '_blank');
			} else {
				this.$refs.dro.isActive = false
				if (item.state === 'running') {
					this.openAppToNewWindow(item)
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
			this.$api.container.updateState(this.item.id, "restart").then((res) => {
				if (res.data.success === 200) {
					this.updateState()
				}
				this.isRestarting = false;
			}).catch((err) => {
				this.isRestarting = false;
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
				/* message: this.$t(`Data cannot be recovered after deletion! <br/>Continue on to uninstall this application?{checkbox}Delete userdata ( config folder )</input>`, {
				 checkbox: `<br/><input type="checkbox" id="deleteUserData" class="checkbox">`
			 }),*/
				type: 'is-dark',
				confirmText: this.$t('Uninstall'),
				cancelText: this.$t('Cancel'),
				onConfirm: () => {
					this.isUninstalling = true
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
			if (this.item.type === "LinkApp") {
				let listLinkApp = JSON.parse(localStorage.getItem("listLinkApp"))
				listLinkApp = listLinkApp.filter((o) => o.name !== this.item.name)
				this.$api.users.saveLinkAppDetail(listLinkApp).then((res) => {
					if (res.data.success === 200) {
						localStorage.setItem("listLinkApp", JSON.stringify(res.data.data))
						this.$EventBus.$emit(events.RELOAD_APP_LIST);
					}
					this.isUninstalling = false;
				})
			} else {
				this.$api.container.uninstall(this.item.id, {'delete_config_folder': checkDelConfig}).then((res) => {
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
				}).then(() => {
					this.isUninstalling = false;
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

		/**
		 * @description: Emit the event that the app has been updated with custom_id
		 * @return {*} void
		 */
		configApp() {
			this.$messageBus('apps_setting', this.item.name);
			this.$refs.dro.isActive = false
			this.$emit("configApp", this.item, true)
		},

		/**
		 * @description: Start or Stop App
		 * @param {Object} item the app info object
		 * @return {*} void
		 */
		toggle(item) {
			this.$messageBus('apps_stop', item.name);
			this.isStarting = true;
			const state = item.state === "running" ? "stop" : "start"

			this.$api.container.updateState(item.id, state).then((res) => {
				this.isStarting = false
				if (res.data.success === 200) {
					item.state = res.data.data
					this.updateState()
				} else {
					this.$refs.dro.isActive = false
					this.$buefy.dialog.alert({
						title: 'Error',
						message: res.data.data || res.data.message,
						type: 'is-danger',
						ariaRole: 'alertdialog',
						ariaModal: true
					})
				}
			}).catch((err) => {
				this.isStarting = false
				this.$refs.dro.isActive = false
				this.$buefy.toast.open({
					message: err.response.data.data || err.response.data.message,
					type: 'is-danger',
					position: 'is-top',
					duration: 3000
				})
			})
		},

		qucikInstall(id) {
			this.isCloning = true;
			let data = this.$api.apps.getAppInfo(id).then(resp => {
				if (resp.data.success == 200) {
					let respData = resp.data.data
					// messageBus :: installApp
					this.$messageBus('appstore_install', respData.title.toString());

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
					initData.appstore_id = id

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
		}

	},
	watch: {
		hover(val) {
			if (!val && this.dropState)
				this.$refs.dro.toggle();
		}
	},
	filters: {
		/**
		 * @description: Format Dot Class
		 * @param {String} state
		 * @return {String}
		 */
		dotClass(state) {
			if (state === "0") {
				return "start"
			} else {
				return state === 'running' ? 'start' : 'stop'
			}

		},
	},

}
</script>

<style lang="scss">
.app-card-drop {
	.dropdown-menu {
		min-width: 10rem;

		.dropdown-content {
			padding: 4px !important;
			width: 160px;
			background: none;
			padding: 0;
			background: rgba(255, 255, 255, 0.88);
			border-radius: 10px;

			.dropdown-item {
				padding: 0;
			}

			.button {
				border-radius: 0;
				padding-left: 1rem;
				padding-right: 1rem;
				border-radius: 5px;

				&.is-text {
					text-decoration: none;
					justify-content: flex-start;
					outline: none;
					transition: all 0.2s;
					border: none !important;
					height: 2rem;
					font-size: 0.875rem;

					&.running {
						color: #779e2a !important;
					}

					&.exited {
						color: #ff1616 !important;
					}
				}

				&:active {
					background: none;
					outline: none;
				}

				&:focus {
					background: none;
					box-shadow: none;
					outline: none;
				}

				&:hover {
					background-color: hsl(0, 0%, 86%);
				}
			}

			.gap {
				margin-left: -4px;
				margin-right: -4px;
			}

			.bbor {
				border-top: #2c3e50 1px solid;

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
					border-right: #2c3e50 1px solid;
				}
			}
		}
	}
}

.__position {
	position: absolute !important;
	top: 0.125rem !important;
	left: 3rem !important;
}
</style>
<style lang="scss">
// TODO Style libraries
.dialog {
	.modal-card-head {
		padding-top: 1.25rem;
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

		//styleName: Text 400Regular/Text03;
		font-family: Roboto;
		font-size: 14px;
		font-weight: 400;
		line-height: 20px;
		letter-spacing: 0em;
		text-align: left;

		.button {
			margin-right: 0rem;
		}

		.is-dark {
			margin-left: 1rem;
			background: hsla(208, 100%, 45%, 1);
		}
	}
}

</style>
