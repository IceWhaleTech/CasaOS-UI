<template>
	<div>

		<div :style="{ top: y + 'px', left: x + 'px' }" class="action-btn context-menu">
			<b-dropdown id="dr1" ref="dropDown" :animation="ani" :close-on-click="false" :mobile-modal="false"
				:position="'is-' + verticalPos + '-' + horizontalPos" aria-role="list" class="file-dropdown"
				@active-change="dorpActiveChange($event, 'dr1')">
				<!-- Blank Start -->
				<template v-if="!showDetail">
					<b-dropdown-item key="system-context11" aria-role="menuitem" class="is-flex is-align-items-center"
						@click="$refs.dropDown.toggle(); filePanel.showNewFileModal()">
						<b-icon class="mr-1" custom-size="mdi-18px" icon="file-plus-outline"></b-icon>
						{{ $t('New File') }}
					</b-dropdown-item>
					<b-dropdown-item key="system-context1" aria-role="menuitem" class="is-flex is-align-items-center"
						@click="$refs.dropDown.toggle(); filePanel.showNewFolderModal()">
						<b-icon class="mr-1" custom-size="mdi-18px" icon="folder-plus-outline"></b-icon>
						{{ $t('New Folder') }}
					</b-dropdown-item>

					<hr class="dropdown-divider">
					<b-dropdown-item id="upfileBtn" key="system-context2" aria-role="menuitem"
						class="is-flex is-align-items-center " @click="uploadFile">
						<b-icon class="mr-1" custom-size="mdi-18px" icon="file-upload-outline"></b-icon>
						{{ $t('Upload Files') }}
					</b-dropdown-item>
					<b-dropdown-item id="upfolderBtn" key="system-context3" aria-role="menuitem"
						class="is-flex is-align-items-center " @click="uploadFile">
						<b-icon class="mr-1" custom-size="mdi-18px" icon="folder-upload-outline"></b-icon>
						{{ $t('Upload Folder') }}
					</b-dropdown-item>
					<template v-if="hasPasteData">
						<b-dropdown-item key="system-context4" aria-role="menuitem" class="is-flex is-align-items-center"
							@click="paste('overwrite')">
							<b-icon class="mr-1" custom-size="mdi-18px" icon="content-paste"></b-icon>
							{{ $t('Paste - Overwrite') }}
						</b-dropdown-item>
						<b-dropdown-item key="system-context4-1" aria-role="menuitem" class="is-flex is-align-items-center"
							@click="paste('skip')">
							<b-icon class="mr-1" custom-size="mdi-18px" icon="content-paste"></b-icon>
							{{ $t('Paste - Skip') }}
						</b-dropdown-item>
					</template>

					<hr class="dropdown-divider">
					<b-dropdown-item key="system-context5" aria-role="menuitem" class="is-flex is-align-items-center"
						@click="$refs.dropDown.toggle(); filePanel.reload()">
						<b-icon class="mr-1" custom-size="mdi-18px" icon="refresh"></b-icon>
						{{ $t('Refresh') }}
					</b-dropdown-item>
				</template>
				<!-- Blank End -->

				<!-- Item Start -->
				<template v-else>
					<b-dropdown-item key="file-context1" aria-role="menuitem" @click="download">
						{{ $t('Download') }}
					</b-dropdown-item>
					<b-dropdown-item v-if="showSingleEdit" key="file-context2" aria-role="menuitem" @click="copyPath">
						{{ $t('Copy Path') }}
					</b-dropdown-item>
					<hr class="dropdown-divider">
					<b-dropdown-item v-if="showSingleEdit && !isShared && !isMounted" key="file-context3"
						aria-role="menuitem" @click="rename">
						{{ $t('Rename') }}
					</b-dropdown-item>
					<b-dropdown-item v-if="!isShared && !isMounted" key="file-context4" aria-role="menuitem"
						@click="operate('move', items)">
						{{ $t('Cut') }}
					</b-dropdown-item>
					<b-dropdown-item key="file-context5" aria-role="menuitem" @click="operate('copy', items)">
						{{ $t('Copy') }}
					</b-dropdown-item>
					<b-dropdown-item v-if="showSingleEdit && isWallpaperType" aria-role="menuitem"
						@click="setAsWallpaper(item)">
						{{ $t('Set as wallpaper') }}
					</b-dropdown-item>

					<template v-if="item.is_dir">
						<hr class="dropdown-divider">
						<b-dropdown-item v-if="!isShared" aria-role="menuitem" @click="shareFoler">
							{{ $t('Share') }}
						</b-dropdown-item>
						<b-dropdown-item v-else aria-role="menuitem" class="has-text-danger" @click="unShare">
							{{ $t('UnShare') }}
						</b-dropdown-item>
					</template>

					<template v-if="!isShared && !isMounted">
						<hr class="dropdown-divider">
						<b-dropdown-item v-if="!isConfirmed" aria-role="menuitem" class="has-text-danger"
							@click="isConfirmed = true">
							{{ $t('Delete') }}
						</b-dropdown-item>
						<b-dropdown-item v-else aria-role="menuitem" class="has-text-danger" @click="deleteItem(items)">
							{{ $t('Are you sure?') }}
						</b-dropdown-item>
					</template>

				</template>
				<!-- Item End -->
			</b-dropdown>

		</div>
	</div>
