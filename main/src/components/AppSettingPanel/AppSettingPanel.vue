<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-03-01 21:10:57
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-07 21:07:35
 * @FilePath: \CasaOS-UI-0.4.2\src\components\Apps\AppPanel.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.

-->
<template>
	<div :class="{'narrow': true ,'card-width': isFirstInstall}"
		class="app-card modal-card">
			<!-- Modal-Card Header Start -->
			<header :class="{'setting-compose-panel' : isCasa}" class="modal-card-head _b-line">
				<div class="is-flex-grow-1">
					<h3 class="_title is-5">{{ panelTitle }}</h3>
				</div>
				<div class="is-flex is-align-items-center">					
					<b-tooltip v-if="showImportButton" :label="$t('Import')" position="is-bottom" type="is-dark">
						<button class="icon-button mdi mdi-import" type="button" @click="showImportPanel"/>
					</b-tooltip>

					<b-tooltip v-if="showTerminalButton" :label="$t('Terminal & Logs')" position="is-bottom"
						type="is-dark">
						<button class="icon-button mdi mdi-console" type="button" @click="showTerminalPanel"/>
					</b-tooltip>

					<b-tooltip v-if="showExportButton" :label="$t('Export ComposeFile')" position="is-bottom"
						type="is-dark">
						<button class="icon-button mdi mdi-export-variant" type="button" @click="exportYAML"/>
					</b-tooltip>
					<div
						class="is-flex is-align-items-center modal-close-container modal-close-container-line ">
						<b-icon class="_polymorphic close" icon="close-outline" pack="casa"
							@click.native="$emit('close')"/>
					</div>
				</div>

			</header>

			<template >
				<!--:config-data="initConfigData"-->
				<ComposeConfig v-if="isCasa" ref="compose"
					:cap-array="capArray"
					:docker-compose-commands="dockerComposeConfig" :errInfo="errInfo" :networks="networks"
					:state="state"
					:total-memory="totalMemory"
					@updateDockerComposeCommands="updateDockerComposeCommands"
					@updateDockerComposeServiceName="updateDockerComposeServiceName"
					@updateMainName="name=> currentInstallId = name"></ComposeConfig>

				<section v-else :class="{'_hideOverflow': !isCasa}" class="modal-card-body pt-3">
					<!--	导入"已存在的容器"，进行初始化操作	-->
					<ValidationObserver ref="containerValida">
						<ValidationProvider v-slot="{ errors, valid }" name="appName" rules="required">
							<b-field :label="$t('App name')+' *'" :message="$t(errors)"
										:type="{ 'is-danger': errors[0], 'is-success': valid }">
								<b-input v-model="settingData.label" :placeholder="$t('Your custom App Name')"
											maxlength="40"></b-input>
							</b-field>
						</ValidationProvider>

						<b-field :label="$t('Icon URL')">
							<p class="control">
								<span class="button is-static container-icon">
									<b-image :key="settingData.icon" :src="settingData.icon"
										:src-fallback="require('@/assets/img/app/default.svg')"
										class="is-32x32" ratio="1by1"></b-image>
								</span>
							</p>
							<b-input v-model="settingData.icon" :placeholder="$t('Your custom icon URL')"
										expanded></b-input>
						</b-field>

						<b-field label="Web UI">
							<b-select v-model="settingData.protocol">
								<option value="http">http://</option>
								<option value="https">https://</option>
							</b-select>
							<b-input v-model="settingData.host" :placeholder="this.$baseHostname"
										expanded></b-input>
							<b-autocomplete
								v-model="settingData.port_map"
								:data="(()=>{
								return (settingData.ports || []).map((item)=>{
									return item.host
								})
							})()"
								:open-on-focus="true"
								:placeholder="$t('Port')" class="has-colon" field="hostname"
								@select="option => (settingData.port_map = option)"></b-autocomplete>
							<b-input v-model="settingData.index"
										:placeholder="'/index.html '+ $t('[Optional]')"
										expanded></b-input>
						</b-field>
					</ValidationObserver>

				</section>
			</template>
		
		<!-- Modal-Card Footer Start-->
		<footer :class="{'is-justify-content-center':currentSlide == 0}"
				class="modal-card-foot is-flex is-align-items-center ">
			<template>
				<div class="is-flex-grow-1">
				</div>
				<div>
					<b-button v-if="currentSlide == 1 && state == 'install'" :label="$t('Install')" :loading="isLoading"
						rounded type="is-primary" @click="installApp()"/>
					<b-button v-if="isCasa && currentSlide == 1 && state == 'update'" :label="$t('Save')"
						:loading="isLoading"
						rounded type="is-primary" @click="updateApp()"/>
					<b-button v-if="!isCasa && currentSlide == 1 && state == 'update'" :label="$t('Save')"
						:loading="isLoading"
						rounded type="is-primary" @click="updateContainer()"/>
					<b-button v-if="currentSlide == 2 && !currentInstallAppError" :label="$t(cancelButtonText)"
						rounded type="is-primary" @click="$emit('close')"/>
					<b-button v-if="isFirstInstall" :label="$t('Submit')" :loading="isLoading" rounded type="is-primary"
						@click="submitInstallationLocation(installationLocation)"/>
				</div>
			</template>

		</footer>
		<!-- Modal-Card Footer End -->

	</div>
