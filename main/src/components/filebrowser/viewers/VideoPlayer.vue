<template>
	<div class="overlay common-modal-background">
		<header class="modal-card-head">
			<div class="is-flex-grow-1 is-flex">
				<!-- Title Start -->
				<h3 class="title is-5 one-line mr-4">{{ item.name }}</h3>
				<!-- Title End -->
			</div>
			<div class="is-flex is-align-items-center">
				<!-- Download File Button Start -->
				<b-button icon-left="downloads-outline" icon-pack="casa" type="is-primary" size="is-small" :label="$t('Download')"
					class="mr-2" rounded @click="download" />
				<!-- Download File Button End -->

				<!-- Close Button Start -->
				<div class="close-button" @click="close">
					<b-icon icon="close-outline" pack="casa"></b-icon>
				</div>
				<!-- Close File Button End -->
			</div>
		</header>

		<!-- Player Start -->
		<div class="is-flex is-justify-content-center is-align-items-center is-flex-grow-1 v-container video pt-4 pb-5">
			<div class="video-container" :class="{ 'is-align-items-center': isAudio }">
				<div key="video-player" ref="artRef" v-if="isVideo" class="player">
				</div>
				<aplayer autoplay v-if="isAudio" class="player-audio" theme="#007AE5" :music="{
					title: audioTitle,
					artist: audioArtist,
					src: this.getFileUrl(this.item),
					pic: poster
				}" />
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
import { mixin } from "@/mixins/mixin";
import Aplayer from 'vue-aplayer'
import Artplayer from 'artplayer';
import * as mm from 'music-metadata-browser';
Aplayer.disableVersionBadge = true
export default {
	mixins: [mixin],
	props: {
		item: {
			type: Object,
			default: () => {
				return {
					path: "",
					name: "",
				};
			},
		},
		list: {
			type: Array,
			default: () => {
				return [];
			},
		},
	},
	components: {
		Aplayer,
	},
	data() {
		return {
			type: "",
			ext: "",
			instance: null,
			poster: "",
			audioTitle: this.item.name,
			audioArtist: "...",
		};
	},
	computed: {
		isVideo() {
			return this.type == "video-x-generic";
		},
		isAudio() {
			return this.type == "audio-x-generic";
		},
	},

	mounted() {

		this.ext = this.getFileExt(this.item, true);
		Object.keys(this.typeMap).forEach((_type) => {
			const extensions = this.typeMap[_type];
			if (extensions.indexOf(this.ext) > -1) {
				this.type = _type;
			}
		});
		this.$nextTick(() => {
			if (this.isAudio) {
				const imgUrl = this.getThumbUrl(this.item)
				const img = new Image();
				img.crossOrigin = location.host;
				img.src = imgUrl;
				img.onload = () => {
					const canvas = document.createElement('canvas');
					canvas.width = img.width;
					canvas.height = img.height;
					const ctx = canvas.getContext('2d');
					ctx.drawImage(img, 0, 0, img.width, img.height);
					this.poster = canvas.toDataURL('image/png');
				};

				(async () => {
					const fileUrl = this.getFileUrl(this.item);
					const metadata = await mm.fetchFromUrl(fileUrl);
					this.audioTitle = metadata.common.title;
					this.audioArtist = metadata.common.artist;
				})();

				return false;
			}

			this.instance = new Artplayer({
				url: this.getFileUrl(this.item),
				container: this.$refs.artRef,
				setting: true,
				flip: true,
				playbackRate: true,
				aspectRatio: true,
				subtitleOffset: true,
				fullscreenWeb: true,
				fullscreen: true,
				autoplay: true,
				pip: true,
				theme: '#007AE5',
				playsInline: true,
				screenshot: true,
				airplay: true,
				playsinline: true,
				lang: this.$i18n.locale.replace('_', '-'),
			});
		});


	},
	methods: {
		download() {
			this.downloadFile(this.item);
		},
		close() {
			this.$emit("close");
		}
	},
	beforeDestroy() {
		if (this.instance && this.instance.destroy) {
			this.instance.destroy(false);
		}
	},
};
</script>
<style lang="scss" scoped>
.player {
	height: 100%;
	width: 100%;
}

.player-audio {
	width: 100%;
	max-width: 80rem;
	max-height: 4.125rem;
}
</style>
  