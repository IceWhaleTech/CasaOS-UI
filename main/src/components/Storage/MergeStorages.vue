<template>
	<div :class="{ '_max-width-320': currentStep === 1 || currentStep === 3 || currentStep === 4 }" class="modal-card">
		<!--    head-->
		<header :class="{ 'pri-head': currentStep <= 2 }" class="modal-card-head ">
			<b-icon v-if="currentStep === 1" class="mr-2 has-text-red" custom-class="_has-text-red-default"
					icon="danger"
					pack="casa" size="is-20"></b-icon>
			<div class="is-flex-grow-1">
				<h3 class=" title is-3">{{ $t(title) }}
					<cToolTip v-if="currentStep === 0" modal="is-success"></cToolTip>
				</h3>
			</div>
			<button class="delete" type="button" @click="cancel"/>
		</header>
		<!--remind-->

		<section v-if="currentStep === 0"
				 class="notification is-overlay mr-5 ml-5 mb-0 pr-0 pl-0 pt-5 pb-3 non-backgroud">
			<div v-if="currentStep === 0" class="_is-normal _has-text-gray-600 mb-4">
				{{ $t('All the checked Storage will be merged into CasaOS HD.') }}
			</div>

			<div v-for="(item, index) in storageData" :key="item.path + index" class="is-flex mb-1 radius _height-40">
				<div class="ml-2 mr-1 is-flex is-align-items-center _has-text-gray-600">
					<b-icon icon="storage-other" pack="casa" size="is-20"></b-icon>
				</div>
				<div class="is-flex is-flex-grow-1 is-flex-direction-column is-justify-content-center ">
          <span class="is-uppercase one-line _is-text-emphasis-03 _has-text-gray-800">{{
				  item.name || $t('undefined')
			  }}</span>
				</div>
				<div class="is-flex is-flex-shrink-0 is-flex-direction-column is-justify-content-center mr-2">
          <span class="is-uppercase _is-text-full-03 _has-text-gray-600">{{
				  renderSize(item.size -
					  item.availSize)
			  }}/{{ renderSize(item.size) }}</span>
				</div>
				<b-checkbox v-model="checkBoxGroup" :disabled="item.persistedIn !== 'casaos' || item.isSystem"
							:native-value="item.uuid" class="mr-2"></b-checkbox>
			</div>

			<div v-for="(item, index) in storageMissData" :key="item.path + index"
				 class="is-flex mb-1 radius _height-40">
				<div class="ml-2 mr-1 is-flex is-align-items-center _has-text-gray-600">
					<b-icon icon="storage-other" pack="casa" size="is-20"></b-icon>
				</div>
				<div class="is-flex is-flex-grow-1 is-flex-direction-column is-justify-content-center ">
          <span class="is-uppercase one-line  _is-text-emphasis-03 _has-text-gray-800">{{
				  item.name || $t('undefined')
			  }}</span>
				</div>
				<div class="is-flex is-flex-shrink-0 is-flex-direction-column is-justify-content-center mr-2">
          <span class="is-flex is-align-items-center has-text-danger small-font">
            <b-icon class="warn" custom-size="casa-16px" icon="danger" pack="casa"></b-icon>
            {{ $t('Missing') }}
          </span>
				</div>
				<b-checkbox v-model="checkBoxMissGroup" :native-value="item.path" class="mr-2"></b-checkbox>
			</div>
		</section>

		<div v-if="currentStep === 0 && storageData.length < 2"
			 class="_has-background-yellow-default _has-text-white _is-normal is-flex is-align-items-center font ml-5 mr-5 mb-4 pt-2 pb-2 _radius-line">
			<div class="is-flex left ml-3 mr-2 is-align-items-center">
				<b-icon class="is-16x16" custom-size="casa-19px" icon="danger" pack="casa"></b-icon>
			</div>
			{{ $t('At least one extra hard drive is needed for this feature.') }}
		</div>
		<div v-if="currentStep === 0 && checkBoxGroup.length > 0"
			 class="_has-background-yellow-default _has-text-white _is-normal is-flex is-align-items-center font ml-5 mr-5 mb-4 pt-2 pb-2 _radius-line">
			<div class="is-flex left ml-3 mr-2 is-align-items-center">
				<b-icon class="is-16x16" custom-size="casa-19px" icon="danger" pack="casa"></b-icon>
			</div>
			{{ $t('If the chosen storage is not empty, format better first.') }}
		</div>
		<div v-if="currentStep === 0 && isSplit"
			 class="_has-background-red-default _has-text-white _is-normal is-flex is-align-items-center ml-5 mr-5 mb-4 pt-2 pb-2 _radius-line">
			<div class="is-flex left ml-3 mr-2 is-align-items-center">
				<b-icon custom-size="casa-19px" icon="danger" pack="casa"></b-icon>
			</div>
			{{ $t('Please back up your data in storage, otherwise the data may be lost.') }}
		</div>
		<div v-if="currentStep === 0"
			 class="_has-background-red-default _has-text-white _is-normal is-flex is-align-items-center ml-5 mr-5 mb-4 pt-2 pb-2 _radius-line">
			<div class="is-flex left ml-3 mr-2 is-align-items-center">
				<b-icon custom-size="casa-19px" icon="danger" pack="casa"></b-icon>
			</div>
			{{
				$t(`* This feature is now testing and verifying, enabling it may clear personal data and destroy the
			installed APPs, so it is recommended to use it only during the startup.`)
			}}
		</div>

		<section v-if="currentStep > 0"
				 class="notification is-overlay mr-5 ml-5 mb-0 pr-0 pl-0 pt-5 pb-4 non-backgroud">
			<div v-if="currentStep === 1" class="is-flex is-align-items-center _is-normal">
				{{
					$t('This operation may clear all personal data and destroy the installed APPs.')
				}}
			</div>
			<template v-if="currentStep === 2">
				<div class="font">
					{{ $t('Enter "I AM SURE" to proceed with the operation.') }}
				</div>
				<b-input ref="inputPassword" v-model="password" class="mt-4" password-reveal
						 @keyup.enter.native="verifyOperate(password)"></b-input>
			</template>
			<div v-if="currentStep === 3" class="is-flex is-align-items-center font">
				<div class="message-danger left mr-2 is-flex is-align-items-center">
					<b-icon class="is-38x38" custom-size="is-size-2" icon="danger" pack="casa"></b-icon>
				</div>
				{{ $t('APPs is running') + ` , ` + $t('restart APPs to continue.') }}
			</div>
			<div v-if="currentStep === 4" class="is-flex is-align-items-center font">
				<div class="message-danger left mr-2 is-flex is-align-items-center">
					<b-icon class="is-38x38" custom-size="is-size-2" icon="danger" pack="casa"></b-icon>
				</div>
				{{ runName + $t(' is running, restart ') + runName + $t(' to continue.') }}
			</div>
		</section>

		<footer :class="{ 't-line': currentStep <= 2 }" class="modal-card-foot is-flex is-align-items-center ">
			<div class="is-flex-grow-1"></div>
			<div class="mr-4">
				<b-button v-show="currentStep > 2 || currentStep === 1" :label="$t('Cancel')"
						  class="_has-background-gray-100 _radius-line" expaned @click="currentStep = 0"/>
			</div>
			<div>
				<b-button v-show="currentStep === 0" :label="$t(affirm)" :loading="isConnecting" expaned rounded
						  type="is-primary" @click="test"/>
				<b-button v-show="currentStep === 1" :label="$t(affirm)" :loading="isConnecting"
						  class="_has-background-red-default _radius-line _has-text-white" expaned
						  @click="currentStep = 2"/>
				<b-button v-show="currentStep === 2" :label="$t(affirm)" :loading="isConnecting" expaned rounded
						  type="is-primary" @click="verifyOperate(password)"/>
				<b-button v-show="currentStep === 3" :label="$t(affirm)" :loading="isConnecting" expaned rounded
						  type="is-primary" @click="restart"/>
				<b-button v-show="currentStep === 4" :label="$t(affirm)" :loading="isConnecting" expaned rounded
						  type="is-primary" @click="restart"/>
			</div>
		</footer>
	</div>
