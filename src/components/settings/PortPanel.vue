<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/1/11 下午1:37
  * @FilePath: /CasaOS-UI/src/components/settings/PortPanel.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->

<!--
 * @Author: JerryK
 * @Date: 2021-12-06 18:29:48
 * @LastEditTime: 2022-08-18 10:48:41
 * @Description:
 * @FilePath: \CasaOS-UI-dev\src\components\settings\PortPanel.vue
-->
<template>
	<div class="modal-card">
		<!-- Modal-Card Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-3">{{ $t('Edit Web UI port') }}</h3>
			</div>
			<div>
				<button class="delete" type="button" @click="$emit('close')"/>
			</div>
		</header>
		<!-- Modal-Card Header End -->
		<!-- Modal-Card Body Start -->
		<section class="modal-card-body ">
			<b-field :message="errors" :type="errorType" class="mb-5 mt-5 has-text-light" expanded>
				<b-input v-model="port" type="number" v-on:keyup.enter.native="savePort"></b-input>
			</b-field>
		</section>
		<!-- Modal-Card Body End -->
		<!-- Modal-Card Footer Start-->
		<footer class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1"></div>
			<div>
				<b-button :label="$t('Cancel')" rounded @click="$emit('close')"/>
				<b-button :label="$t('Submit')" expaned rounded type="is-primary" @click="savePort"/>
			</div>
		</footer>
		<!-- Modal-Card Footer End -->
		<b-loading v-model="isLoading" :is-full-page="false"></b-loading>
	</div>
</template>

<script>

export default {
	name: "port-panel",
	data() {
		return {
			timer: 0,
			isLoading: false,
			confirmation: "",
			message: "",
			notificationShow: false,
			port: this.initPort,
			errorType: "is-success",
			errors: ""
		}
	},
	props: {
		initPort: {
			type: String,
			default: "0"
		},
	},

	methods: {
		savePort() {
			this.$messageBus('dashboardsetting_webuiport', this.port.toString())
			this.isLoading = true;
			this.$api.sys.editServerPort({port: this.port}).then(res => {

				if (res.data.success == 200) {
					this.errorType = "is-success";
					this.errors = "";
					// this.$api.sys.stopCasaOS();
					this.checkUpdate();
				} else {
					this.isLoading = false;
					this.errorType = "is-danger"
					this.errors = res.data.message
				}
			}).catch(err => {
				this.isLoading = false;
				this.errorType = "is-danger"
				this.errors = err.response.data.message
			})
		},
		checkUpdate() {

			this.timer = setInterval(() => {
				const checkUrl = `${this.$protocol}//${this.$baseIp}:${this.port}`
				this.$api.sys.checkUiPort(checkUrl + '/v1/gateway/port').then(res => {
					if (res.data.success == 200) {
						clearInterval(this.timer);
						const url = `${this.$protocol}//${this.$baseIp}:${res.data.data}`
						window.open(url, '_self');
					}
				})
			}, 1000)
		},
	},
	destroyed() {
		clearInterval(this.timer);
	},
}
</script>

<style>
</style>
