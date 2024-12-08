<template>
	<div class="modal-card">
		<!-- Modal-Card Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-header">{{ $t('Rename') }}</h3>
			</div>
			<b-icon class="close-button" icon="close-outline" pack="casa" @click.native="$emit('close');" />
		</header>
		<!-- Modal-Card Header End -->
		<!-- Modal-Card Body Start -->
		<section class="modal-card-body ">
			<div class="node-card">
				<div class="cover is-flex is-justify-content-center is-align-items-center">
					<div :class="item | coverType">
						<img :class="item | iconType" :src="getIconFile(item)" alt="folder" />
					</div>
				</div>
				<b-field :message="errors" :type="errorType" class="mb-3 mt-5 has-text-light" expanded>
					<b-input ref="rinput" v-model="fileName" v-on:keyup.enter.native="saveNewName"
						@input.native="fileName = fileName.replace(/\//g, '')"></b-input>
				</b-field>
			</div>

		</section>
		<!-- Modal-Card Body End -->
		<!-- Modal-Card Footer Start-->
		<footer class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1"></div>
			<div>
				<b-button :label="$t('Submit')" expaned rounded type="is-primary" @click="saveNewName" />
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
		this.$nextTick(() => {
			this.$refs.rinput.getElement().select();
		})
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

<style></style>