</template>

<script>
import {mixin}    from "@/mixins/mixin";
import events     from '@/events/events';
import cToolTip   from '@/components/basicComponents/tooltip/tooltip.vue';
import filter     from 'lodash/filter';
import {ice_i18n} from "@/mixins/base/common-i18n";

export default {
	name: "MergeStorages",
	mixins: [mixin],
	props: {
		mergeStorageList: {
			type: Array,
			required: true,
			default: () => []
		},
	},
	components: {
		cToolTip
	},
	mounted() {
		this.checkBoxGroup.push(...this.mergeStorageList)
		this.getDiskList();
	},
	watch: {
		// 0 default :mainstorage settings
		// 1 test whether the storage is empty :: 1 is empty
		// 2 Data Protected :: input password  :: 2 is not empty
		// 3 APPs Restart
		// 4 APP Restart
		currentStep(val) {
			switch (val) {
				case 0:
					this.title = "Merge Storages";
					this.affirm = "Submit";
					break;
				case 2:
					this.title = "Data Protected";
					this.affirm = "Submit";
					this.$nextTick(() => {
						this.$refs.inputPassword.focus();
					});
					break;
				case 3:
					this.title = "APPs Restart";
					this.affirm = "Restart";
					break;
				case 4:
					this.title = "APP Restart";
					this.affirm = "Restart";
					break;
				default:
					break;
			}

		}
	},
	computed: {
		extended() {
			return this.checkBoxGroup.join(":")
		},
		isSplit() {
			return !this.mergeStorageList.every(item => this.checkBoxGroup.includes(item) || this.storageMissData.includes(item))
		}
	},
	data() {
		return {
			storageData: [],
			storageMissData: [],
			diskData: {},
			unDiskData: {},
			checkBoxGroup: [],
			checkBoxMissGroup: [],
			isConnecting: false,
			currentStep: 0,
			title: "Merge Storages",
			affirm: "Submit",
			mergeInfo: [],
			password: '',
			runName: '',
			notEmpty: false
		}
	}
	,
	methods: {
		/**
		 * @description: Get disk list
		 * src/components/Storage/StorageManagerPanel.vue:234
		 */
		async getDiskList() {
			// get storage list
			// TODO: the part is repetition
			//  with APPs Installation Location requirement document
			// const storageRes = await this.$api.storage.list({system: "show"})
			const storageRes = await this.$api.storage.list()
			const storageArray = []
			const storageMissArray = []
			let testMergeMiss = this.mergeStorageList
			storageRes.data.data.forEach(item => {
				item.children.forEach(part => {
					part.disk = item.path
					part.diskName = item.disk_name
					storageArray.push(part)
					testMergeMiss = testMergeMiss.filter(v => v !== part.uuid)
				})
			})
			this.checkBoxMissGroup.push(...testMergeMiss);
			testMergeMiss.forEach(item => {
				storageMissArray.push({
					"uuid": "",
					"mount_point": "",
					"size": "",
					"avail": "",
					"type": "",
					"path": item,
					"drive_name": "",
					"label": "",
					"persisted_in": "",
					"disk": "",
					"diskName": ""
				})
			})

			this.storageData = storageArray.map((storage) => {
				return {
					uuid: storage.uuid,
					name: storage.label,
					isSystem: storage.diskName === "System",
					fsType: storage.type,
					size: storage.size,
					availSize: storage.avail,
					usePercent: 100 - Math.floor(storage.avail * 100 / storage.size),
					diskName: storage.drive_name,
					path: storage.path,
					mount_point: storage.mount_point,
					disk: storage.disk,
					persistedIn: storage.persisted_in,
				}
			})

			this.storageMissData = storageMissArray.map((storage) => {
				return {
					uuid: storage.uuid,
					name: storage.label,
					isSystem: storage.diskName === "System",
					fsType: storage.type,
					size: storage.size,
					availSize: storage.avail,
					usePercent: 100 - Math.floor(storage.avail * 100 / storage.size),
					diskName: storage.drive_name,
					path: storage.path,
					mount_point: storage.mount_point,
					disk: storage.disk,
					persistedIn: storage.persisted_in,
				}
			})
		},

		/**
		 * @description: update merge info
		 * sync function
		 */
		updateMerge(dockerInfo) {
			// update merge api
			this.$api.local_storage.updateMergerfsInfo({
				"fstype": "fuse.mergerfs",
				"mount_point": "/DATA",
				"source_volume_uuids": [
					...this.checkBoxGroup, ...this.checkBoxMissGroup
				]
			}).then(res => {
				// started all containers
				Promise.all(dockerInfo.map(async item => {
					if (item.app_type === "v2app") {
						await this.$openAPI.appCompose.setComposeAppStatus(item.name, "start")
					} else {
						await this.$api.container.updateState(item.name, "start")
					}
				})).then(() => {
					this.$buefy.toast.open({
						message: 'Merge Storages Success',
						type: 'is-success',
						position: 'is-top',
						duration: 5000,
						queue: true,
						indefinite: false,
						onDismiss: () => {
							this.$router.push({name: 'StorageManager'})
						}
					})
					this.$EventBus.$emit(events.RELOAD_APP_LIST)
				}).catch(e => {
					this.$buefy.toast.open({
						message: e.response.data.data || e.response.data.message,
						type: "is-danger",
						position: "is-top",
						duration: 5000,
					});
					console.error(e)
				}).then(() => {
					// TODO : need to check the result by the states code
					switch (res.status) {
						case 200:
						case 400:
						default:
							this.isConnecting = false
							// refresh local storage
							this.$EventBus.$emit(events.RELOAD_MOUNT_LIST)
							// close the modal
							this.$emit('close')
					}
				})
			})
		}
		,

		// get the storage list be mounted of mergerfs
		async getMerageStorage() {
			try {
				// TODO merge can't be used
				this.mergeInfo = await this.$api.local_storage.getMergerfsInfo().then(res => res.data.data[0]["source_volume_uuids"]).catch(() => [])
				this.checkBoxGroup.push(...this.mergeInfo)
			} catch (e) {
				console.log(e)
			}
		},
		cancel() {
			this.$emit('close')
		},
		async test() {
			this.isConnecting = true
			// submit
			this.$messageBus('storagemanager_mergestorage');
			this.notEmpty = await this.$api.folder.getFolderSize('/DATA').then(res => {
				return res.data.data
			}).catch(e => {
				this.$buefy.toast.open({
					message: e.response.data.data || e.response.data.message,
					type: "is-danger",
					position: "is-top",
					duration: 5000,
				});
				console.error(e)
			}).then(() => {
				this.isConnecting = false
			})
			// business :: If storage is empty, no reminder
			if (this.notEmpty) {
				this.title = "Reset Warning"
				this.affirm = "Reset"
				this.currentStep = 1
			} else {
				this.submit()
			}
		},
		//
		async submit(e, nextStep = false) {
			// operation : split the mergerfs
			let notSplit = this.mergeStorageList.every(item => this.checkBoxGroup.includes(item) || this.checkBoxMissGroup.includes(item))
			if (notSplit || nextStep) {
				// get docker info
				let dockerInfo = await this.$openAPI.appGrid.getAppGrid().then(res => res.data.data || [])
				dockerInfo = filter(dockerInfo, {status: "running"})
				if (this.notEmpty) {
					this.restart()
					return
				} else if (dockerInfo.length === 1) {
					this.currentStep = 4
					this.runName = ice_i18n(dockerInfo[0].title)
					return
				} else if (dockerInfo.length > 1) {
					this.currentStep = 3
					this.runName = dockerInfo.map(item => ice_i18n(item.title)).join(',')
					return
				} else {
					this.restart()
					return
				}
			}
			this.currentStep = 2
		},

		async restart() {
			this.isConnecting = true
			try {
				// 将所有应用重启。
				// 1、 获取应用信息，主要是运行中的应用. 2、关闭应用 3、合并磁盘 4、启动应用
				let dockerInfo = await this.$openAPI.appGrid.getAppGrid().then(res => res.data.data || [])
				dockerInfo = filter(dockerInfo, {status: "running"})
				const container = this.$api.container
				const compose = this.$openAPI.appCompose
				Promise.all(dockerInfo.map(async item => {
					if (item.app_type === "v2app") {
						await compose.setComposeAppStatus(item.name, 'stop')
					} else {
						await container.updateState(item.name, "stop")
					}
				})).then(() => {
					this.$api.local_storage.getInitMergerfsStatus().then(res => {
						if (res.data.data !== 'initialized') {
							this.$api.local_storage.initMergerfs({"mount_point": "/DATA"}).then(() => {
								this.updateMerge(dockerInfo)
							}).catch(e => {
								this.isConnecting = false
								this.$buefy.toast.open({
									message: e.response.data.data || e.response.data.message,
									type: "is-danger",
									position: "is-top",
									duration: 5000,
								});
								console.error(e)
							})
						} else {
							this.updateMerge(dockerInfo)
						}
					})
				}).catch((e) => {
					this.isConnecting = false
					this.$buefy.toast.open({
						duration: 5000,
						message: e.response.data.data || e.response.data.message,
						position: "is-top",
						type: 'is-danger'
					})
					console.error(e)
				})
			} catch (e) {
				console.log(e)
			}

		},

		verifyOperate(content) {
			if (content === "I AM SURE") {
				this.submit(null, true);
				return
			}
			this.$buefy.toast.open({
				duration: 5000,
				message: this.$t("Incorrect input."),
				type: 'is-danger'
			})
		}

	}
	,
}
</script>

