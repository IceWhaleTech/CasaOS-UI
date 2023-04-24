<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-03-04 12:29:37
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-19 22:53:09
 * @FilePath: \CasaOS-UI\src\components\filebrowser\uploader\components\btn.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
	<label v-show="support" ref="btn" class="uploader-btn">
		<slot></slot>
	</label>
</template>

<script>
import {supportMixin, uploaderMixin} from '../common/mixins'

const COMPONENT_NAME = 'uploader-btn'

export default {
	name: COMPONENT_NAME,
	mixins: [uploaderMixin, supportMixin],
	props: {
		directory: {
			type: Boolean,
			default: false
		},
		single: {
			type: Boolean,
			default: false
		},
		attrs: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.uploader.uploader.assignBrowse(this.$refs.btn, this.directory, this.single, this.attrs)
		})
	}
}
</script>

<style>
.uploader-btn {
	display: inline-block;
	position: relative;
	padding: 4px 8px;
	font-size: 100%;
	line-height: 1.5em;
	color: #666;
	border: 1px solid #666;
	cursor: pointer;
	border-radius: 2px;
	background: none;
	outline: none;
}

.uploader-btn:hover {
	background-color: rgba(0, 0, 0, .08);
}
</style>
