<template>
	<div class="overlay">
		<b-loading v-model="isLoading" :is-full-page="false"></b-loading>
		<header class="modal-card-head">
			<div class="is-flex-grow-1 is-flex ">
				<!-- Title Start -->
				<h3 class="title is-5 one-line mr-4">{{ item.name }}</h3>
				<!-- Title End -->
			</div>
			<div class="is-flex is-align-items-center">
				<!-- Download File Button Start -->
				<b-button :label="$t('Download')" class="mr-2" icon-left="download" rounded size="is-small"
					type="is-primary" @click="download" />
				<!-- Download File Button End -->
				<!-- Close Button Start -->
				<div class="close-button" @click="$emit('close')">
					<b-icon icon="close-outline" pack="casa"></b-icon>
				</div>
				<!-- Close File Button End -->
			</div>
		</header>

		<!-- Player Start -->
		<div class="is-flex is-justify-content-center is-align-items-center is-flex-grow-1 v-container video">
			<div class="scrollbars-light doc-container">
				<vue-office-docx :src="docx" @rendered="rendered" />
			</div>
		</div>
		<!-- Player Start -->

		<!-- Player Footer Start -->
		<div class="v-footer is-flex is-justify-content-center">

		</div>
		<!-- Player Footer End -->
	</div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'

export default {
	mixins: [mixin],
	props: {
		item: {
			type: Object,
			default: () => {
				return {
					path: '/DATA/1.png',
					name: '1.png'
				}
			}
		},
	},
	components: {
		VueOfficeDocx
	},
	data() {
		return {
			type: "",
			ext: "",
			isLoading: true,
			docx: this.getFileUrl(this.item),
		}
	},
	methods: {
		rendered() {
			this.isLoading = false
		}
	}
}
</script>
<style lang="scss" scoped>
::v-deep .vue-office-docx {
	height: 100%;
	width: 100%;

	.docx-wrapper {
		background-color: $white;

		>section.docx {
			box-shadow: none;
		}
	}
}
</style>