<style lang="scss" scoped>
.non-backgroud {
	background: none;
}

.pri-head {
	line-height: 1.875rem;
	border-bottom: rgba(0, 0, 0, 0.1) 1px solid !important;
}

.pri-margin {
	margin: 2rem;
}

.pri-mrl-2rem {
	margin-left: 2rem;
	margin-right: 2rem;

	.pri-mtr-3px {
		margin-top: 0.1875rem;
		margin-bottom: 0.1875rem;
		min-height: 2.75rem;
		border-radius: 0.25rem;
	}

	div:hover {
		background: hsla(215, 89%, 93%, 1);
	}
}

._is-normal {
	/* Text 400Regular/Text03 */

	font-family: $family-sans-serif;
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	/* identical to box height, or 143% */

	font-feature-settings: 'pnum' on, 'lnum' on;
}

._is-text-emphasis-03 {
	/* Text 500Medium/Text03 */

	font-family: $family-sans-serif;
	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	/* identical to box height, or 143% */

	font-feature-settings: 'pnum' on, 'lnum' on;
}

._is-text-full-03 {
	/* Text 400Regular/Text03 */

	font-family: $family-sans-serif;
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	/* identical to box height, or 143% */

	text-align: right;
	font-feature-settings: 'pnum' on, 'lnum' on;
}

