<template>
	<div :class="containerClass">
		<div class="modal-card">
			<!-- Modal-Card Body Start -->
			<section class="modal-card-body is-flex">
				<!-- Viewer Start -->
				<transition name="c-zoom-in">
					<component :is="panelType" v-if="isShowDetial" ref="previewPanel" :item="currentItem" :list="listData"
						@close="isShowDetial = false; isModalOpen = false;"></component>
				</transition>
				<!-- Viewer End -->

				<template>
					<!-- NavBar Start -->
					<b-sidebar ref="sidebar" :open.sync="isSideBarOpen" :overlay="isMobile" :position="sideBarPosition"
						fullheight>
						<div class="nav-bar is-flex is-flex-direction-column">
							<div class="is-flex-grow-1 is-flex-shrink-1 nav-bar-top scrollbars-light">
								<!-- Files Start -->
								<div class="files-section">
									<!--  storage settings requirement document -->
									<div class="is-flex is-align-items-center pt-3">
										<div class="is-flex-grow-1">
											<h3 class="title is-3 mb-0 pb-3 pt-3 has-text-left">
												{{ $t("Files") }}
											</h3>
										</div>
										<div v-show="hasMergerFunction" class="is-flex-shrink-0 mr-5 is-clickable"
											@click="showStorageSettingsModal">
											<b-icon custom-size="mdi-18px" icon="cog-outline"></b-icon>
										</div>
									</div>
									<div class="list-container scrollbars-light pt-0 is-flex-grow-1">
										<tree-list ref="navBar" :autoLoad="true" :isActive="pageType == `file`"
											:path="rootPath"></tree-list>
									</div>
								</div>
								<!-- Files End -->

								<!-- Mounted Start -->
								<div class="mounted-section">
									<div class="is-flex is-align-items-center">
										<div class="is-flex-grow-1">
											<h3 class="title is-3 mb-0 pb-3 pt-3 has-text-left">
												{{ $t("Location") }}
											</h3>
										</div>
										<div class="is-flex-shrink-0 mr-5">
											<mount-action-button></mount-action-button>
										</div>
									</div>

									<div class="list-container pt-0 is-flex-grow-1">
										<mount-list ref="mountedList" :autoLoad="true"
											:hasMergerFunction="hasMergerFunction" :isActive="pageType == `file`"
											:path="rootPath"></mount-list>
									</div>
								</div>
								<!-- Mounted End -->
							</div>

							<!-- Bottom Action Start -->
							<div class="bottom-area">
								<drop-entry-button :active="pageType == `drop`" :title="$t('FilesDrop')"
									@open="showDropPage"></drop-entry-button>
								<share-entry-button :active="pageType == `share`"
									@open="showSharedList"></share-entry-button>
							</div>
							<!-- Bottom Action End -->
						</div>
					</b-sidebar>
					<!-- NavBar Start -->

					<!-- Main Content Start -->
					<template v-if="pageType == `file`">
						<div class="content is-flex-grow-1">
							<uploader ref="uploader" :options="options" class="uploader-example">
								<uploader-unsupport></uploader-unsupport>
								<!-- Header Start -->
								<header :class="{ 'is-flex-wrap-wrap': isMobile }" class="modal-card-head">
									<div id="bread-container" class="is-flex-grow-1 is-flex breadcrumb-container">
										<!-- SideBar Button Start -->
										<sidebar-menu-button></sidebar-menu-button>
										<!-- SideBar Button End -->
										<file-breadcrumb v-if="!isMobile"></file-breadcrumb>
										<!-- <b-input placeholder="Search in folder..." size="is-small" rounded></b-input> -->
									</div>
									<div class="is-flex is-align-items-center">
										<!-- Paste Button Start -->
										<b-button v-if="hasPasteData" :label="$t('Paste')" :loading="isPasting" class="mr-3"
											icon-left="content-paste" rounded size="is-small" type="is-success"
											@click="paste('overwrite')" />
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
											class="is-flex is-align-items-center modal-close-container modal-close-container-line">
											<div class="close-button" @click="$emit('close')">
												<b-icon icon="close-outline" pack="casa"></b-icon>
											</div>
										</div>
										<!--  Close Button End -->
									</div>
									<div v-if="isMobile" class="pt-2" style="width: 100%">
										<file-breadcrumb></file-breadcrumb>
									</div>
								</header>

								<!-- Header End -->

								<!-- Tool Bar Start -->
								<div v-if="listData.length > 0" class="tool-bar is-flex mb-2 mt-2 is-flex-shrink-0">
									<div class="is-flex-grow-1 has-text-left is-flex is-align-items-center">
										<b-field class="ml-1 is-flex is-size-14px mb-0" expanded >
											<b-checkbox v-model="isSelectAll" :class="selectState" size="is-small"
												@input="handleSelect">
												{{
													selectState != "none"
													? $t("select-items", selectLabel)
													: $t("total-items", selectLabel)
												}}
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
								<div id="dropTarget" class="is-flex-grow-1 is-flex over is-justify-content-center ">
									<!-- Drag and Drop Mask Start -->
									<div v-if="isDragIn"
										class="drag-mask is-flex is-align-items-flex-end is-flex-direction-row ">
										<div class="mb-6">
											<div class="upload-icon">
												<b-icon icon="arrow-up" size="is-medium" type="is-white"></b-icon>
											</div>
											<p class="has-text-primary">
												{{ $t("Upload to") }} {{ currentPathName }}
											</p>
										</div>
									</div>
									<!-- Drag and Drop Mask End -->

									<component :is="listView" ref="listview" v-model="listData" :isLoading="isLoading"
										@change="handelListChange" @gotoFolder="getFileList" @reload="reload"
										@showDetailModal="showDetailModal">
										<empty-holder v-if="isEmpty" @newFile="showNewFileModal"
											@newFolder="showNewFolderModal"></empty-holder>
										<error-holder v-else :error="errorMsg"></error-holder>
									</component>
								</div>
								<!-- List View End -->

								<!-- Upload List Start-->
								<div v-show="showUploadList" class="upload-list">
									<b-collapse ref="uploadList" v-model="openUploadList" animation="slide1"
										aria-id="contentIdForA11y3" class="card">
										<template #trigger>
											<div :aria-expanded="openUploadList" aria-controls="contentIdForA11y3"
												class="card-header" role="button">
												<p class="card-header-title">
													<b-icon :icon="openUploadList ? 'down-outline' : 'up-outline'
														" pack="casa" class="mr-2"></b-icon>
													{{ $t(uploaderListHeaderText) }}
												</p>
												<a class="card-header-icon" @click.prevent="closeUploaderList">
													<b-icon icon="close-outline" pack="casa"></b-icon>
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
					</template>

					<!-- Share Page Start -->
					<template v-else-if="pageType == `share`">
						<share-list-page ref="shareList" @close="$emit('close')"></share-list-page>
					</template>
					<!-- Share Page End -->

					<!-- Drop Page Start -->
					<template v-else-if="pageType == `drop`">
						<drop-page ref="dropPage" @close="$emit('close')"></drop-page>
					</template>
					<!-- Drop Page End -->
				</template>
				<!-- Main Content End -->
			</section>
			<!-- Modal-Card Body End -->
			<b-loading v-model="isLoading" :is-full-page="false">
				<b-image :src="require('@/assets/img/loading/waiting.svg')" alt="pending" class="is-100x100 mt-6" />
			</b-loading>
		</div>
	</div>
