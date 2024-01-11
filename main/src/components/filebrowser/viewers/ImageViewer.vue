<template>
	<div id="image_viewer" class="overlay" @mousemove="onMouseMove" @touchmove="onMouseMove">
		<header class="modal-card-head">
			<div class="is-flex  is-flex-grow-1 is-flex-shrink-1">
				<!-- Title Start -->
				<h3 class="title is-5 one-line mr-4">{{ currentItem.name }}</h3>
				<!-- Title End -->
			</div>
			<div class="is-flex is-align-items-center is-flex-shrink-0">
				<!-- Download File Button Start -->
				<b-button :label="$t('Download')" class="mr-2" icon-left="download" rounded size="is-small"
					type="is-primary" @click="download" />
				<!-- Download File Button End -->

				<!-- Close Button Start -->
				<div class="close-button" @click="close">
					<b-icon icon="close-outline" pack="casa"></b-icon>
				</div>
				<!-- Close File Button End -->
			</div>
		</header>

		<!-- Toolbar Start -->
		<div v-if="isMoving" class="img-toolbar is-flex">
			<b-tooltip :label="$t('Previous')" type="is-dark">
				<div :class="{ disabled: disablePrev }" class="toolbar-item" @click="prev">
					<span class="has-text-white block">
						<b-icon icon="arrow-left-thin" size="is-small"></b-icon>
					</span>
				</div>
			</b-tooltip>

			<b-tooltip :label="$t('Zoom in')" type="is-dark">
				<div class="toolbar-item" @click="viewer.zoom(0.1)">
					<span class="has-text-white block">
						<b-icon icon="magnify-plus-outline" size="is-small"></b-icon>
					</span>
				</div>
			</b-tooltip>
			<b-tooltip :label="$t('Rotate')" type="is-dark">
				<div class="toolbar-item" @click="viewer.rotate(90)">
					<span class="has-text-white block">
						<b-icon custom-class="mdi-flip-h" icon="format-rotate-90" size="is-small"></b-icon>
					</span>
				</div>
			</b-tooltip>
			<b-tooltip :label="$t('Reset')" type="is-dark">
				<div class="toolbar-item" @click="viewer.reset()">
					<span class="has-text-white block">
						<b-icon icon="restore" size="is-small"></b-icon>
					</span>
				</div>
			</b-tooltip>
			<b-tooltip :label="$t('Zoom out')" type="is-dark">
				<div class="toolbar-item" @click="viewer.zoom(-0.1)">
					<span class="has-text-white block">
						<b-icon icon="magnify-minus-outline" size="is-small"></b-icon>
					</span>
				</div>
			</b-tooltip>

			<b-tooltip :label="$t('INext')" type="is-dark">
				<div :class="{ disabled: disableNext }" class="toolbar-item" @click="next">
					<span class="has-text-white block">
						<b-icon icon="arrow-right-thin" size="is-small"></b-icon>
					</span>
				</div>
			</b-tooltip>

		</div>
		<!-- Toolbar End -->

		<!-- Player Start -->
		<div class=" v-container pl-4 pr-4">
			<viewer ref="viewer" :images="currentItemArray" :options="viewerOptions" class="viewer" @inited="inited">
				<template #default="scope">
					<img alt="image" v-for="src in scope.images" :key="src" :src="src">
				</template>
			</viewer>
		</div>
		<!-- Player Start -->

	</div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import 'viewerjs/dist/viewer.css'
import { component as Viewer } from "v-viewer"

const XIMAGES = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'tiff']
export default {
	mixins: [mixin],
	props: {
		item: {
			type: Object,
			default: () => {
				return {
					path: '',
					name: ''
				}
			}
		},

		list: []
	},
	components: {
		Viewer
	},
	data() {
		return {
			isMoving: false,
			timeout: null,
			itemList: [],
			currentItem: this.item,
			currentItemIndex: 0,
			currentItemArray: [],
			viewer: {},
			viewerOptions: {
				button: false,    //Hide FullScreen Button
				toolbar: false,   //Hide Toolbar
				title: false,     //Hide Title
				navbar: false,    //Hide Navbar
				backdrop: false,  //Hide Background
				transition: false,//Without css3 animation
				inline: true,
				initialViewIndex: 0,
			},
		}
	},
	computed: {
		disableNext() {
			return this.currentItemIndex == this.itemList.length - 1
		},
		disablePrev() {
			return this.currentItemIndex == 0
		},
	},
	created() {
		this.filterImages()
		this.getCurrentImageIndex()
		this.setSourceImageURLs()
	},
	mounted() {
		window.onkeyup = (e) => {
			switch (e.code) {

				case 'ArrowRight':
					this.next()
					break;
				case 'ArrowLeft':
					this.prev()
					break;
			}
		};
	},

	methods: {
		close() {
			this.$emit("close");
		},
		inited(viewer) {
			this.viewer = viewer
			this.viewer.show()
			this.onMouseMove()
		},
		next() {
			if (this.currentItemIndex < this.itemList.length - 1) {
				this.currentItemIndex++
				this.setSourceImageURLs()
			}
		},
		prev() {
			if (this.currentItemIndex > 0) {
				this.currentItemIndex--
				this.setSourceImageURLs()
			}
		},
		filterImages() {
			this.itemList = this.list.filter(item => {
				const ext = this.getFileExt(item)
				return (!item.is_dir && XIMAGES.indexOf(ext.toLowerCase()) > -1)
			})
		},
		getCurrentImageIndex() {
			this.itemList.forEach((item, index) => {
				if (item == this.currentItem) {
					this.currentItemIndex = index
				}
			})
		},
		setSourceImageURLs() {
			this.currentItem = this.itemList[this.currentItemIndex]
			this.currentItemArray = [this.getFileUrl(this.currentItem)]
		},
		// Hide Toolbar after 5 seconds
		onMouseMove() {
			this.isMoving = true;
			if (this.timeout !== null) {
				clearTimeout(this.timeout);
			}
			this.timeout = setTimeout(() => {
				this.isMoving = false;
				this.timeout = null;
			}, 5000);
		}
	}
}
</script>

<style lang="scss" scoped>
.v-container::v-deep .viewer-canvas {
	background-image: url("data:image/svg+xml;utf8,%3C?xml version='1.0' encoding='UTF-8'?%3E%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 16 16'%3E%3Cpath fill='%23ccc' d='M8 6.5A1.5 1.5 0 1 0 8 9.5A1.5 1.5 0 1 0 8 6.5z' fill-opacity='0.1' /%3E%3C/svg%3E");
	background-color: transparent;
	background-repeat: repeat;
}
</style>