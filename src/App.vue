<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2022/12/1 下午7:59
  * @FilePath: /CasaOS-UI/src/App.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->

<template>
	<div id="app" :class="{'is-dark-bg':$route.meta.showBackground}" class="is-flex is-flex-direction-column">
		<template v-if="$route.meta.showBackground">
			<!-- Background Layer Start -->
			<casa-wallpaper :animate="isWelcome?initAni:noneAni"></casa-wallpaper>
			<!-- Background Layer End -->

			<!-- BrandBar Start -->
			<brand-bar v-if="!$store.state.isMobile" v-animate-css="brandAni"></brand-bar>
			<!-- BrandBar End -->
			<!-- ContactBar Start -->
			<contact-bar v-if="!$store.state.isMobile" v-animate-css="contactAni"></contact-bar>
			<!-- ContactBar End -->
		</template>

		<!-- Router View Start -->
		<router-view/>
		<!-- Router View End -->

		<!-- <v-tour name="myTour" :steps="steps"></v-tour> -->
	</div>
</template>

<script>
import BrandBar from './components/BrandBar.vue'
import ContactBar from './components/ContactBar.vue'
import CasaWallpaper from './components/wallpaper/CasaWallpaper.vue'
import {mixin} from './mixins/mixin';

const customIconConfig = {
	customIconPacks: {
		'casa': {
			sizes: {
				'default': 'is-size-4',
				'is-20': 'is-size-5',
				'is-small': '',
				'is-medium': 'is-size-3',
				'is-large': 'is-size-1'
			},
			iconPrefix: 'casa-',
			internalIcons: {
				'check': 'checkmark',
				'information': 'information',
				'check-circle': 'checkmark-circle-outline',
				'alert': 'alert',
				'alert-circle': 'alert',
				'arrow-up': 'arrow-up',
				'chevron-right': 'arrow-right',
				'chevron-left': 'arrow-back',
				'chevron-down': 'arrow-down',
				'eye': 'eye',
				'eye-off': 'eye-off',
				'menu-down': 'arrow-dropdown',
				'menu-up': 'arrow-dropup',
				'close-circle': 'close-circle-outline'
			}
		},
	}
}

export default {
	components: {
		BrandBar,
		ContactBar,
		CasaWallpaper
	},
	mixins: [mixin],
	data() {
		return {
			//isLoading: true,
			steps: [],
			noneAni: {
				classes: 'fadeIn',
				duration: 500
			},
			initAni: {
				classes: 'zoomOutIn',
				duration: 2500
			},
			brandAni: {
				classes: "fadeInLeft",
				duration: 700
			},
			contactAni: {
				classes: "fadeInRight",
				duration: 700
			},
		}
	},


	computed: {
		isLoading() {
			return this.$store.state.siteLoading
		},
		isWelcome() {
			return this.$store.state.needInitialization
		}
	},

	created() {
		console.log(`%c
_____             _____ _____
|     |___ ___ ___|     |   __|
|   --| .'|_ -| .'|  |  |__   |
|_____|__,|___|__,|_____|_____|
-- Made by IceWhale with YOU --
`, `font-family: monospace`);

		this.$buefy.config.setOptions(customIconConfig)
	},
	mounted() {
		this.setInitLang();
		window.addEventListener('resize', this.onWindowResize);
		this.onWindowResize();
	},
	methods: {
		/**
		 * @description: Get and Set default language
		 * @return {*} void
		 */
		setInitLang() {
			let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : this.getLangFromBrowser()
			lang = lang.includes("_") ? lang : "en_us";
			this.setLang(lang);
		},
		/**
		 * @description: Handle on Window reize
		 * @return {*}
		 */
		onWindowResize() {
			const isMobile = document.body.clientWidth < 480
			this.$store.commit('SET_IS_MOBILE', isMobile)
		},
	},
	sockets: {
		connect() {
			console.log('socket connected');
		},

	},
}
</script>

<style lang="scss" scoped>
#app {
	width: 100vw;
	height: 100vh;
	font-weight: 400;
	font-size: 0.875rem;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	overflow-y: hidden;

	&.is-dark-bg {
		background-color: #000;
	}
}
</style>
