<!--
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-01-11 22:50:58
 * @FilePath: \CasaOS-UI-0.4.1\src\components\filebrowser\FilePanel.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->

<template>
	<div class="modal-card">

		<!-- Modal-Card Body Start -->
		<section class="modal-card-body is-flex">

			<!-- Viewer Start -->
			<transition name="c-zoom-in">
				<component :is="panelType" v-if="isShowDetial" ref="previewPanel" :item="currentItem" :list="listData"
				           @close="isShowDetial = false; isModalOpen = false"></component>
			</transition>
			<!-- Viewer End -->

			<template>
				<!-- NavBar Start -->
				<div class="nav-bar is-flex is-flex-direction-column">
					<div class="is-flex-grow-1 is-flex-shrink-1 nav-bar-top  scrollbars-light">
						<!-- Files Start -->
						<div class="files-section ">
							<!--  storage settings requirement document -->
							<div class="is-flex is-align-items-center pt-3">
								<div class=" is-flex-grow-1">
									<h3 class="title is-3 mb-0 pb-3 pt-3 has-text-left">{{ $t('Files') }}</h3>
								</div>
								<div v-show="hasMergerFunction" class="is-flex-shrink-0  mr-5"
								     @click="showStorageSettingsModal">
									<b-icon custom-size="mdi-18px" icon="cog-outline"></b-icon>
								</div>
							</div>
							<div class="list-container scrollbars-light pt-0 is-flex-grow-1">
								<tree-list ref="navBar" :autoLoad="true" :isActive="!isShareList"
								           :path="rootPath"></tree-list>
							</div>
						</div>

						<!-- Files End -->

						<!-- Mounted Start -->
						<div class="mounted-section">
							<div class="is-flex is-align-items-center">
								<div class=" is-flex-grow-1">
									<h3 class="title is-3 mb-0 pb-3 pt-3 has-text-left">{{ $t('Location') }}</h3>
								</div>
								<div class=" is-flex-shrink-0 mr-5">
									<mount-action-button></mount-action-button>
								</div>
							</div>

							<div class="list-container pt-0 is-flex-grow-1">
								<mount-list ref="mountedList" :autoLoad="true" :hasMergerFunction="hasMergerFunction"
								            :isActive="!isShareList" :path="rootPath"></mount-list>
							</div>

						</div>
						<!-- Mounted End -->
					</div>

					<!-- Bottom Action Start -->
					<div class="bottom-area">
						<share-entry-button :active="isShareList" @open="showSharedList"></share-entry-button>
					</div>
					<!-- Bottom Action End -->
				</div>
				<!-- NavBar Start -->

				<!-- Main Content Start -->
				<div v-if="!isShareList" class="content is-flex-grow-1">
					<uploader ref="uploader" :options="options" class="uploader-example">
						<uploader-unsupport></uploader-unsupport>
						<!-- Header Start -->
						<header class="modal-card-head">
							<div id="bread-container" class="is-flex-grow-1 is-flex breadcrumb-container">
								<file-breadcrumb></file-breadcrumb>
								<!-- <b-input placeholder="Search in folder..." size="is-small" rounded></b-input> -->
							</div>
							<div class="is-flex is-align-items-center">

								<!-- Paste Button Start -->
								<b-button v-if="hasPasteData" :label="$t('Paste')" :loading="isPasting" class="mr-3"
								          icon-left="content-paste" rounded size="is-small" type="is-success"
								          @click="paste('overwrite')"/>
								<!-- Paste Button End -->

								<!-- Operation Status Start-->
								<operation-status-bar></operation-status-bar>
								<!-- Operation Status End-->

								<!-- Upload Button Start -->
								<global-action-button @showNewFileModal="showNewFileModal"
								                      @showNewFolderModal="showNewFolderModal"></global-action-button>
								<!-- Upload Button End -->

								<!--  Close Button Start -->
								<div
										class="is-flex is-align-items-center modal-close-container modal-close-container-line ">
									<button class="delete" type="button" @click="$emit('close')"/>
								</div>
								<!--  Close Button End -->

							</div>
						</header>
						<!-- Header End -->

						<!-- Tool Bar Start -->
						<div class="tool-bar is-flex mb-2">
							<div class=" is-flex-grow-1 has-text-left is-flex  is-align-items-center">
								<b-field class="ml-3 is-flex is-size-14px mb-0">
									<b-checkbox v-model="isSelectAll" :class="selectState" size="is-small"
									            @input="handleSelect">
										{{ $t("select-items", selectLabel) }}
									</b-checkbox>
								</b-field>
							</div>
							<div class="view-btns is-flex-shrink-0">
								<b-tooltip :label="$t('Change View')" position="is-left" type="is-dark">
									<p class="is-clickable none-line-height" role="button" @click="changeView">
										<b-icon :icon="viewIcon"></b-icon>
									</p>
								</b-tooltip>
							</div>
						</div>
						<!-- Tool Bar End -->

						<!-- List View Start -->
						<div id="dropTarget">

							<!-- Drag and Drop Mask Start -->
							<div v-if="isDragIn"
							     class="drag-mask is-flex is-align-items-flex-end is-flex-direction-row">
								<div class="mb-6">
									<div class="upload-icon">
										<b-icon icon="arrow-up" size="is-medium" type="is-white"></b-icon>
									</div>
									<p class="has-text-primary">
										{{ $t('Upload to') }} {{ currentPathName }}
									</p>
								</div>
							</div>
							<!-- Drag and Drop Mask End -->

							<component :is="listView" ref="listview" v-model="listData" :isLoading="isLoading"
							           @change="handelListChange" @gotoFolder="getFileList" @reload="reload"
							           @showDetailModal="showDetailModal">
								<empty-holder @newFile="showNewFileModal"
								              @newFolder="showNewFolderModal"></empty-holder>
							</component>

						</div>
						<!-- List View End -->

						<!-- Upload List Start-->
						<div v-show="showUploadList" class="upload-list">
							<b-collapse ref="uploadList" animation="slide1" aria-id="contentIdForA11y3" class="card">
								<template #trigger="props">
									<div :aria-expanded="props.open" aria-controls="contentIdForA11y3"
									     class="card-header" role="button">
										<p class="card-header-title">
											<b-icon :icon="props.open ? 'chevron-down' : 'chevron-up'"
											        class="mr-2"></b-icon>
											{{ $t(uploaderListHeaderText) }}
										</p>
										<a class="card-header-icon" @click.prevent="closeUploaderList">
											<b-icon icon="close"></b-icon>
										</a>
									</div>
								</template>

								<div class="card-content scrollbars-light">
									<div class="content">
										<uploader-list></uploader-list>
									</div>
								</div>

							</b-collapse>
						</div>
						<!-- Upload List End-->

					</uploader>
					<!-- Toolbar Start -->
					<operation-toolbar v-model="isToolbarShow" @close="handleClose" @copy="handleCopy"
					                   @download="handleDownload" @move="handleMove" @remove="handleRemove"></operation-toolbar>
					<!-- Toolbar End -->
				</div>

				<share-list-page v-else ref="shareList" @close="$emit('close')"></share-list-page>

			</template>
			<!-- Main Content End -->

		</section>
		<!-- Modal-Card Body End -->

	</div>