</template>

<script>
import ImportPanel                              from '@/components/forms/ImportPanel.vue'
import AppTerminalPanel                         from '@/components/Apps/AppTerminalPanel.vue'
import "@/plugins/vee-validate";
import uniq                                     from 'lodash/uniq';
import orderBy                                  from 'lodash/orderBy';
import FileSaver                                from 'file-saver';
import {Swiper, SwiperSlide}                    from 'vue-awesome-swiper'
import business_ShowNewAppTag                   from "@/mixins/app/Business_ShowNewAppTag";
import business_OpenThirdApp                    from "@/mixins/app/Business_OpenThirdApp";
import DockerProgress                           from "@/components/Apps/progress.js";
import ComposeConfig                            from "@/components/Apps/ComposeConfig.vue";
import {ValidationObserver, ValidationProvider} from "vee-validate";
import {ice_i18n}                               from "@/mixins/base/common-i18n";
import {parse}                                  from "yaml";
import {vOnClickOutside}                        from '@vueuse/components'

export default {
	components: {
		Swiper,
		SwiperSlide,
		ComposeConfig,
		ValidationObserver,
		ValidationProvider,
	},
	mixins: [business_ShowNewAppTag, business_OpenThirdApp],
	directives: {
		OnClickOutside: vOnClickOutside
	},
	props: {
		id: String,
		state: String,
		storeId: {
			type: Number,
			default: 0
		},
		isCasa: {
			type: Boolean,
			default: true
		},
		runningStatus: String,
		configData: Object,
		// for import app. this.isCasa is false
		settingData: {
			type: Object,
		},
		// for compose app.
		settingComposeData: {
			type: String,
		},
	},

	data() {
		return {
			timer: 0,
			data: [],
			isLoading: true,
			isFetching: false,
			isLoadError: false,
			loadErrorStep: 0,

			errorType: 1,
			currentInstallAppName: null,
			currentInstallAppError: false,
			currentInstallAppType: null,
			currentInstallAppText: "",
			currentInstallAppProgress: {},
			currentInstallAppProgressTotals: {},

			sidebarOpen: false,
			cancelButtonText: "Cancel",
			totalMemory: 0,
			networks: [],
			tempNetworks: [],
			networkModes: [],
			// about @compose
			// Assign value to compose_config component
			dockerComposeConfig: '',
			capArray: [
				"AUDIT_CONTROL",
				"AUDIT_READ",
				"BLOCK_SUSPEND",
				"BPF",
				"CHECKPOINT_RESTORE",
				"DAC_READ_SEARCH",
				"IPC_LOCK",
				"IPC_OWNER",
				"LEASE",
				"LINUX_IMMUTABLE",
				"MAC_ADMIN",
				"MAC_OVERRIDE",
				"NET_ADMIN",
				"NET_BROADCAST",
				"PERFMON",
				"SYS_ADMIN",
				"SYS_BOOT",
				"SYS_MODULE",
				"SYS_NICE",
				"SYS_PACCT",
				"SYS_PTRACE",
				"SYS_RAWIO",
				"SYS_RESOURCE",
				"SYS_TIME",
				"SYS_TTY_CONFIG",
				"SYSLOG",
				"WAKE_ALARM"
			],
			errInfo: {},
			dockerComposeCommands: '',
			dockerComposeServiceName: '',

			currentSlide: 1,
			currentInstallId: '',

			//  App Detail info
			appDetailData: {
				title: {en_us: "",},
				tagline: {en_us: "",},
				description: {en_us: "",},
			},
			arch: "",
			// unusable: false, // computer unusable
			architectures: [],

			isFirstInstall: false,
			installationLocation: '',
			dockerProgress: null,
			totalPercentage: 0,
			installedList: [],
			counterPatchGetStoreList: 0,
		}
	},

	created() {
		window.addEventListener('resize', this.setCSSVHVar);
		this.setCSSVHVar();


		//Get Max memory info form device
		this.totalMemory = Math.floor(this.configData.memory.total / 1048576);

		//Handling network types
		this.tempNetworks = this.configData.networks;
		this.networkModes = uniq(this.tempNetworks.map(item => {
			return item.driver
		}))
		this.networks = this.networkModes.map(item => {
			let tempitem = {}
			tempitem.driver = item
			tempitem.networks = this.tempNetworks.filter(net => {
				return net.driver == item
			})
			return tempitem
		})
		this.networks = orderBy(this.networks, ['driver'], ['asc']);
		//If it is edit, Init data
		if (this.settingData != undefined || this.settingComposeData != undefined) {
			this.isLoading = false
			this.dockerComposeConfig = this.settingComposeData
			this.currentSlide = 1

		} else {
			// this.getCategoryList();
		}

		// If StoreId is not 0
		if (this.storeId != 0) {
			this.showAppDetial(this.storeId);
		}

		// get architecture
		this.arch = localStorage.getItem('arch')
	},

	mounted() {
		this.currentSlide === 0 && !this.isMobile && this.$nextTick().then(() => {
			this.$refs.search_app.$el.children[0].focus();
		});
		// this.searchAndSourcesStatusController();
	},

	computed: {
		showImportButton() {
			return this.currentSlide == 1 && this.state == 'install'
		},
		showExportButton() {
			return this.currentSlide == 1 && this.state == 'update'

		},
		showTerminalButton() {
			return this.currentSlide == 1 && this.state == 'update' && this.runningStatus == 'running'
		},
		panelTitle() {
			if (!this.isCasa) {
				return this.$t("Import") + " " + this.currentInstallId
			} else {
				return (this.settingData != undefined || this.settingComposeData != undefined) ? this.currentInstallId + " " + this.$t("Setting") : this.$t("Install a new App manually")
			}
		},
		isMobile() {
			return this.$store.state.isMobile
		},

	},
	watch: {
		// Watch if Section index changes
		/*
		*  === 0 App Store Panel.
		*  === 1 Setting Panel.	(Importing、Update Setting)
		*  === 2 Other Panel. (Installing)
		* */
		currentSlide(val) {
			if (val == 1) {
				this.isLoading = false;
			}
		},
	},
	methods: {
		setCSSVHVar() {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		},

		/**
		 * @description: Show the details of app
		 * @param {id} String
		 * @return {*} void
		 */
		async showAppDetial(id) {
			this.isLoading = true;
			let min_memory = await this.$openAPI.appManagement.appStore.composeApp(id).then(res => {
				// A district that is reserved for resource.
				return res.data.data.compose.services[id]?.deploy?.resources?.reservations?.memory || '0'
			})

			if (min_memory.includes('GB')) {
				min_memory = min_memory.replace('GB', '') * 1024
			} else if (min_memory.includes('MB')) {
				min_memory = min_memory.replace('MB', '')
			} else {
				min_memory = min_memory / 1024 / 1024
			}
			this.$openAPI.appManagement.appStore.composeAppStoreInfo(id).then(res => {
				this.isLoading = false;
				this.sidebarOpen = true;
				this.appDetailData = res.data.data
				this.appDetailData.id = id
				this.appDetailData.min_memory = min_memory
				this.architectures = res.data.data.architectures || [];
			}).catch((e) => {
				this.$buefy.toast.open({
					message: e.response.data.message,
					// message: this.$t(`There was an error loading the data, please try again!`),
					type: 'is-danger'
				})
			}).finally(() => {
				this.isLoading = false;
			})
		},

		/**
		 * @description: Qucik Install App from app store
		 * @param {*}
		 * @return {*} void
		 */
		quickInstall(id) {
			this.sidebarOpen = false;
			this.$openAPI.appManagement.appStore.composeApp(id, {
				headers: {
					'content-type': 'application/yaml',
					'accept': 'application/yaml'
				}
			}).then(res => {
				if (res.status == 200) {
					// if (!this.checkComposeApp(res.data, id)) {
					// 	return
					// }
					let composeJSON = parse(res.data)
					if (composeJSON["x-casaos"]?.tips?.before_install?.en_us) {
						this.$buefy.modal.open({
							parent: this,
							component: () => import("@/components/Apps/TipEditorModal.vue"),
							hasModalCard: true,
							customClass: '',
							trapFocus: true,
							canCancel: [''],
							scroll: "keep",
							animation: "zoom-in",
							events: {
								submit: () => {
									this.currentInstallId = id
									this.installComposeApp(res.data, id)
								},
							},
							props: {
								composeData: composeJSON
							}
						})
					} else {
						this.installComposeApp(res.data, id)
					}

				} else {
					this.$buefy.toast.open({
						message: this.$t(`There was an error installing the application, please try again!`),
						type: 'is-warning'
					})
				}
			}).catch((e) => {
				this.$buefy.toast.open({
					message: e.response.data.message,
					type: 'is-danger'
				})
			})
		},


		/**
		 * @description: Validate form async
		 * @param {Object} ref ref of component
		 * @return {Boolean}
		 */
		async checkStep(ref) {
			let isValid = await ref.validate()
			return isValid
		},

		/**
		 * @description: Submit datas after valid
		 * @param {*}
		 * @return {*} void
		 */
		installApp() {
			this.$refs.compose.checkStep().then((valid) => {
				if (valid.every(v => v === true)) {
					this.isLoading = true;
					this.installComposeApp(this.dockerComposeCommands, this.currentInstallId).finally(() => {
						this.isLoading = false;
					})
				} else {
					// toast info error.
					this.$buefy.toast.open({
						message: this.$t("Please confirm the input content."),
						duration: 5000,
						type: "is-danger"
					})
				}
			})
		},
		installComposeApp(dockerComposeCommands, appName) {
			return this.$openAPI.appManagement.compose.installComposeApp(dockerComposeCommands, false, true).then(res => {
				if (res.status === 200) {
				} else {
					this.dockerComposeConfig = dockerComposeCommands;
					this.currentSlide = 1;
					this.errInfo = res.data

					this.$buefy.toast.open({
						message: this.$t('The information filled in needs to be corrected'),
						type: 'is-warning'
					})
				}
			}).catch((e) => {
				if (e.response.status === 400) {
					this.dockerComposeConfig = dockerComposeCommands;
					this.currentSlide = 1;
					this.errInfo = e.response.data.data
				}
				this.$buefy.toast.open({
					message: e.response.data || e.response.status,
					type: 'is-danger'
				})
			})
		},

		/**
		 * @description: Save edit update
		 * @return {*} void
		 */
		updateApp() {
			this.$refs.compose.checkStep().then((valid) => {
				if (valid.every(v => v === true)) {

					this.$openAPI.appManagement.compose.applyComposeAppSettings(this.id, this.dockerComposeCommands, false, true).then((res) => {
						if (res.status == 200) {
							this.$emit('updateState')
						} else {
							// this.dockerComposeConfig = dockerComposeCommands;
							// this.currentSlide = 1;
							this.errInfo = res.data

							this.$buefy.toast.open({
								message: this.$t('The information filled in needs to be corrected'),
								duration: 10000,
								type: 'is-warning'
							})
						}
						this.$emit('close')
					}).catch((err) => {
						if (err.response.status === 400) {
							console.log("Get ERROR:", err.response.data)
							this.errInfo = err.response.data
						}
						this.$buefy.toast.open({
							message: err.response.data.message,
							duration: 5000,
							type: 'is-warning'
						})
					})
				} else {
					// toast info error.
					this.$buefy.toast.open({
						message: this.$t("Please confirm the input content."),
						duration: 5000,
						type: "is-danger"
					})
				}
			})
		},

		updateContainer() {
			this.$refs.containerValida.validate().then((valid) => {
				if (valid) {
					this.$api.container.update(this.id, this.settingData).then((res) => {
						if (res.data.success == 200) {
							this.isLoading = false;
							this.$emit('updateState')
						} else {
							this.$buefy.toast.open({
								message: res.data.message.data,
								type: 'is-warning'
							})
						}
						this.$emit('close')
					}).catch((err) => {
						this.isLoading = false;
						this.$buefy.toast.open({
							message: err.response.data.message,
							type: 'is-warning'
						})
					})
				}
			})
		},

		/**
		 * @description: Show import panel
		 * @return {*} void
		 */
		showImportPanel() {
			this.$buefy.modal.open({
				parent: this,
				component: ImportPanel,
				hasModalCard: true,
				customClass: '',
				trapFocus: true,
				canCancel: ['escape'],
				scroll: "keep",
				animation: "zoom-in",
				events: {
					'update': (e) => {
						this.dockerComposeConfig = e;
						this.$buefy.dialog.alert({
							title: '⚠️ ' + this.$t('Attention'),
							message: '<div class="nobrk"><h4 class="title is-5">' + this.$t('AutoFill only helps you to complete most of the configuration.') + '</h4>' +
								'<p class="mb-3">' + this.$t('Some configuration information such as:') + '</p>' +
								'<ul>' +
								'<li>1. ' + this.$t('the port and path of the Web UI') + '</li>' +
								'<li>2. ' + this.$t('the mount location of the volume or file') + '</li>' +
								'<li>3. ' + this.$t('the port mapping of the Host') + '</li>' +
								'<li>4. ' + this.$t('optional configuration items') + '</li>' +
								'</ul>' +
								'<p class="mt-3">' + this.$t('These include but are not limited to these cases and <b>still need to be confirmed or modified by you.</b>') + '</p>' +
								'<p class="mt-3">' + this.$t('Feel free to suggest improvements to this feature in Discord Server!') + '</p></div>',
							type: 'is-dark'
						})
					}
				},
				props: {
					netWorks: this.networks,
					oriNetWorks: this.tempNetworks,
					deviceMemory: this.totalMemory
				}
			})
		},

		/**
		 * @description: Export AppData to json file
		 * @param {*} function
		 * @return {*} void
		 */
		exportYAML() {
			let title = YAML.parse(this.dockerComposeCommands)?.["x-casaos"]?.["title"]
			if (title) {
				title = ice_i18n(title)
			} else {
				title = this.currentInstallId
			}
			const blob = new Blob([this.dockerComposeCommands], {type: ''});
			FileSaver.saveAs(blob, `${title}.yaml`);
		},




		/**
		 * @description: Show Terminal & Logs panel
		 * @return {*} void
		 */
		showTerminalPanel() {
			this.$openAPI.appManagement.compose.composeAppContainers(this.id).then((res) => {
				if (res.status == 200) {
					const containers = res.data.data.containers;
					const main = res.data.data.main
					const containerId = containers[this.dockerComposeServiceName].ID;
					this.$buefy.modal.open({
						parent: this,
						component: AppTerminalPanel,
						hasModalCard: true,
						customClass: 'terminal-modal',
						trapFocus: true,
						canCancel: [],
						scroll: "keep",
						animation: "zoom-in",
						props: {
							appid: containerId,
							appName: this.currentInstallId,
							serviceName: this.dockerComposeServiceName,
						}
					})
				}
			}).catch((err) => {
				console.log('$openAPI.appManagement.compose.composeAppContainers', err.response)
			})
		},

		async submitInstallationLocation(val) {
			this.isLoading = true
			let path = ''
			if (val === '/') {
				path = val + 'var/lib/docker'
			} else {
				path = val + '/docker'
			}
			try {

				// await this.$api.folder.create(path)
				await this.$openAPI.iceFile.putFile(path)
			} catch (e) {
				this.$buefy.toast.open({
					message: this.$t('Error when creating installation path for apps'),
					type: 'is-danger'
				})
				return
			}

			this.$api.container.putInstallationLocation(path).then(data => {
				this.isLoading = false
				this.isFirstInstall = data.data.docker_root_dir
			}).catch(err => {
				this.isLoading = false
				console.log(`${err} in submitInstallationLocation`)
				this.$buefy.toast.open({
					message: err.message,
					type: 'is-danger'
				})
			})
		},

		installAppProgress(resData) {
			if (this.currentInstallAppName != resData.name) {
				return false
			}
			if (!resData.finished) {
				this.currentInstallAppError = !resData.success;
				if (resData.success) {
					this.currentInstallAppType = resData.type;
					if (resData.message !== "") {
						const messageArray = resData.message.split(/[(\r\n)\r\n]+/);
						messageArray.forEach((item, index) => {
							if (!item) {
								messageArray.splice(index, 1);
							}
						})
						messageArray.forEach(item => {
							const evt = JSON.parse(item)
							this.totalPercentage = this.dockerProgress.getProgress(evt)
						})
						if (this.totalPercentage === 0) {
							this.currentInstallAppText = 'Starting installation'
						} else if (this.totalPercentage === 100) {
							this.currentInstallAppText = 'Installation completed'
						} else {
							this.currentInstallAppText = 'Installing'
						}
					}
				} else {
					this.currentInstallAppText = resData.message
				}
			} else {
				localStorage.removeItem("app_data")
				// business :: Tagging of new app / scrollIntoView
				this.addIdToSessionStorage(resData.name)

				setTimeout(() => {
					this.$emit('updateState')
					this.$emit('close')
				}, 500)
			}
		},

		updateDockerComposeCommands(val) {
			this.dockerComposeCommands = val
		},

		updateDockerComposeServiceName(val) {
			this.dockerComposeServiceName = val
		},
	},

	destroyed() {
		window.addEventListener('resize', this.setCSSVHVar);
		clearInterval(this.timer)
	},

	sockets: {
		"app:install-begin"(res) {
			this.currentInstallAppName = res.Properties["app:name"];
			this.currentSlide = 2;
			this.currentInstallAppText = "Start Installation..."
			this.cancelButtonText = 'Continue in background'
			this.dockerProgress = new DockerProgress();
		},
		"app:install-end"(res) {
			this.installAppProgress({
				finished: true,
				name: res.Properties["app:name"],
				id: res.Properties["docker:container:id"]
			});
		},
		"app:install-error"(res) {
			this.installAppProgress({
				finished: false,
				name: res.Properties["app:name"],
				id: res.Properties["docker:container:id"],
				success: false,
				message: res.Properties["message"]
			});
		},
		"docker:image:pull-progress"(res) {
			this.installAppProgress({
				finished: false,
				name: res.Properties["app:name"],
				id: res.Properties["docker:container:id"],
				success: true,
				type: "pull",
				message: res.Properties["message"]
			});
		},
	}
}
</script>


