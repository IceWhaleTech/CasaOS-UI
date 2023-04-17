<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2021-12-11 11:39:46
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-21 17:08:20
 * @FilePath: \CasaOS-UI\src\components\forms\IconInput.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
	<b-input v-model="path" :placeholder="placeholder" expanded icon-right="image-filter-center-focus-strong"
			 icon-right-clickable @input="handleInput"
			 @icon-right-click="selectFile"></b-input>
</template>

<script>
import FilePanel from '../fileList/FilePanel.vue'

const DATA_PATH = "/"
const DEV_PATH = "/dev"
export default {
	name: "iconInput",
	props: {
		vdata: String,
		type: String,
		placeholder: String
	},
	model: {
		prop: 'vdata',
		event: 'change'
	},
	data() {
		return {
			path: this.vdata
		}
	},

	computed: {

		initPath() {
			if (this.type == "device") {
				return (this.path == "") ? DEV_PATH : this.path
			} else {
				return (this.path == "") ? DATA_PATH : this.path
			}
		},
		rootPath() {
			if (this.type == "device") {
				return DEV_PATH
			} else {
				return DATA_PATH
			}
		}
	},
	watch: {
		vdata(val) {
			this.path = val
		}
	},
	methods: {
		handleInput() {
			this.$emit('change', this.path)
			this.$emit('input', this.path)
		},
		selectFile() {
			this.showFileModal();
		},
		showFileModal() {
			console.log('initPath', this.initPath)
			console.log('rootPath', this.rootPath)
			this.$buefy.modal.open({
				parent: this,
				component: FilePanel,
				hasModalCard: true,
				customClass: 'file-sel-modal',
				trapFocus: true,
				canCancel: ['escape'],
				scroll: "keep",
				animation: "zoom-in",
				events: {
					'updatePath': (e) => {
						this.path = e
						this.$emit('change', this.path)
						this.$emit('input', this.path)
					}
				},
				props: {
					initPath: this.initPath,
					rootPath: this.rootPath
				}
			})
		}
	},
}
</script>

<style>
</style>