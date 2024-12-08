<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/4/24 上午11:20
  * @FilePath: /CasaOS-UI/src/components/filebrowser/uploader/components/unsupport.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->
<template>
	<div v-show="!support" class="uploader-unsupport">
		<slot>
			<p>
				Your browser, unfortunately, is not supported by Uploader.js. The library requires support for <a
				href="http://www.w3.org/TR/FileAPI/">the HTML5 File API</a> along with <a
				href="http://www.w3.org/TR/FileAPI/#normalization-of-params">file slicing</a>.
			</p>
		</slot>
	</div>
</template>

<script>
import {supportMixin, uploaderMixin} from '../common/mixins'

const COMPONENT_NAME = 'uploader-unsupport'

export default {
	name: COMPONENT_NAME,
	mixins: [uploaderMixin, supportMixin]
}
</script>

<style>
.uploader-unsupport {
	position: relative;
	z-index: 10;
	overflow: hidden;
}
</style>
