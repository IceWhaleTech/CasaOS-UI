<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2021-10-27 15:44:17
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-03 12:22:43
 * @FilePath: /CasaOS-UI/src/components/fileList/CreatePanel.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->
<template>
	<div class="modal-card">
		<!-- Modal-Card Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-4 has-text-weight-normal">{{ $t(title) }}</h3>
			</div>
		</header>
		<!-- Modal-Card Header End -->
		<!-- Modal-Card Body Start -->
		<section class="modal-card-body">
			<b-field :label="$t('Name ')" :message="message" :type="errorType">
				<b-input v-model="name" expanded maxlength="255"></b-input>
			</b-field>

		</section>
		<!-- Modal-Card Body End -->
		<!-- Modal-Card Footer Start-->
		<footer class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1"></div>
			<div>
				<b-button :label="$t('Cancel')" rounded @click="$emit('close')"/>
				<b-button :label="$t('Submit')" rounded type="is-primary" @click="create()"/>
			</div>
		</footer>
		<!-- Modal-Card Footer End-->
	</div>
</template>

<script>
export default {

	props: {
		initPath: String,
		isDir: Boolean,
	},
	data() {
		return {
			name: "",
			message: "",
			errorType: ""
		}
	},

	computed: {
		title() {
			return this.isDir ? "Create Folder" : "Create File";
		}
	},
	methods: {
		create() {
			let path = `${this.initPath}/${this.name}`
			if (this.isDir) {
				this.$api.folder.create(path).then(res => {
					if (res.data.success == 200) {
						this.successCallBack(path);
					} else {
						this.errorCallBack(res.data.message);
					}
				})
			} else {
				this.$api.file.create(path).then(res => {
					if (res.data.success == 200) {
						this.successCallBack(path);
					} else {
						this.errorType = "is-danger"
						this.errorCallBack(res.data.message);
					}
				})
			}
		},
		successCallBack(path) {
			this.message = ""
			this.errorType = ""
			this.$emit('close');
			this.$emit("reloadPath", path)
		},
		errorCallBack(message) {
			this.errorType = "is-danger"
			this.message = message
		},
	},
}
</script>