</template>

<script>

import orderBy from 'lodash/orderBy'
import dropRight from 'lodash/dropRight'
import isEqual from 'lodash/isEqual'

import {mixin} from '@/mixins/mixin';
import events from '@/events/events';

import TreeList from './sidebar/TreeList.vue';
import MountList from './sidebar/MountList.vue';
import ShareEntryButton from './shared/ShareEntryButton.vue';
import ShareListPage from './shared/ShareListPage.vue';
import SelectShareModal from './shared/SelectShareModal.vue'
import ShareDetial from './shared/ShareDetial.vue'

import GirdView from './components/GirdView.vue';
import ListView from './components/ListView.vue';
import FileBreadcrumb from './components/FileBreadcrumb.vue';
import EmptyHolder from './components/EmptyHolder.vue';

import DetailModal from './modals/DetailModal.vue'
import NewFolderModal from './modals/NewFolderModal.vue'
import NewFileModal from './modals/NewFileModal.vue'
import RenameModal from './modals/RenameModal.vue';

import Uploader from './uploader/components/uploader.vue'
import UploaderUnsupport from './uploader/components/unsupport.vue'
import UploaderList from './uploader/components/list.vue'
import OperationToolbar from './components/OperationToolbar.vue';
import OperationStatusBar from './components/OperationStatusBar.vue';
import GlobalActionButton from './components/GlobalActionButton.vue';
import MountActionButton from './components/MountActionButton.vue';
// storage settings requirement document
import MergeStorages from "@/components/Storage/MergeStorages.vue";
import {nanoid} from "nanoid";

