<template>
	<fullscreen :class="[{ 'mt-4': !fullscreen }, isVaild ? 'fdark-bg' : 'flight-bg']" :fullscreen.sync="fullscreen"
		:page-only="true" :teleport="true" class="fullScreen  pl-2 pt-2 pb-2" @change="onWindowResize">
		<a v-if="isVaild" class="fullscreen-button" @click="toggleFullScreen">
			<b-icon :icon="buttonIcon"></b-icon>
		</a>
		<div id="terminal" class="is-flex is-align-items-center is-justify-content-center">
			<div v-if="!isVaild" class="card card-shadow mb-6">
				<div class="card-content">
					<div class="content">
						<b-notification v-model="notificationShow" :closable="false" aria-close-label="Close notification"
							auto-close role="alert" type="is-danger">
							{{ $t(message) }}
						</b-notification>
						<b-field :label="$t('Username')">
							<b-input v-model="sshUser" name="username" v-on:keyup.enter.native="checkLogin"></b-input>
						</b-field>

						<b-field :label="$t('Password')">
							<b-input v-model="sshPassword" name="password" password-reveal type="password"
								v-on:keyup.enter.native="checkLogin">
							</b-input>
						</b-field>

						<b-field :label="$t('Port')">
							<b-input v-model="sshPort" name="port" type="number"
								v-on:keyup.enter.native="checkLogin"></b-input>
						</b-field>
						<div class="buttons mt-5">
							<b-button :loading="isConnecting" expanded rounded type="is-primary" @click="checkLogin">{{
								$t('Connect')
							}}
							</b-button>
						</div>
					</div>
				</div>
			</div>

			<div v-else id="xterm" :class="[fullscreen ? 'fullheight' : 'sheight']" class="xterm"></div>
		</div>
	</fullscreen>
</template>

<script>
import qs from 'qs'
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'

const fitAddon = new FitAddon();
export default {
	name: "terminal-card",
	props: {
		id: String,
		label: String,
		initWsUrl: String
	},
	data() {
		return {
			fullscreen: false,
			isConnecting: false,
			term: "",
			rows: 40,
			cols: 100,
			state: true,
			isVaild: false,
			wsUrl: "",
			sshUser: "",
			sshPassword: "",
			sshPort: 22,
			message: "",
			notificationShow: false,
		}
	},
	computed: {
		buttonSzie() {
			return this.$store.state.device == "mobile" ? 'is-small' : ''
		},
		buttonIcon() {
			return this.fullscreen ? "fullscreen-exit" : "fullscreen"
		}
	},
	mounted() {
		this.rows = document.getElementById('terminal').offsetHeight / 16 - 6;
		this.cols = document.getElementById('terminal').offsetWidth / 14;

		if (this.initWsUrl != "") {
			this.isVaild = true
			this.wsUrl = this.initWsUrl;
			this.initSocket();
		}

	},
	beforeDestroy() {
		if (this.isVaild) {
			this.socket.close()
		}
		if (this.term != "") this.term.dispose()
		window.removeEventListener('resize', this.onWindowResize)
	},

	methods: {
		async checkLogin() {
			this.$messageBus('terminallogs_connect')
			this.isConnecting = true
			let postData = {
				username: String(this.sshUser),
				password: String(this.sshPassword),
				port: String(this.sshPort)
			}
			try {
				await this.$api.sys.checkSshLogin(postData)
				this.isConnecting = false
				this.isVaild = true
				postData.token = this.$store.state.access_token
				this.wsUrl = `${this.$wsProtocol}//${this.$baseURL}/v1/sys/wsssh?${qs.stringify(postData)}`
				this.initSocket();
			} catch (error) {
				this.notificationShow = true
				this.isConnecting = false
				this.message = error.response.data.data
			}

		},
		toggleFullScreen() {
			this.fullscreen = !this.fullscreen
		},
		initTerm() {
			const term = new Terminal({
				// rendererType: 'canvas',
				fontSize: 13,
				cursorStyle: 'underline', //光标样式
				cursorBlink: true, //光标闪烁
				theme: { background: '#1E1E1E' },
				rows: parseInt(this.rows), //行数
				cols: parseInt(this.cols), // 不指定行数，自动回车后光标从下一行开始
				fontFamily: "Consolas, Monaco, monospace",
			});
			const attachAddon = new AttachAddon(this.socket);

			term.loadAddon(attachAddon);
			term.loadAddon(fitAddon);
			term.open(document.getElementById('xterm'));
			fitAddon.fit();
			term.focus();
			this.term = term
			window.addEventListener('resize', this.onWindowResize)

			this.socket.send(JSON.stringify({
				type: "resize",
				cols: this.term.cols,
				rows: this.term.rows
			}))

		},
		initSocket() {
			this.socket = new WebSocket(this.wsUrl);
			this.socketOnClose();
			this.socketOnOpen();
			this.socketOnError();

			this.socket.onmessage = (event) => {
				if (event.data == "\r\n\u001b[?2004l\rlogout\r\n") {
					this.socket.close()
					if (this.term != "") this.term.dispose()
					window.removeEventListener('resize', this.onWindowResize)
					this.isVaild = false
				}
			}
		},
		socketOnOpen() {
			this.socket.onopen = () => {
				this.initTerm()
			}
		},
		socketOnClose() {
			this.socket.onclose = () => {
				console.log('close socket')
			}
		},
		socketOnError() {
			this.socket.onerror = () => {
				console.log('socket failure')
			}
		},
		onWindowResize() {
			if (!this.isVaild) {
				return false
			}
			this.$nextTick(() => {
				try {
					fitAddon.fit();
					this.socket.send(JSON.stringify({
						type: "resize",
						cols: this.term.cols,
						rows: this.term.rows
					}))
				} catch (e) {
					console.log("e", e.message);
				}
			})

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
			}
		}
	}
}
</script>

<style lang="scss" scoped>
#terminal {
	width: 100%;
	height: 100%;
	min-height: 35rem;
	font-size: 0.75rem;

	.card {
		.card-content {
			padding: 2.5rem;
			width: 25rem;
		}

		&.card-shadow {
			box-shadow: 0px 40px 80px rgba(115, 120, 128, 0.25) !important;
			border-radius: 8px;
		}
	}
}

.xterm {
	width: 100%;

	&.fullheight {
		height: 100%;
	}

	&.sheight {
		height: 35rem;
	}
}
</style>
