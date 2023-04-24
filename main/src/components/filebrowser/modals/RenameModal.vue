<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/4/24 上午11:20
  * @FilePath: /CasaOS-UI/src/components/filebrowser/modals/RenameModal.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->

<!--
 * @Author: JerryK
 * @Date: 2022-02-25 11:03:08
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 12:16:21
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\modals\RenameModal.vue
-->
<template>
	<div class="modal-card">
		<!-- Modal-Card Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-3">{{ $t('Rename') }}</h3>
			</div>
			<div>
				<button class="delete" type="button" @click="$emit('close')"/>
			</div>
		</header>
		<!-- Modal-Card Header End -->
		<!-- Modal-Card Body Start -->
		<section class="modal-card-body ">
			<div class="node-card">
				<div class="cover">
					<div :class="item | coverType">
						<img :class="item | iconType" :src="getIconFile(item)" alt="folder"/>
					</div>
				</div>
				<b-field :message="errors" :type="errorType" class="mb-3 mt-5 has-text-light" expanded>
					<b-input ref="rinput" v-model="fileName" v-on:keyup.enter.native="saveNewName"
							 @input.native="fileName = fileName.replace(/\//g,'')"></b-input>
				</b-field>
			</div>

		</section>
		<!-- Modal-Card Body End -->
		<!-- Modal-Card Footer Start-->
		<footer class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1"></div>
			<div>
				<b-button :label="$t('Submit')" expaned rounded type="is-primary" @click="saveNewName"/>
			</div>
		</footer>
		<!-- Modal-Card Footer End -->
	</div>
</template>

<script>
import {mixin} from '@/mixins/mixin';
import path    from 'path'

export default {
	mixins: [mixin],
	props: {
		item: Object
	},
	data() {
		return {
			fileName: this.item.name,
			errorType: "is-success",
			errors: ""
		}
	},
	mounted() {
		this.$refs.rinput.focus();
	},

	methods: {
		saveNewName() {
			let newPath = path.join(this.$store.state.currentPath, this.fileName)
			if (this.item.name === this.fileName) {
				this.$emit("close")
				return false
			}
			this.$api.file.rename(this.item.path, newPath).then(res => {
				if (res.data.success == 200) {
					this.$emit("reload")
					this.$emit("close")
				} else {
					this.errorType = "is-danger"
					this.errors = res.data.message
				}
			})
		}
	},

}
</script>

<style>
</style>