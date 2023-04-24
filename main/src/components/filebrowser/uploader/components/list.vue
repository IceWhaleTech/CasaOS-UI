<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/4/24 上午11:20
  * @FilePath: /CasaOS-UI/src/components/filebrowser/uploader/components/list.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->
<template>
	<div class="uploader-list">
		<slot :file-list="fileList">
			<ul>
				<li v-for="file in fileList" :key="file.id">
					<uploader-file :file="file" :list="true"></uploader-file>
				</li>
			</ul>
		</slot>
	</div>
</template>

<script>
import {uploaderMixin} from '../common/mixins'
import UploaderFile    from './file.vue'

const COMPONENT_NAME = 'uploader-list'

export default {
	name: COMPONENT_NAME,
	mixins: [uploaderMixin],
	computed: {
		fileList() {
			return this.uploader.fileList
		}
	},
	components: {
		UploaderFile
	}
}
</script>

<style>
.uploader-list {
	position: relative;
}

.uploader-list > ul {
	list-style: none;
	margin: 0;
	padding: 0
}
</style>