</template>

<script>
import orderBy from "lodash/orderBy";
import dropRight from "lodash/dropRight";
import isEqual from "lodash/isEqual";

import { mixin } from "@/mixins/mixin";
import VueBreakpointMixin from "vue-breakpoint-mixin";
import events from "@/events/events";

import TreeList from "./sidebar/TreeList.vue";
import MountList from "./sidebar/MountList.vue";
import ShareEntryButton from "./shared/ShareEntryButton.vue";
import ShareListPage from "./shared/ShareListPage.vue";

import SelectShareModal from "./shared/SelectShareModal.vue";
import ShareDetial from "./shared/ShareDetial.vue";

import GirdView from "./components/GirdView.vue";
import ListView from "./components/ListView.vue";
import FileBreadcrumb from "./components/FileBreadcrumb.vue";
import EmptyHolder from "./components/EmptyHolder.vue";
import ErrorHolder from "./components/ErrorHolder.vue";
import SidebarMenuButton from "./components/SidebarMenuButton.vue";

import DetailModal from "./modals/DetailModal.vue";
import NewFolderModal from "./modals/NewFolderModal.vue";
import NewFileModal from "./modals/NewFileModal.vue";
import RenameModal from "./modals/RenameModal.vue";

import Uploader from "./uploader/components/uploader.vue";
import UploaderUnsupport from "./uploader/components/unsupport.vue";
import UploaderList from "./uploader/components/list.vue";
import OperationToolbar from "./components/OperationToolbar.vue";
import OperationStatusBar from "./components/OperationStatusBar.vue";
import GlobalActionButton from "./components/GlobalActionButton.vue";
import MountActionButton from "./components/MountActionButton.vue";
// storage settings requirement document
import MergeStorages from "@/components/Storage/MergeStorages.vue";

