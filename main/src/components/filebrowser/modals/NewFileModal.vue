<template>
	<div class="modal-card">
		<!-- Modal-Card Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-header">{{ $t('New File') }}</h3>
			</div>
			<b-icon class="close-button" icon="close-outline" pack="casa" @click.native="$emit('close');" />
		</header>
		<!-- Modal-Card Header End -->
		<!-- Modal-Card Body Start -->
		<section class="modal-card-body ">
			<div class="node-card">
				<div class="cover is-flex is-justify-content-center is-align-items-center">
					<div class="folder-cover">
						<img :src="require('@/assets/img/filebrowser/text-x-generic.svg')" alt="folder"
							class="folder-icon" />
					</div>
				</div>
				<b-field :message="errors" :type="errorType" class="mb-0 mt-5 has-text-light" expanded>
					<b-input v-model="fileName" v-on:keyup.enter.native="createFolder" ref="inputs"
						@input.native="fileName = fileName.replace(/\//g, '')"></b-input>
				</b-field>
			</div>

		</section>
		<!-- Modal-Card Body End -->
		<!-- Modal-Card Footer Start-->
		<footer class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1"></div>
			<div>
				<b-button :label="$t('Submit')" expaned rounded type="is-primary" @click="createFolder" />
			</div>
		</footer>
		<!-- Modal-Card Footer End -->
	</div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import path from 'path'

export default {
	mixins: [mixin],
	props: {
		currentPath: String
	},
	data() {
		return {
			fileName: 'New File',
			errorType: "is-success",
			errors: ""
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.$refs.inputs.getElement().select();
		})
	},
	methods: {

		createFolder() {
			let newPath = path.join(this.currentPath, this.fileName)
			this.$api.file.create(newPath).then(res => {
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

<style></style>