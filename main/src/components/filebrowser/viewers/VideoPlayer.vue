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
				<b-button icon-left="downloads-outline" icon-pack="casa" type="is-primary" size="is-small"
					:label="$t('Download')" class="mr-2" rounded @click="download" />
				<!-- Download File Button End -->

				<!-- Close Button Start -->
				<div class="close-button" @click="$emit('close')">
					<b-icon icon="close-outline" pack="casa"></b-icon>
				</div>
				<!-- Close File Button End -->
			</div>
		</header>

		<!-- Player Start -->
		<div ref="playerContainer"
			class="is-flex is-justify-content-center is-align-items-center is-flex-grow-1 v-container video pt-4 pb-5">
			<div class="audio-blur-background" v-if="poster != ''"></div>
			<div class="video-container" :class="{ 'is-align-items-center': isAudio }">
				<div key="video-player" ref="artRef" v-if="isVideo" class="player">
				</div>
				<aplayer :key="item.path" :autoplay="true" v-if="isAudio" preload="auto" class="player-audio"
					theme="#41b883" :music="{
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
				(async () => {
					const fileUrl = this.getFileUrl(this.item);
					const metadata = await mm.fetchFromUrl(fileUrl);
					if (metadata.common.picture) {
						const blob = new Blob([metadata.common.picture[0].data], { type: metadata.common.picture[0].format });
						const url = URL.createObjectURL(blob);
						this.poster = url;
						this.$refs.playerContainer.style.backgroundImage = `url(${this.poster})`;
						this.$refs.playerContainer.style.backgroundSize = 'cover';
						this.$refs.playerContainer.style.backgroundPosition = 'center';
					}
					// 将图片作为div.v-container的背景图，并且增加模糊效果


					this.audioTitle = metadata.common.title;
					this.audioArtist = metadata.common.artist;
				})();
			} else {
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
			}
		});
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


.audio-blur-background {
	width: 100%;
	height: 100%;
	margin: -1rem 0 -1.5rem 0;
	background-size: cover;
	background-position: bottom center;
	background-attachment: fixed;
	background-color: rgba(53, 54, 58, 0.4);
	-webkit-backdrop-filter: blur(5px) saturate(180%);
	backdrop-filter: blur(10px) saturate(180%);
	border: none;
	position: absolute;
	z-index: 0;
	overflow: hidden;
}
</style>
  