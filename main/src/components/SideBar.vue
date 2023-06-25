<!--
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-01-16 17:37:48
 * @FilePath: /CasaOS-UI/src/components/SideBar.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->

<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-20 16:35:03
 * @Description:
 * @FilePath: /CasaOS-UI/src/components/SideBar.vue
-->
<template>
	<div v-if="!isLoading" :class="{ 'open': sidebarOpen }" class="side-bar contextmenu-canvas">
		<vue-custom-scrollbar :settings="scrollSettings" class="scroll-area contextmenu-canvas">
			<div v-for="(item, index) in activeApps" :key="`widgets_${index}`">
				<component :is="item.app" :class="{ 'last-block': index === activeApps.length - 1 }"></component>
			</div>
		</vue-custom-scrollbar>
		<settings v-model="widgetsSettings" :class="{ 'mt-4': activeApps.length > 0 }" class="mr-4"
				  @change="handleChange">
		</settings>
	</div>
</template>

<script>
import lowerFirst         from 'lodash/lowerFirst'
import camelCase          from 'lodash/camelCase'
import find               from 'lodash/find';
import isEqual            from 'lodash/isEqual';
import Settings           from '@/components/widgets/Settings.vue'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"

const widgetsComponents = require.context(
	'@/widgets',
	false,
	/.vue$/
)

const widgetsConfig = "widgets_config"

export default {
	name: 'side-bar',
	components: {
		Settings,
		vueCustomScrollbar
	},
	data() {
		return {
			isLoading: true,
			comps: [],
			apps: [],
			scrollSettings: {
				suppressScrollY: false,
				suppressScrollX: true,
				wheelPropagation: false
			},
			widgetsSettings: []
		}
	},
	computed: {
		activeApps() {

			const showWidgets = this.widgetsSettings.filter(item => {
				return item.show
			})
			const newArray = showWidgets.map(item => {
				const obj = find(this.apps, function (o) {
					return o.app.name == item.name;
				});
				return obj;
			})
			return newArray
		},
		sidebarOpen() {
			return this.$store.state.sidebarOpen
		},
		showWidgets() {
			return this.widgetsSettings.filter(item => {
				return item.show
			})
		}
	},
	created() {
		widgetsComponents.keys().forEach(fileName => {
			const componentName = lowerFirst(
				camelCase(
					fileName
						.split('/')
						.pop()
						.replace(/\.\w+$/, '')
				)
			)
			this.comps.push(componentName);
			this.apps.push({app: require(`@/widgets/${fileName.replace("./", "")}`).default})
		});
	},
	mounted() {
		this.getConfig();
	},

	methods: {
		/**
		 * @description: Get Widgets Configs
		 * @return {*} void
		 */
		getConfig() {
			const initData = this.getInitData();
			this.$api.users.getCustomStorage(widgetsConfig).then(res => {
				if (res.status === 200) {
					if (res.data === "") {
						this.saveData(initData);
						this.widgetsSettings = initData;
						this.isLoading = false;
					} else {
						this.diffAndCombineData(initData, res.data.data);
					}
				}
			})
		},
		diffAndCombineData(initData, remoteData) {
			let newData = initData.map(item => {
				let remoteItem = find(remoteData, el => el.name == item.name);
				if (remoteItem && item.name === remoteItem.name) {
					return {
						name: item.name,
						show: (item.show === remoteItem.show) ? item.show : remoteItem.show
					}
				} else {
					return {
						name: item.name,
						show: item.show
					}
				}
			})
			this.widgetsSettings = newData;
			if (!isEqual(newData, remoteData)) {
				this.saveData(newData);
			}
			this.isLoading = false;
		},
		/**
		 * @description: Get Local widgets datas
		 * @return {Array} array of widgets
		 */
		getInitData() {
			return this.apps.map(item => {
				return {
					name: item.app.name,
					show: item.app.initShow
				}
			})
		},

		/**
		 * @description: Save Widgets Configs
		 * @return {*} void
		 */
		saveData(data) {
			this.$api.users.setCustomStorage(widgetsConfig, data).then(res => {
				if (res.data.success == 200) {
					this.widgetsSettings = res.data.data;
				}
			})
		},

		handleChange(data) {
			this.widgetsSettings = data
			this.saveData(this.widgetsSettings)
		},

	},
}
</script>

<style lang="scss">
.side-bar {
	z-index: 10;
	margin-right: -15px;
	height: calc(100vh - 6rem);
	overflow: inherit !important;
	position: fixed;
	width: 21.25rem;

	@include until-fullhd {
		width: 18.25rem;
	}

	@include until-widescreen {
		width: 18rem;
	}

}

.scroll-area {
	position: relative;
	padding: 0 1rem 0 0;
	max-height: calc(100% - 7.5rem);
	overflow-x: inherit !important;
	overflow-y: hidden !important;
}

.ps__thumb-x,
.ps__thumb-y {
	background-color: rgba(255, 255, 255, 0.4);
	width: 8px;
	right: 5px;
}

.ps:hover > .ps__rail-x,
.ps:hover > .ps__rail-y,
.ps--focus > .ps__rail-x,
.ps--focus > .ps__rail-y,
.ps--scrolling-x > .ps__rail-x,
.ps--scrolling-y > .ps__rail-y {
	opacity: 0.6;
	width: 8px;
}

.ps .ps__rail-x:hover,
.ps .ps__rail-y:hover,
.ps .ps__rail-x:focus,
.ps .ps__rail-y:focus,
.ps .ps__rail-x.ps--clicking,
.ps .ps__rail-y.ps--clicking {
	background-color: transparent;
	opacity: 0.6;
}

.ps__rail-x:hover > .ps__thumb-x,
.ps__rail-x:focus > .ps__thumb-x,
.ps__rail-x.ps--clicking .ps__thumb-x {
	height: 8px;
}

.ps__rail-y:hover > .ps__thumb-y,
.ps__rail-y:focus > .ps__thumb-y,
.ps__rail-y.ps--clicking .ps__thumb-y {
	width: 8px;
}

@media screen and (max-width: 480px) {
	.side-bar {
		z-index: 20;
		left: 0rem;
		width: auto;
		margin: 0 0 0 1rem !important;
		transform: translateX(-100vw);
		transition: all 0.3s ease-in-out;

		&.open {
			width: calc(100% - 2rem);
			transform: translateX(0);
		}
	}

	.scroll-area {
		max-height: calc(100% - 7rem);
		height: 100% !important;
		margin-right: -1rem;
	}
}
</style>
