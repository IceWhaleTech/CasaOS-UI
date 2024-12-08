<template>
	<fullscreen :class="{ 'mt-4': !fullscreen }" :fullscreen.sync="fullscreen" :page-only="true" :teleport="true"
		class="fullScreen  pl-2 pt-2 pb-2 fdark-bg" @change="onWindowResize">
		<a class="fullscreen-button" @click="toggleFullScreen">
			<b-icon :icon="buttonIcon"></b-icon>
		</a>
		<div id="logs" :class="[fullscreen ? 'fullheight' : 'sheight']" class="logs scrollbars">
			<div contenteditable v-dompurify-html="data" class="content"></div>
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
			let offset = e.offsetTop;
			if (e.offsetParent != null) offset += this.getTop(e.offsetParent);
			return offset;
		},
		active(state) {
			this.state = state;
			if (state) {
				this.onWindowResize();
				this.srcollToBottom();
			}
		},
		srcollToBottom() {
			let logs = document.getElementById("logs")
			let logsConetent = document.querySelector("#logs .content");
			this.$nextTick(() => {
				logs.scrollTo(0, logsConetent.clientHeight);
			})
		}
	},
}
</script>

<style lang="scss" scoped>
.logs {
	white-space: pre-wrap;
	color: #fff;
	font-size: 13px;
	font-family: 'Monaco', 'Consolas', monospace !important;
	padding: 0 0.25rem;
	line-height: 1.5em;
	overflow-y: auto;
	overflow-x: hidden;

	>div {
		outline: none;
	}

	&.fullheight {
		height: 100%;
	}

	&.sheight {
		height: 35rem;
	}
}
</style>