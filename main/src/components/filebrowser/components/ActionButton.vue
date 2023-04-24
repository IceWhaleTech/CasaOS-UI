<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/4/24 上午11:20
  * @FilePath: /CasaOS-UI/src/components/filebrowser/components/ActionButton.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->

<!--
 * @Author: JerryK
 * @Date: 2022-02-23 17:08:21
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-01 18:52:38
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/filebrowser/components/ActionButton.vue
-->
<template>
	<div class="action-btn">
		<b-dropdown :id="'dr-'+index" ref="dropDown" :close-on-click="false"
					:position="'is-'+verticalPos+'-'+horizontalPos" animation="fade1"
					append-to-body aria-role="list" class="file-dropdown"
					@active-change="dorpActiveChange($event,'dr-'+index)">
			<template #trigger>
				<p role="button">
					<b-icon id="das" custom-size="mdi-18px" icon="dots-horizontal">
					</b-icon>
				</p>
			</template>
			<b-dropdown-item aria-role="menuitem" @click="download">
				{{ $t('Download') }}
			</b-dropdown-item>
			<b-dropdown-item aria-role="menuitem" @click="copyPath">
				{{ $t('Copy Path') }}
			</b-dropdown-item>
			<hr class="dropdown-divider">
			<b-dropdown-item aria-role="menuitem" @click="rename">
				{{ $t('Rename') }}
			</b-dropdown-item>
			<b-dropdown-item aria-role="menuitem" @click="operate('move',item)">
				{{ $t('Cut') }}
			</b-dropdown-item>
			<b-dropdown-item aria-role="menuitem" @click="operate('copy',item)">
				{{ $t('Copy') }}
			</b-dropdown-item>
			<b-dropdown-item v-if="isWallpaperType" aria-role="menuitem" @click="setAsWallpaper(item)">
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

			<hr class="dropdown-divider">
			<b-dropdown-item v-if="!isConfirmed" aria-role="menuitem" class="has-text-danger"
							 @click="isConfirmed = true">
				{{ $t('Delete') }}
			</b-dropdown-item>
			<b-dropdown-item v-else aria-role="menuitem" class="has-text-danger" @click="deleteItem(item)">
				{{ $t('Are you sure?') }}
			</b-dropdown-item>
		</b-dropdown>
	</div>
</template>

<script>
import {mixin, wallpaperType} from '@/mixins/mixin';
import has                    from 'lodash/has'

export default {
	mixins: [mixin],
	inject: ['filePanel'],
	props: {
		cols: Number,
		index: Number,
		item: Object
	},
	data() {
		return {
			verticalPos: "bottom",
			isConfirmed: false,
			shareId: ""
		}
	},
	computed: {
		horizontalPos() {
			return (this.index + 1) % this.cols == 0 ? "left" : "right"
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
		}
	},
	mounted() {
		document.addEventListener('contextmenu', this.hideContextMenu);

	},
	destroyed() {
		document.removeEventListener('contextmenu', this.hideContextMenu)
	},

	methods: {
		dorpActiveChange($event, el) {
			if ($event) {
				this.isConfirmed = false
			}
			const trigger = document.getElementById(el);
			const bottomOffset = window.innerHeight - trigger.getBoundingClientRect().y - 216
			this.verticalPos = bottomOffset > 0 ? "bottom" : "top"
		},
		hideContextMenu() {
			this.$refs.dropDown.isActive = false
		},
		rename() {
			this.$refs.dropDown.toggle()
			this.filePanel.showRenameModal(this.item)
		},

		async shareFoler() {
			this.$refs.dropDown.toggle()
			const data = [{
				path: this.item.path,
				anonymous: true
			}]
			try {
				await this.$api.samba.createShare(data)
				this.filePanel.getShareLink(this.item)
				this.filePanel.reloadShare()
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
		}

	},
}
</script>

<style>
</style>