._has-text-gray-800 {
	/* Gary/800 */

	color: hsla(208, 20%, 20%, 1);
}

._has-text-gray-600 {
	/* Gary/600 */
	color: hsla(208, 14%, 58%, 1);
}

._has-text-red-default {
	/* Red/Default */
	color: hsla(18, 98%, 55%, 1);
}

._has-text-white {
	/* White/White */
	color: hsla(0, 0%, 100%, 1);
}

._has-background-red-default {
	/* Red/Default */
	background: hsla(18, 98%, 55%, 1);
}

._has-background-yellow-default {
	/* Red/Default */
	background: hsla(44, 98%, 46%, 1)
}

._has-background-gray-100 {
	/* Gray/100 */
	background: hsla(208, 16%, 96%, 1);
}

._height-40 {
	height: 2.5rem;
}

//._is-20x20 {
//	width: 1.25rem;
//	height: 1.25rem;
//}

.small-font {
	font-family: $family-sans-serif;
	font-size: 12px;
	font-weight: 400;
	line-height: 18px;
	letter-spacing: 0;
}

.radius {
	box-sizing: border-box;
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 0.375rem;
}

._radius-line {
	border-radius: 0.375rem;
	border: 0 solid rgba(0, 0, 0, 0);
}

.pri-text-color {
	color: hsla(0, 0%, 0%, 0.4);
}

.message-danger {
	color: hsla(348, 86%, 61%, 1);
}

.message-alert {
	height: 2rem;
	margin-top: 0;
	margin-bottom: 1rem;
	margin-left: 2rem;
	margin-right: 2rem;
	border-radius: 0.25rem;
	color: hsla(40, 100%, 43%, 1);
	font-size: 0.875rem;
	font-style: normal;
	background: hsla(40, 100%, 95%, 1);
}

.pri-message-danger {
	height: 2rem;
	margin-top: 0;
	margin-bottom: 1rem;
	margin-left: 2rem;
	margin-right: 2rem;
	border-radius: 0.25rem;
	color: hsla(348, 86%, 61%, 1);
	font-size: 0.875rem;
	font-style: normal;
	background: hsla(348, 100%, 95%, 1);
}

.t-line {
	border-top: rgba(0, 0, 0, 0.1) 1px solid !important;
}

.warn {
	color: hsla(348, 86%, 61%, 1);
}

.is-38x38 {
	width: 2.375rem;
	height: 2.375rem;
}

._max-width-320 {
	max-width: 20rem;
}
</style>
<style lang="scss">
.pri-mtr-3px .control-label {
	display: none;
}
</style>
