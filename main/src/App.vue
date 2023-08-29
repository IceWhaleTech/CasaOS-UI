<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2022/12/1 下午7:59
  * @FilePath: /CasaOS-UI/src/App.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
	<StorageManagerPanel></StorageManagerPanel>
</template>

<script>
import {mixin}              from './mixins/mixin';
import {computed}           from 'vue'
import {ConfigProgrammatic} from 'buefy/src/index.js'
import StorageManagerPanel  from '@/components/Storage/StorageManagerPanel.vue'

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
// TODO : Prepare toekn\lang\theme\OS\isZIMA\TITLE and other config.

export default {
	components: {
		StorageManagerPanel
	},
	mixins: [mixin],
	data() {
		return {
			isZIMA: false,
			TITLE: "NAME",
			OS: "OS",
			V_ID: '!@#$%^&*()10',
		}
	},
	provide() {
		return {
			// V_ID: this.V_ID,
			isZIMA: computed(() => this.isZIMA),
			TITLE: computed(() => this.TITLE),
			OS: computed(() => this.OS),
		}
	},
	created() {
		console.log(`MicroApp is created!

┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐   ┬  ┌─┐┌─┐┌─┐┬  ┌─┐┌┬┐┌─┐┬─┐┌─┐┌─┐┌─┐  ┬ ┬┬
│  ├─┤└─┐├─┤│ │└─┐───│  │ ││  ├─┤│  └─┐ │ │ │├┬┘├─┤│ ┬├┤───│ ││
└─┘┴ ┴└─┘┴ ┴└─┘└─┘   ┴─┘└─┘└─┘┴ ┴┴─┘└─┘ ┴ └─┘┴└─┴ ┴└─┘└─┘  └─┘┴

-- Made by IceWhale with YOU --
`, `font-family: monospace`);

		// this.$buefy.config.setOptions(customIconConfig)
		ConfigProgrammatic.setOptions(customIconConfig);
	},
	mounted() {
		this.setInitLang();
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
	},
	sockets: {
		connect() {
			console.log('APP area socket connected');
		},
		"casaos-ui:topbar:dashboardsetting_language"(res) {
			this.setLang(res.Properties.casaos_lang)
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

	& .base-bar {
		position: fixed;
		bottom: 0;
		z-index: 10;
	}
}
</style>