</template>

<script>
import { mixin, wallpaperType } from '@/mixins/mixin';
import has from 'lodash/has'

export default {
	mixins: [mixin],
	inject: ['filePanel'],
	data() {
		return {
			verticalPos: "bottom",
			horizontalPos: "right",
			isConfirmed: false,
			x: Number,
			y: Number,
			showDetail: false,
			showSingleEdit: true,
			ani: "fade1",
			item: {},
			items: [],
			hasPasteData: this.$store.state.operateObject != null
		}
	},

	computed: {
		close() {
			return this.item == undefined
		},
		isWallpaperType() {
			return this.item.is_dir ? false : wallpaperType.includes(this.getFileExt(this.item))
		},
		isShared() {
			const extensions = this.item.extensions
			if (extensions === null) {
				return false
			} else {
				if (has(extensions, 'share')) {
					return extensions.share.shared === "true"
				} else {
					return false
				}
			}
		},
		isMounted() {
			return this.item.extensions ? this.item.extensions.mounted : false;
		}
	},
	watch: {
		'$store.state.operateObject': {
			handler(val) {
				this.hasPasteData = (val != null)
			},
			deep: true
		},
		showDetial(val) {
			if (!val) {
				this.assignBtn();
			}
		}
	},
	mounted() {
		this.assignBtn();
	},
	methods: {
		open(event, item) {
			this.item = item
			let bounced = event.target.getAttribute('class').includes('dropdown-menu')
			if (!bounced) {
				this.showDetail = (item != undefined)
				if (this.showDetail) {
					const isInSelected = this.filePanel.selectedArray.some(obj => {
						return item.path == obj.path
					})
					if (this.filePanel.selectedArray.length > 1 && isInSelected) {
						this.items = this.filePanel.selectedArray
						this.showSingleEdit = false
					} else {
						this.items = [item]
						this.item = item
						this.showSingleEdit = true
					}
				}

				this.$refs.dropDown.isActive = false
				this.$nextTick(() => {
					this.x = event.clientX
					this.y = event.clientY

					const rightOffset = window.innerWidth - event.clientX - 128
					this.horizontalPos = rightOffset > 0 ? "right" : "left"
					const bottomOffset = window.innerHeight - event.clientY - 270
					this.verticalPos = bottomOffset > 0 ? "bottom" : "top"
					this.$refs.dropDown.isActive = true;
				})
			}
		},
		assignBtn() {
			this.$nextTick(() => {
				this.filePanel.uploaderInstance.assignBrowse(document.getElementById('upfileBtn'))
				this.filePanel.uploaderInstance.assignBrowse(document.getElementById('upfolderBtn'), true)
			});
		},
		dorpActiveChange($event, el) {
			if ($event) {
				this.isConfirmed = false
			}
		},
		rename() {
			this.$refs.dropDown.toggle()
			this.filePanel.showRenameModal(this.item)
		},

		// Paste File
		paste(style = "overwrite") {
			this.$refs.dropDown.toggle()
			this.filePanel.paste(style)
		},
		download() {
			this.$refs.dropDown.toggle()
			const downItem = (this.items.length == 1) ? this.items[0] : this.items
			this.downloadFile(downItem);
		},
		async shareFoler() {
			this.$refs.dropDown.toggle()
			const data = [{
				path: this.item.path,
				anonymous: true
			}]
			try {
				await this.$api.samba.createShare(data)
				this.filePanel.reloadShare()
				this.filePanel.getShareLink(this.item)
			} catch (error) {
				this.isSaving = false
				this.$buefy.toast.open({
					message: error.response.data.message,
					type: 'is-danger'
				})
			}
		},

		unShare() {
			this.$refs.dropDown.toggle()
			const data = {
				id: this.item.extensions.share.id,
			}
			this.filePanel.handleUnShare(data)
		},

		uploadFile() {
			this.$refs.dropDown.toggle()
			this.filePanel.uploaderInstance.opts.query.path = this.filePanel.currentPath
		}

	},
}
</script>

<style></style>