export default {
	name: "file-panel",
	mixins: [mixin],
	provide() {
		return {
			filePanel: this
		}
	},
	components: {
		ListView,
		GirdView,
		FileBreadcrumb,
		TreeList,
		Uploader,
		UploaderUnsupport,
		UploaderList,
		CodeEditor: () => import("./viewers/CodeEditor.vue"),
		VideoPlayer: () => import("./viewers/VideoPlayer.vue"),
		ImageViewer: () => import("./viewers/ImageViewer.vue"),
		EmptyHolder,
		OperationToolbar,
		RenameModal,
		OperationStatusBar,
		GlobalActionButton,
		// Shared
		ShareEntryButton,
		ShareListPage,
		MountList,
		MountActionButton,
	},
	data() {
		return {
			isCreated: false,
			isLoading: true,
			isModalOpen: false,
			isDragIn: false,
			isPasting: false,
			isShowDetial: false,
			isShareList: false,
			panelType: null,
			currentItem: null,
			rootPath: "/DATA",
			currentPath: "",
			currentPathName: "",
			isViewGird: true,
			listData: [],
			selectedArray: [],
			file: null,
			timeout: null,
			uploadPercentage: 0,
			hasPasteData: this.$store.state.operateObject != null,
			uploaderInstance: {},
			selectState: "none",
			isSelectAll: false,
			selectLabel: "",
			isToolbarShow: false,

			attrs: {
				accept: '*'
			},
			// Uploader List
			showUploadList: false,
			uploaderListHeaderText: "Uploading",
			usbDisks: [],
			hasMergerFunction: false,
		}
	},
	async created() {
		this.options = {
			target: this.getTargetUrl(),
			testChunks: true,
			uploadMethod: "POST",
			successStatuses: [200, 201, 202, 2002],
			allowDuplicateUploads: true,
			headers: {
				"Authorization": this.$store.state.access_token
			},
			query: (file) => {
				return {
					path: file.targetPath
				}
			}
			// generateUniqueIdentifier: nanoid(),
			// chunkSize: 1024 * 1024 * 1024 * 1024
		}
		// get merge info
		try {
			let hasMergeState = await this.$api.local_storage.getMergerfsInfo().then(res => res.status);
			this.hasMergerFunction = hasMergeState == 200
		} catch (e) {
			console.error(e)
		}
	},

	computed: {
		viewIcon() {
			return this.$store.state.isViewGird ? "view-grid-outline" : "format-list-bulleted"
		},
		listView() {
			return this.$store.state.isViewGird ? "gird-view" : "list-view"
		},
	},
	watch: {
		'$store.state.operateObject': {
			handler(val) {
				this.hasPasteData = (val != null)
			},
			deep: true
		},
		usbDisks(newval, oldval) {
			if (!isEqual(newval, oldval) && newval == "/DATA") {
				this.getFileList(this.currentPath)
			}

		},
		isShareList(val) {
			if (val) {
				this.destroyedAction()
			} else {
				if (document.onpaste === null) {
					this.$nextTick(() => {
						this.beforeInit()
					})

				}
			}
		}

	},
	mounted() {
		this.init();
		if (!this.isShareList) {
			this.beforeInit()
		}

		document.addEventListener('contextmenu', this.hideContextMenu);
		this.$EventBus.$on(events.GOTO, (event) => {
			this.getFileList(event.path)
		});

		this.$EventBus.$on(events.SELECT_SHARE, this.handleSelectShare);
		this.$EventBus.$on(events.UN_SHARE, this.handleUnShare);
	},
	destroyed() {
		this.destroyedAction()
	},

	methods: {
		/*************************************************
		 * PART 0  Self
		 **************************************************/

		beforeInit() {

			this.setUploaderOpts();
			// Listen to ESC button to exit preview
			document.onkeyup = (e) => {
				switch (e.code) {
					case 'Escape':
						if (this.isShowDetial) {
							this.$refs.previewPanel.close();
						}
						break;
					case 'Backspace':
						this.backLevel()
						break;

					default:
						break;
				}
			}
			// paste
			document.onpaste = () => {
				if (!this.isShowDetial && !this.isModalOpen) {
					this.paste('overwrite')
				}
			}
		},

		destroyedAction() {
			this.uploaderInstance.off('dragover')
			this.uploaderInstance.off('uploadStart')
			document.removeEventListener('contextmenu', this.hideContextMenu)
			this.$store.commit('SET_OPERATE_OBJECT', null)
			document.onpaste = null;
			document.onkeyup = null;
		},

		showSharedList() {
			this.isShareList = true
		},

		/**
		 * @description: Init Funtion
		 * @return {*}
		 */
		init(path) {
			let initPath = path || this.rootPath;
			if (this.isCreated) {
				this.getFileList(initPath);
				// this.$refs.mountedList.getStorageList();
			} else {
				this.isCreated = true
			}

		},

		/**
		 * @description: Get File Tree List
		 * @param {String} path
		 * @return {*}
		 */
		getFileList(path) {
			this.isLoading = true;
			// path = path.replace("//", "/")
			this.isShareList = false
			this.currentPath = path
			this.$store.commit('SET_CURRENT_PATH', path)
			this.$api.folder.getList(path).then(res => {
				if (res.data.success == 200) {
					this.isLoading = false;

					this.currentPathName = path.split("/").pop()
					// this.uploaderInstance.opts.query = {
					// 	path: this.currentPath,
					// }


					const fileList = res.data.data
					const newFileList = fileList.map(item => {
						return {
							date: item.date,
							isSelected: false,
							is_dir: item.is_dir,
							name: item.name,
							path: item.path,
							size: item.size,
							write: item.write,
							extensions: item.extensions
						}
					})
					this.listData = orderBy(newFileList, ['is_dir'], ['desc'])
					this.handelListChange(this.listData)
				}
			})
		},

		/**
		 * @description: Reload current folder
		 * @return {*}
		 */
		reload() {
			this.getFileList(this.$store.state.currentPath);
			this.$EventBus.$emit(events.RELOAD_FILE_LIST);
		},

		/**
		 * @description: Change View List/Gird
		 * @return {*}
		 */
		changeView() {
			this.isViewGird = !this.$store.state.isViewGird
			this.$store.commit('SET_IS_VIEW_GRID', this.isViewGird)
		},

		/**
		 * @description: Handle Select All Action
		 * @param {*} bool
		 * @return {*}
		 */
		handleSelect(bool) {
			if (bool) {
				this.listData.forEach((item, index) => {
					item.isSelected = true
					this.$refs.listview.selectList.push(index)
				})
			} else {
				this.listData.forEach(item => {
					item.isSelected = false
				})
				this.$refs.listview.selectList = []
			}
			this.handelListChange(this.listData)
		},


		/**
		 * @description: Handle List data change (Selected State)
		 * @param {*} list
		 * @return {*}
		 */
		handelListChange(list) {
			this.selectedArray = list.filter(item => {
				return item.isSelected
			})
			if (this.selectedArray.length == list.length && list.length > 0) {
				this.selectState = "all"
				this.isSelectAll = true
				this.selectLabel = {num: list.length}
				this.isToolbarShow = true
			} else if (this.selectedArray.length < list.length && this.selectedArray.length > 0) {
				this.selectState = "part"
				this.isSelectAll = false
				this.selectLabel = {num: this.selectedArray.length}
				this.isToolbarShow = true
			} else {
				this.selectState = "none"
				this.isSelectAll = false
				this.selectLabel = {num: list.length}
				this.isToolbarShow = false
			}
		},

		/**
		 * @description: Handle Backspace Event Back to upper level
		 * @return {*}
		 */
		backLevel() {
			if (this.isModalOpen) return false
			let pathArr = this.$store.state.currentPath.substr(1).split("/")
			if (pathArr.length == 1) {
				return false
			}
			let newPath = "/" + dropRight(pathArr).join("/")
			this.getFileList(newPath)
		},

		/**
		 * @description: Paste Files
		 * @return {*}
		 */
		paste(style = "overwrite") {
			if (this.$store.state.operateObject == null) return false
			this.isPasting = true
			let operateObject = this.$store.state.operateObject
			operateObject.to = this.$store.state.currentPath
			operateObject.style = style

			this.$api.batch.task(operateObject).then(res => {
				this.isPasting = false
				if (res.data.success == 200) {
					this.$store.commit('SET_OPERATE_OBJECT', null)
				} else {
					this.$buefy.toast.open({
						message: res.data.message,
						type: 'is-danger'
					})
				}
			})
		},

		/**
		 * @description: Hide Context Menu
		 * @return {*}
		 */
		hideContextMenu() {
			if (this.$refs.moreBtn) {
				this.$refs.moreBtn.isActive = false
			}
		},

		/*************************************************
		 * PART 1  Uploader
		 **************************************************/

		/**
		 * @description: Get Uploader Target URL
		 * @return {*}
		 */
		getTargetUrl() {
			return `${this.$protocol}//${this.$baseURL}/v1/file/upload`
		},

		/**
		 * @description: Set Uploader Options
		 * @return {*}
		 */
		setUploaderOpts() {
			this.uploaderInstance = this.$refs.uploader.uploader
			this.assignUploadButtons();

			this.uploaderInstance.on('fileAdded', (file) => {
				file.targetPath = this.currentPath;
			})

			// Drag Over
			this.uploaderInstance.on('dragover', (event) => {
				this.isDragIn = true;
				if (this.timeout !== null) {
					clearTimeout(this.timeout);
				}
				this.timeout = setTimeout(() => {
					this.isDragIn = false;
					this.timeout = null;
				}, 120);
				event.stopPropagation();
				event.preventDefault();
			})

			this.uploaderInstance.on('uploadStart', () => {
				this.isDragIn = false;
				this.showUploadList = true;
				this.uploaderListHeaderText = "Uploading"
			})

			this.uploaderInstance.on('complete', () => {
				this.getFileList(this.currentPath)
				this.uploaderListHeaderText = "Completed"
			})
		},

		/**
		 * @description: Close Uploader List
		 * @return {*}
		 */
		closeUploaderList() {
			this.showUploadList = false
			this.uploaderInstance.cancel()
		},


		/**
		 * @description: Assig nUpload Buttons
		 * @return {*}
		 */
		assignUploadButtons() {
			this.uploaderInstance.assignDrop(document.getElementById('dropTarget'));

		},

		/*************************************************
		 * PART 2  Modals
		 **************************************************/

		/**
		 * @description: Show Detail Modal
		 * @param {Object} item
		 * @return {*}
		 */
		showDetailModal(item) {
			this.isModalOpen = true
			this.panelType = this.getPanelType(item)
			if (this.panelType !== null) {
				this.currentItem = item
				this.isShowDetial = true
			} else {
				this.$buefy.modal.open({
					parent: this,
					component: DetailModal,
					hasModalCard: true,
					customClass: 'detail-panel file-modal',
					trapFocus: true,
					canCancel: ['escape'],
					scroll: "keep",
					animation: "zoom-in",
					props: {
						item: item,
					},
					events: {
						'close': () => {
							this.isModalOpen = false
						}
					}
				})
			}
		},

		/**
		 * @description: Show New Folder Modal
		 * @return {*}
		 */
		showNewFolderModal() {
			this.isModalOpen = true
			this.$buefy.modal.open({
				parent: this,
				component: NewFolderModal,
				hasModalCard: true,
				customClass: 'new-folder-panel file-modal',
				trapFocus: true,
				canCancel: [''],
				scroll: "keep",
				animation: "zoom-in",
				props: {
					currentPath: this.currentPath
				},
				events: {
					'reload': () => {
						this.reload();
					},
					'close': () => {
						this.isModalOpen = false
					}
				}
			})
		},

		/**
		 * @description: Show New File Modal
		 * @return {*}
		 */
		showNewFileModal() {
			this.isModalOpen = true
			this.$buefy.modal.open({
				parent: this,
				component: NewFileModal,
				hasModalCard: true,
				customClass: 'new-folder-panel file-modal',
				trapFocus: true,
				canCancel: [''],
				scroll: "keep",
				animation: "zoom-in",
				props: {
					currentPath: this.currentPath
				},
				events: {
					'reload': () => {
						this.reload()
					},
					'close': () => {
						this.isModalOpen = false
					}
				}
			})
		},

		/**
		 * @description: Show Rename Modal
		 * @param {Object} item
		 * @return {*}
		 */
		showRenameModal(item) {
			this.isModalOpen = true
			this.$buefy.modal.open({
				parent: this,
				component: RenameModal,
				hasModalCard: true,
				customClass: 'rename-panel file-modal',
				trapFocus: true,
				canCancel: [''],
				scroll: "keep",
				animation: "zoom-in",
				events: {
					'reload': () => {
						this.reload()
					},
					'close': () => {
						this.isModalOpen = false
					}
				},
				props: {
					item: item
				}
			})
		},

		/*************************************************
		 * PART 3  Toolbar Action
		 **************************************************/

		/**
		 * @description: handle Toolbar Close
		 * @return {*}
		 */
		handleClose() {
			this.isSelectAll = false
			this.handleSelect(this.isSelectAll)
		},

		/**
		 * @description: handle Toolbar Remove
		 * @return {*}
		 */
		handleRemove() {
			this.$buefy.dialog.confirm({
				title: this.$t('Deleting files'),
				message: this.$t('Are you sure you want to <b>delete</b> these files? This action cannot be undone.'),
				confirmText: this.$t('Delete'),
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => {
					this.deleteItem(this.selectedArray)
					this.handleClose()
				}
			})
		},

		/**
		 * @description: Handle Toolbar Move
		 * @return {*}
		 */
		handleMove() {
			this.operate('move', this.selectedArray)
			this.handleClose()
		},

		/**
		 * @description: Handle Toolbar copy
		 * @return {*}
		 */
		handleCopy() {
			this.operate('copy', this.selectedArray)
			this.handleClose()
		},

		/**
		 * @description: handle Toolbar Download
		 * @return {*}
		 */
		handleDownload() {
			const downItem = (this.selectedArray.length == 1) ? this.selectedArray[0] : this.selectedArray
			this.downloadFile(downItem)
			this.handleClose()
		},

		/*************************************************
		 * PART 4  Share Action
		 **************************************************/

		handleUnShare(item) {
			this.$buefy.dialog.confirm({
				title: this.$t('Unsharing Folder'),
				message: this.$t('Are you sure you want to unshare this Folder?'),
				confirmText: this.$t('UnShare'),
				cancelText: this.$t('Cancel'),
				iconPack: 'casa',
				icon: 'danger',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => {
					this.$api.samba.deleteShare(item.id).then(() => {
						this.reloadShare()
						this.$buefy.toast.open({
							message: this.$t('Folder unshared.'),
							type: 'is-success'
						})
					}).catch(() => {
						this.$buefy.toast.open({
							message: this.$t('Unshared failed.'),
							type: 'is-danger'
						})
					})
				}
			})
		},

		reloadShare() {
			if (this.isShareList) {
				this.$refs.shareList.getSharedList()
				this.$EventBus.$emit(events.RELOAD_FILE_LIST);
			} else {
				this.reload()
			}
		},

		handleSelectShare() {
			this.$buefy.modal.open({
				parent: this,
				component: SelectShareModal,
				hasModalCard: true,
				customClass: 'share-detial-panel file-modal',
				trapFocus: true,
				canCancel: [''],
				scroll: "keep",
				animation: "zoom-in",
				events: {
					'close': () => {
						// this.isModalOpen = false
					},
					'reload': () => {
						if (this.isShareList) {
							this.$refs.shareList.getSharedList()
							this.$EventBus.$emit(events.RELOAD_FILE_LIST);
						} else {
							this.reload()
						}
					}
				}
			})
		},
		getShareLink(item) {
			this.$buefy.modal.open({
				parent: this,
				component: ShareDetial,
				hasModalCard: true,
				customClass: 'share-detial-panel file-modal',
				trapFocus: true,
				canCancel: [''],
				scroll: "keep",
				animation: "zoom-in",
				props: {
					item: item
				}
			})
		},

		/*************************************************
		 * PART 5  storage settings Action
		 **************************************************/

		/*
		* storage settings modal
		* */
		// show storage settings modal
		async showStorageSettingsModal() {
			// TODO: the part is repetition
			//  with APPs Installation Location requirement document
			// 获取merge信息
			let mergeStorageList
			try {
				mergeStorageList = await this.$api.local_storage.getMergerfsInfo().then((res) => res.data.data[0]['source_volume_uuids'])
			} catch (e) {
				mergeStorageList = []
				console.log(e)
			}
			this.$buefy.modal.open({
				parent: this,
				component: MergeStorages,
				hasModalCard: true,
				canCancel: false,
				animation: "zoom-in",
				props: {
					mergeStorageList
				},
				events: {}
			})
		},

	},
	sockets: {
		file_operate(data) {
			const taskList = data.file_operate.data
			taskList.forEach(task => {
				if (task.finished && task.to === this.currentPath) {
					this.reload()
				}
			})
		},
		sys_hardware_status() {
			// USB
			// this.usbDisks = data.body.sys_usb

		},
		storage_status() {
			// Storage
			this.reload()
		},
		sys_usb() {
			setTimeout(() => {
				if (this.currentPath == "/DATA") {
					this.reload()
				}
			}, 500)
		}
	}
}
</script>

    