<style lang="scss">
// appPanel global style
.app-panel {
	._stepStoreList {
		min-height: calc(100vh - 2.5rem);

		.modal-card-body {
			overflow-y: scroll;
			overflow-x: clip;
		}
	}
}



.install-animation {
	width: 100px;
	height: 100px;
}

.creating-animation {
	width: 16rem;
	height: 16rem;
}


@media screen and (min-width: 769px) {
	.app-panel {
		.animation-content {
			max-width: 90% !important;
		}

		.modal-card {
			width: 90vw;
			transition: all 0.3s;

			&.narrow {
				width: 50rem !important;
			}

			._pl {
				margin-right: 0;
				margin-left: calc(90vw - 100%);
			}
		}
	}
}

@media screen and (min-width: 1440px) {
	.app-panel {
		.modal-card {
			width: 81rem !important;

			._pl {
				margin-right: 0;
				margin-left: calc(81rem - 100%);
			}
		}
	}
}

@media screen and (max-width: 1366px) {
	.f-list {
		.is-one-quarter {
			width: 33.333333% !important;
		}
	}
}

@media screen and (max-width: 1024px) {
	.f-list {
		.is-one-quarter {
			width: 50% !important;
		}
	}
}

@media screen and (max-width: 768px) {
	.modal-card {
		max-height: calc(var(--vh, 1vh) * 100);
		border-radius: 0;

		._pl {
			margin-right: 0;
			margin-left: calc(100vw - 100%);
		}
	}
}