// Drop
import DropEntryButton from "./drop/DropEntryButton.vue";

export default {
	name: "file-panel",
	mixins: [mixin, VueBreakpointMixin],
	provide() {
		return {
			filePanel: this,
		};
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
		MarkDownEditor: () => import("./viewers/MarkdownEditor.vue"),
		DocViewer: () => import("./viewers/DocViewer.vue"),
		ExcelViewer: () => import("./viewers/ExcelViewer.vue"),
		PdfViewer: () => import("./viewers/PdfViewer.vue"),
		EmptyHolder,
		ErrorHolder,
		OperationToolbar,
		RenameModal,
		OperationStatusBar,
		GlobalActionButton,
		// Shared
		ShareEntryButton,
		ShareListPage,
		MountList,
		MountActionButton,
		// Drop
		DropPage: () => import("./drop/DropPage.vue"),
		DropEntryButton,
		SidebarMenuButton,
	},
	data() {
		return {
			isCreated: false,
			isLoading: true,
			isModalOpen: false,
			isDragIn: false,
			isPasting: false,
			isShowDetial: false,
			isSideBarOpen: false,
			pageType: "file",
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
			selectLabel: {},
			isToolbarShow: false,
			isEmpty: true,
			errorMsg: "",

			attrs: {
				accept: "*",
			},
			// Uploader List
			showUploadList: false,
			openUploadList: true,
			uploaderListHeaderText: "Uploading",
			usbDisks: [],
			hasMergerFunction: false,
		};
	},
	async created() {
		this.options = {
			target: this.getTargetUrl(),
			testChunks: false,
			uploadMethod: "POST",
			successStatuses: [200, 201, 202, 2002],
			permanentErrors: [404, 409, 415, 500, 501],
			allowDuplicateUploads: true,
			headers: {
				Authorization: this.token,
			},
			query: (file) => {
				return {
					path: file.targetPath,
				};
			},
			// generateUniqueIdentifier: nanoid(),
			// chunkSize: 1024 * 1024 * 1024 * 1024 * 1024,
			// forceChunkSize: true,
		};
		// get merge info
		try {
			let hasMergeState = await this.$api.local_storage
				.getMergerfsInfo()
				.then((res) => res.status);
			this.hasMergerFunction = hasMergeState == 200;
		} catch (e) {
			console.error(e);
		}
	},

	computed: {
		viewIcon() {
			return this.$store.state.isViewGird
				? "view-grid-outline"
				: "format-list-bulleted";
		},
		listView() {
			return this.$store.state.isViewGird ? "gird-view" : "list-view";
		},
		containerClass() {
			return this.$route.path == "/files" ? "file-panel full-screen " : "";
		},
		sideBarPosition() {
			return this.isMobile ? "fixed" : "static";
		},
		token() {
			return (
				this.$store.state.access_token || localStorage.getItem("access_token")
			);
		},
	},
	watch: {
		"$store.state.access_token": {
			handler(val) {
				this.options.headers.Authorization = val;
			},
			deep: true,
		},
		"$store.state.operateObject": {
			handler(val) {
				this.hasPasteData = val != null;
			},
			deep: true,
		},
		usbDisks(newval, oldval) {
			if (!isEqual(newval, oldval) && newval == "/DATA") {
				this.getFileList(this.currentPath);
			}
		},
		pageType(val) {
			switch (val) {
				case "file":
					this.$nextTick(() => {
						this.beforeInit();
					});

					break;
				case "share":
					this.destroyedAction();
					break;
				case "drop":
					this.destroyedAction();
					break;
				default:
					break;
			}
		},
		isMobile(val) {
			if (val) {
				this.isSideBarOpen = false;
			} else {
				this.isSideBarOpen = true;
			}
		},
	},

	mounted() {
		this.init();
		if (this.$route.path == "/files") {
			this.init();
			// this.isLoading = false;
		}

		if (this.pageType == "file") {
			this.beforeInit();
		}

		this.isSideBarOpen = !this.isMobile;

		document.addEventListener("contextmenu", this.hideContextMenu);
		this.$EventBus.$on(events.GOTO, (event) => {
			this.getFileList(event.path);
		});

		this.$EventBus.$on(events.SELECT_SHARE, this.handleSelectShare);
		this.$EventBus.$on(events.UN_SHARE, this.handleUnShare);
		this.$EventBus.$on(events.SHOW_FILES_SIDEBAR, this.handleShowSideBar);
		this.$EventBus.$on(events.HIDE_FILES_SIDEBAR, this.handleHideSideBar);
	},
	destroyed() {
		this.$EventBus.$off(events.SHOW_FILES_SIDEBAR, this.handleShowSideBar);
		this.$EventBus.$off(events.HIDE_FILES_SIDEBAR, this.handleHideSideBar);
		this.destroyedAction();
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
					case "Escape":
						if (this.isShowDetial) {
							this.$refs.previewPanel.close();
						}
						break;
					case "Backspace":
						this.backLevel();
						break;

					default:
						break;
				}
			};
			// paste
			document.onpaste = () => {
				if (!this.isShowDetial && !this.isModalOpen) {
					this.paste("overwrite");
				}
			};
		},

		destroyedAction() {
			if (this.pageType == "file") {
				this.uploaderInstance.off("fileSuccess");
				this.uploaderInstance.off("fileError");
				this.uploaderInstance.off("fileProgress");
				this.uploaderInstance.off("dragleave");
				this.uploaderInstance.off("dragover");
				this.uploaderInstance.off("uploadStart");

				this.$store.commit("SET_OPERATE_OBJECT", null);
				document.onpaste = null;
				document.onkeyup = null;
			}
			document.removeEventListener("contextmenu", this.hideContextMenu);
			// this.uploaderInstance.off('dragover')
			// this.uploaderInstance.off('uploadStart')
			// document.removeEventListener('contextmenu', this.hideContextMenu)
			// this.$store.commit('SET_OPERATE_OBJECT', null)
			// document.onpaste = null;
			// document.onkeyup = null;
		},

		showSharedList() {
			this.pageType = "share";
			this.hideMobileSidebar();
		},

		showDropPage() {
			this.pageType = "drop";
			this.hideMobileSidebar();
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
				this.isCreated = true;
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
			this.pageType = "file";
			this.currentPath = path;
			this.$store.commit("SET_CURRENT_PATH", path);
			this.$api.folder
				.getList(path)
				.then((res) => {
					if (res.data.success == 200) {
						this.isLoading = false;
						this.currentPathName = path.split("/").pop();
						const fileList = res.data.data.content;
						const newFileList = fileList.map((item) => {
							return {
								date: item.date,
								isSelected: false,
								is_dir: item.is_dir,
								name: item.name,
								path: item.path,
								size: item.size,
								write: item.write,
								extensions: item.extensions,
							};
						});
						// filter hidden files
						const filterList = newFileList.filter((item) => {
							return !item.name.startsWith(".");
						});
						this.listData = orderBy(filterList, ["is_dir"], ["desc"]);
						this.handelListChange(this.listData);
						this.errorMsg = "";
						this.isEmpty = true;
					}
				})
				.catch((error) => {
					this.isLoading = false;
					this.isEmpty = false;
					this.listData = [];
					this.errorMsg = error.response.data.data;
					this.handelListChange(this.listData);
				});

			this.hideMobileSidebar();
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
			this.isViewGird = !this.$store.state.isViewGird;
			this.$store.commit("SET_IS_VIEW_GRID", this.isViewGird);
		},

		/**
		 * @description: Handle Select All Action
		 * @param {*} bool
		 * @return {*}
		 */
		handleSelect(bool) {
			if (bool) {
				this.listData.forEach((item, index) => {
					item.isSelected = true;
					this.$refs.listview.selectList.push(index);
				});
			} else {
				this.listData.forEach((item) => {
					item.isSelected = false;
				});
				this.$refs.listview.selectList = [];
			}
			this.handelListChange(this.listData);
		},

		/**
		 * @description: Handle List data change (Selected State)
		 * @param {*} list
		 * @return {*}
		 */
		handelListChange(list) {
			this.selectedArray = list.filter((item) => {
				return item.isSelected;
			});
			if (this.selectedArray.length == list.length && list.length > 0) {
				this.selectState = "all";
				this.isSelectAll = true;
				this.selectLabel = { num: list.length };
				this.isToolbarShow = true;
			} else if (
				this.selectedArray.length < list.length &&
				this.selectedArray.length > 0
			) {
				this.selectState = "part";
				this.isSelectAll = false;
				this.selectLabel = { num: this.selectedArray.length };
				this.isToolbarShow = true;
			} else {
				this.selectState = "none";
				this.isSelectAll = false;
				this.selectLabel = { num: list.length };
				this.isToolbarShow = false;
			}
		},

		/**
		 * @description: Handle Backspace Event Back to upper level
		 * @return {*}
		 */
		backLevel() {
			if (this.isModalOpen) return false;
			let pathArr = this.$store.state.currentPath.substr(1).split("/");
			if (pathArr.length == 1) {
				return false;
			}
			let newPath = "/" + dropRight(pathArr).join("/");
			this.getFileList(newPath);
		},

		/**
		 * @description: Paste Files
		 * @return {*}
		 */
		paste(style = "overwrite") {
			if (this.$store.state.operateObject == null) return false;
			this.isPasting = true;
			let operateObject = this.$store.state.operateObject;
			operateObject.to = this.$store.state.currentPath;
			operateObject.style = style;

			this.$api.batch.task(operateObject).then((res) => {
				this.isPasting = false;
				if (res.data.success == 200) {
					this.$store.commit("SET_OPERATE_OBJECT", null);
				} else {
					this.$buefy.toast.open({
						message: res.data.message,
						type: "is-danger",
					});
				}
			});
		},

		/**
		 * @description: Hide Context Menu
		 * @return {*}
		 */
		hideContextMenu() {
			if (this.$refs.moreBtn) {
				this.$refs.moreBtn.isActive = false;
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
			return `${this.$protocol}//${this.$baseURL}/v2/casaos/file/upload`;
		},

		/**
		 * @description: Set Uploader Options
		 * @return {*}
		 */
		setUploaderOpts() {
			this.uploaderInstance = this.$refs.uploader.uploader;
			this.assignUploadButtons();

			this.uploaderInstance.on("fileAdded", (file) => {
				file.targetPath = this.currentPath;
			});

			// Drag Over
			this.uploaderInstance.on("dragover", (event) => {
				this.isDragIn = true;
				this.openUploadList = false;
				if (this.timeout !== null) {
					clearTimeout(this.timeout);
				}
				this.timeout = setTimeout(() => {
					this.isDragIn = false;
					this.timeout = null;
				}, 120);
				event.stopPropagation();
				event.preventDefault();
			});

			this.uploaderInstance.on("uploadStart", () => {
				this.isDragIn = false;
				this.showUploadList = true;
				this.openUploadList = true;
				this.uploaderListHeaderText = "Uploading";
			});

			this.uploaderInstance.on("complete", () => {
				this.getFileList(this.currentPath);
				this.uploaderListHeaderText = "Completed";
			});
		},

		/**
		 * @description: Close Uploader List
		 * @return {*}
		 */
		closeUploaderList() {
			this.showUploadList = false;
			this.uploaderInstance.cancel();
		},

		/**
		 * @description: Assig nUpload Buttons
		 * @return {*}
		 */
		assignUploadButtons() {
			this.uploaderInstance.assignDrop(document.getElementById("dropTarget"));
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
			this.isModalOpen = true;
			this.panelType = this.getPanelType(item);
			if (this.panelType !== null) {
				this.currentItem = item;
				this.isShowDetial = true;
			} else {
				this.$buefy.modal.open({
					parent: this,
					component: DetailModal,
					hasModalCard: true,
					customClass: "detail-panel file-modal",
					trapFocus: true,
					canCancel: [],
					scroll: "keep",
					animation: "zoom-in",
					props: {
						item: item,
					},
					events: {
						close: () => {
							this.isModalOpen = false;
						},
					},
				});
			}
		},

		/**
		 * @description: Show New Folder Modal
		 * @return {*}
		 */
		showNewFolderModal() {
			this.isModalOpen = true;
			this.$buefy.modal.open({
				parent: this,
				component: NewFolderModal,
				hasModalCard: true,
				customClass: "new-folder-panel file-modal",
				trapFocus: true,
				canCancel: [""],
				scroll: "keep",
				animation: "zoom-in",
				props: {
					currentPath: this.currentPath,
				},
				events: {
					reload: () => {
						this.reload();
					},
					close: () => {
						this.isModalOpen = false;
					},
				},
			});
		},

		/**
		 * @description: Show New File Modal
		 * @return {*}
		 */
		showNewFileModal() {
			this.isModalOpen = true;
			this.$buefy.modal.open({
				parent: this,
				component: NewFileModal,
				hasModalCard: true,
				customClass: "new-folder-panel file-modal",
				trapFocus: true,
				canCancel: [""],
				scroll: "keep",
				animation: "zoom-in",
				props: {
					currentPath: this.currentPath,
				},
				events: {
					reload: () => {
						this.reload();
					},
					close: () => {
						this.isModalOpen = false;
					},
				},
			});
		},

		/**
		 * @description: Show Rename Modal
		 * @param {Object} item
		 * @return {*}
		 */
		showRenameModal(item) {
			this.isModalOpen = true;
			this.$buefy.modal.open({
				parent: this,
				component: RenameModal,
				hasModalCard: true,
				customClass: "rename-panel file-modal",
				trapFocus: true,
				canCancel: [""],
				scroll: "keep",
				animation: "zoom-in",
				events: {
					reload: () => {
						this.reload();
					},
					close: () => {
						this.isModalOpen = false;
					},
				},
				props: {
					item: item,
				},
			});
		},

		/*************************************************
		 * PART 3  Toolbar Action
		 **************************************************/

		/**
		 * @description: handle Toolbar Close
		 * @return {*}
		 */
		handleClose() {
			this.isSelectAll = false;
			this.handleSelect(this.isSelectAll);
		},

		/**
		 * @description: handle Toolbar Remove
		 * @return {*}
		 */
		handleRemove() {
			this.$buefy.dialog.confirm({
				title: this.$t("Deleting files"),
				message: this.$t(
					"Are you sure you want to <b>delete</b> these files? This action cannot be undone."
				),
				confirmText: this.$t("Delete"),
				type: "is-danger",
				hasIcon: true,
				onConfirm: () => {
					this.deleteItem(this.selectedArray);
					this.handleClose();
				},
			});
		},

		/**
		 * @description: Handle Toolbar Move
		 * @return {*}
		 */
		handleMove() {
			this.operate("move", this.selectedArray);
			this.handleClose();
		},

		/**
		 * @description: Handle Toolbar copy
		 * @return {*}
		 */
		handleCopy() {
			this.operate("copy", this.selectedArray);
			this.handleClose();
		},

		/**
		 * @description: handle Toolbar Download
		 * @return {*}
		 */
		handleDownload() {
			const downItem =
				this.selectedArray.length == 1
					? this.selectedArray[0]
					: this.selectedArray;
			this.downloadFile(downItem);
			this.handleClose();
		},

		/*************************************************
		 * PART 4  Share Action
		 **************************************************/

		handleUnShare(item) {
			this.$buefy.dialog.confirm({
				title: this.$t("Unsharing Folder"),
				message: this.$t("Are you sure you want to unshare this Folder?"),
				confirmText: this.$t("UnShare"),
				cancelText: this.$t("Cancel"),
				iconPack: "casa",
				icon: "danger",
				type: "is-danger",
				hasIcon: true,
				onConfirm: () => {
					this.$api.samba
						.deleteShare(item.id)
						.then(() => {
							this.reloadShare();
							this.$buefy.toast.open({
								message: this.$t("Folder unshared."),
								type: "is-success",
							});
						})
						.catch(() => {
							this.$buefy.toast.open({
								message: this.$t("Unshared failed."),
								type: "is-danger",
							});
						});
				},
			});
		},

		reloadShare() {
			switch (this.pageType) {
				case "share":
					this.$refs.shareList.getSharedList();
					this.$EventBus.$emit(events.RELOAD_FILE_LIST);
					break;
				case "file":
					this.reload();
					break;
				default:
					break;
			}
		},

		handleSelectShare() {
			this.$buefy.modal.open({
				parent: this,
				component: SelectShareModal,
				hasModalCard: true,
				customClass: "share-detial-panel file-modal",
				trapFocus: true,
				canCancel: [""],
				scroll: "keep",
				animation: "zoom-in",
				events: {
					close: () => {
						// this.isModalOpen = false
					},
					reload: () => {
						this.reloadShare();
					},
				},
			});
		},
		getShareLink(item) {
			this.$buefy.modal.open({
				parent: this,
				component: ShareDetial,
				hasModalCard: true,
				customClass: "share-detial-panel file-modal",
				trapFocus: true,
				canCancel: [""],
				scroll: "keep",
				animation: "zoom-in",
				props: {
					item: item,
				},
			});
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
			let mergeStorageList;
			try {
				mergeStorageList = await this.$api.local_storage
					.getMergerfsInfo()
					.then((res) => res.data.data[0]["source_volume_uuids"]);
			} catch (e) {
				mergeStorageList = [];
				console.log(e);
			}
			this.$buefy.modal.open({
				parent: this,
				component: MergeStorages,
				hasModalCard: true,
				canCancel: false,
				animation: "zoom-in",
				props: {
					mergeStorageList,
				},
				events: {},
			});
		},

		handleShowSideBar() {
			this.isSideBarOpen = true;
		},
		handleHideSideBar() {
			this.isSideBarOpen = false;
		},

		hideMobileSidebar() {
			if (this.isMobile) {
				this.$refs.sidebar.close();
			}
		},
	},
	sockets: {
		"casaos:file:operate"(res) {
			const file_operate = JSON.parse(res.Properties.file_operate);
			const taskList = file_operate.data;
			taskList.forEach((task) => {
				if (task.finished && task.to === this.currentPath) {
					this.reload();
				}
			});
		},
		"casaos:system:utilization"() {
			// USB
			// this.usbDisks = data.body.sys_usb
		},
		storage_status() {
			// Storage
			this.reload();
		},
		"local-storage:disk:added"() {
			setTimeout(() => {
				if (this.currentPath == "/DATA") {
					this.reload();
				}
			}, 500);
		},
	},
};
</script>

<style lang="scss" scoped>
.full-screen {
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: white;
	z-index: 20;
	display: flex;

	.modal-card {
		height: 100% !important;
		max-height: 100% !important;
		overflow: hidden;
	}
}
</style>
