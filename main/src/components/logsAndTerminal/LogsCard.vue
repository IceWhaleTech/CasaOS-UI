<!--
 * @Author: JerryK
 * @Date: 2021-10-28 13:56:32
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-15 17:39:01
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/logsAndTerminal/LogsCard.vue
-->
<template>
	<fullscreen :class="{'mt-5':!fullscreen}" :fullscreen.sync="fullscreen" :page-only="true"
				:teleport="true" class="fullScreen  pl-2 pt-2 pb-2 fdark-bg" @change="onWindowResize">
		<a class="fullscreen-button" @click="toggleFullScreen">
			<b-icon :icon="buttonIcon"></b-icon>
		</a>
		<div id="logs" :class="[fullscreen ? 'fullheight':'sheight']" class="logs scrollbars">
			<div contenteditable v-html="data"></div>
		</div>
	</fullscreen>

</template>

<script>
export default {
	name: "logs-card",
	data() {
		return {
			fullscreen: false,
			state: true
		}
	},
	props: {
		data: String,
	},
	computed: {
		buttonSzie() {
			return this.$store.state.device == "mobile" ? 'is-small' : ''
		},
		buttonIcon() {
			return this.fullscreen ? "fullscreen-exit" : "fullscreen"
		}
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onWindowResize)
	},
	created() {
		window.addEventListener('resize', this.onWindowResize);
		this.onWindowResize();
	},
	mounted() {
		this.onWindowResize();
	},
	methods: {

		toggleFullScreen() {
			this.fullscreen = !this.fullscreen
		},
		onWindowResize() {


		},
		getTop(e) {
			var offset = e.offsetTop;
			if (e.offsetParent != null) offset += this.getTop(e.offsetParent);
			return offset;
		},
		active(state) {
			this.state = state;
			if (state) {
				this.onWindowResize();
			}
		}
	},
}
</script>

<style lang="scss" scoped>
.logs {
	white-space: pre-wrap;
	color: #fff;
	font-size: 0.875rem;
	line-height: 1.5em;
	overflow-y: auto;
	overflow-x: hidden;

	&.fullheight {
		height: 100%;
	}

	&.sheight {
		height: 35rem;
	}
}
</style>