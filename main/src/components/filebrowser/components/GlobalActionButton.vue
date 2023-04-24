<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-05-31 13:57:21
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-15 18:44:43
 * @FilePath: /CasaOS-UI/src/components/filebrowser/components/GlobalActionButton.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
	<div class="action-btn">
		<b-dropdown ref="moreBtn" :mobile-modal="false" :triggers="['click','context']" animation="fade1"
		            append-to-body aria-role="list" class="file-dropdown" close-on-click position="is-bottom-right">
			<template #trigger>
				<b-button :label="$t('Upload or Create')" class="mr-2" icon-left="book-arrow-up" rounded
				          size="is-small" type="is-primary"/>
			</template>
			<b-dropdown-item id="upfile-btn" aria-role="menuitem" class="is-flex is-align-items-center">
				<b-icon class="mr-1" custom-size="mdi-18px" icon="file-upload-outline"></b-icon>
				{{ $t('Upload Files') }}
			</b-dropdown-item>
			<b-dropdown-item id="upfolder-btn" aria-role="menuitem" class="is-flex is-align-items-center">
				<b-icon class="mr-1" custom-size="mdi-18px" icon="folder-upload-outline"></b-icon>
				{{ $t('Upload Folder') }}
			</b-dropdown-item>
			<hr class="dropdown-divider">
			<b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" @click="showNewFileModal">
				<b-icon class="mr-1" custom-size="mdi-18px" icon="file-plus-outline"></b-icon>
				{{ $t('New File') }}
			</b-dropdown-item>
			<b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" @click="showNewFolderModal">
				<b-icon class="mr-1" custom-size="mdi-18px" icon="folder-plus-outline"></b-icon>
				{{ $t('New Folder') }}
			</b-dropdown-item>
		</b-dropdown>
	</div>
</template>

<script>
export default {
	name: "global-action-button",
	inject: ['filePanel'],
	mounted() {
		this.assignBtn();
	},
	methods: {
		showNewFileModal() {
			this.$emit('showNewFileModal')
		},
		showNewFolderModal() {
			this.$emit('showNewFolderModal')
		},
		assignBtn() {
			this.$nextTick(() => {
				this.filePanel.uploaderInstance.assignBrowse(document.getElementById('upfile-btn'))
				this.filePanel.uploaderInstance.assignBrowse(document.getElementById('upfolder-btn'), true)
			});
		},
		freshPath() {
			this.filePanel.uploaderInstance.opts.query.path = this.filePanel.currentPath
		}
	},
}
</script>

<style>
</style>