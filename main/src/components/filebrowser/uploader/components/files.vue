<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/4/24 上午11:20
  * @FilePath: /CasaOS-UI/src/components/filebrowser/uploader/components/files.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->
<template>
	<div class="uploader-files">
		<slot :files="files">
			<ul>
				<li v-for="file in files" :key="file.id">
					<uploader-file :file="file"></uploader-file>
				</li>
			</ul>
		</slot>
	</div>
</template>

<script>
import {uploaderMixin} from '../common/mixins'
import UploaderFile    from './file.vue'

const COMPONENT_NAME = 'uploader-files'

export default {
	name: COMPONENT_NAME,
	mixins: [uploaderMixin],
	computed: {
		files() {
			return this.uploader.files
		}
	},
	components: {
		UploaderFile
	}
}
</script>

<style>
.uploader-files {
	position: relative;
}

.uploader-files > ul {
	list-style: none;
	margin: 0;
	padding: 0
}
</style>