@media screen and (max-width: 480px) {
	.f-list {
		.is-one-quarter {
			width: 100% !important;
		}
	}
}

.pri-line-height {
	line-height: 1.875rem;
}

.pri-message-alert {
	//padding: 0.4rem 1rem;
	height: 2rem;
	//text-align: center;
	margin-top: 0.5rem;
	margin-bottom: 1rem;
	background: #FFF6E5;
	border-radius: 0.25rem;
	color: #d99000;
	font-size: 0.875rem;
	font-style: normal;
}

.is-overlay {
	overflow: overlay;
}

.card-width {
	max-width: 35rem;
	min-width: 30rem;
}
</style>
<style lang="scss" scoped>
.close {
	height: 2rem;
	width: 2rem;
	border-radius: 0.375rem;
}

.button[disabled] {
	opactiy: 0.3;
}

._title {
	/* Text 500Medium/Text02 */

	font-family: 'Roboto';
	font-style: normal;
	font-weight: 500;
	font-size: 1rem;
	line-height: 1.5rem;
	/* identical to box height, or 150% */

	font-feature-settings: 'pnum' on, 'lnum' on;

	/* Gary/800 */

	color: #29343D;
}

._hideOverflow {
	overflow: unset;
}

._b-line {
	border-bottom: 1px solid hsla(208, 16%, 94%, 1) !important;
}

.progress {
	border-radius: 6px;
	height: 12px;

	&::-webkit-progress-bar {
		background: rgba(172, 184, 195, 0.4);
	}

	&::-webkit-progress-value {
		opacity: 1;
	}
}

// 0.4.4
._polymorphic:hover {
	cursor: pointer;
	background: hsla(208, 16%, 96%, 1);
}

._polymorphic:active {
	background: hsla(208, 16%, 94%, 1);
}

._polymorphic-attention:hover {
	cursor: pointer;
	background: hsla(18, 98%, 94%, 1);
}

._polymorphic-attention:active {
	background: hsla(18, 100%, 80%, 1);
}

._dropdown {
	height: 2rem;
	border-radius: 0.25rem;

	._dropdown__typeIcon {
		margin-left: 0.625rem;
		width: 18px;
		height: 18px;
	}

	._dropdown__stateIcon {
		margin-right: 0.625rem;
		width: 16px;
		height: 16px;
	}

	._dropdown__item {
		width: 112px;
		margin-right: 6px;
		margin-bottom: 2px;
	}
}

</style>
