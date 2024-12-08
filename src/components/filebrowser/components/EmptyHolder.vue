<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2022/12/8 下午3:10
  * @FilePath: /CasaOS-UI/src/components/filebrowser/components/EmptyHolder.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
	<div class="has-text-centered">

		<h5 class="title is-65">{{ $t('Drop your files here to upload') }}</h5>
		<p class="is-size-7">{{ $t('or') }}</p>

		<ul class="is-flex upload-btns is-justify-content-center">
			<li class="e-btn" @click="$emit('newFile')">
				<span>{{ $t('New File') }}</span>
				<b-image :src="require('@/assets/img/filebrowser/newFile.svg')"></b-image>
			</li>
			<li class="e-btn" @click="$emit('newFolder')">
				<span>{{ $t('New Folder') }}</span>
				<b-image :src="require('@/assets/img/filebrowser/newFolder.svg')"></b-image>
			</li>
			<li id="eUpFileBtn" class="e-btn">
				<span>{{ $t('Upload Files') }}</span>
				<b-image :src="require('@/assets/img/filebrowser/upfile.svg')"></b-image>
			</li>
			<li id="eUpFolderBtn" class="e-btn">
				<span>{{ $t('Upload Folder') }}</span>
				<b-image :src="require('@/assets/img/filebrowser/upfolder.svg')"></b-image>
			</li>
		</ul>
	</div>
</template>

<script>
import {mixin} from '@/mixins/mixin';

export default {
	mixins: [mixin],
	inject: ['filePanel'],
	mounted() {
		this.$nextTick(() => {
			this.filePanel.uploaderInstance.assignBrowse(document.getElementById('eUpFileBtn'))
			this.filePanel.uploaderInstance.assignBrowse(document.getElementById('eUpFolderBtn'), true)
		});
	},
	methods: {
		freshPath() {
			this.filePanel.uploaderInstance.opts.query.path = this.filePanel.currentPath
		}
	}
}
</script>

<style>
</style>