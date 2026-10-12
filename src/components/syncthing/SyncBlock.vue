<template>
	<div class="common-card">

		<div class="blur-background"></div>
		<div class="wuji-content _box is-flex is-flex-direction-column">
			<!-- Init State Start -->
			<h6 class="title is-4 mb-0 has-text-white is-flex-shrink-0">{{ $t(`Secure remote access`) }}</h6>
			<div class="is-flex is-align-items-center is-flex-grow-1 _notice-content-text">
				<div class="info ">
					<div class="des two-line is-size-14px">
						{{ $t(`Use Cloudflared to securely access your home server from anywhere.`) }}
					</div>
				</div>
				<b-image :src="require('@/assets/img/cloudflared/tunnel.svg')" class="is-80x80"></b-image>
			</div>
			<div class="buttons is-flex is-flex-shrink-0 is-flex-direction-row-reverse">
				<b-button class="mb-0" rounded size="is-small" type="is-primary" @click="openCloudflaredPanel">{{
					$t(actionText)
				}}
				</b-button>
			</div>
			<!-- Init State End -->

		</div>
	</div>
</template>

<script>
import events from '@/events/events';

export default {
	name: "cloudflared-block",
	data() {
		return {
			isLoading: false,
			isStarting: false,
			cloudflaredBaseURL: "",
			isCloudflaredInstalled: false,
			isCloudflaredRunning: false,
			cloudflaredPort: "",
			cloudflaredId: ""
		}
	},
	created() {
		this.checkCloudflaredStatus()

		this.$EventBus.$on(events.UPDATE_CLOUDFLARED_STATUS, () => {
			this.checkCloudflaredStatus();
		});

	},
	beforeDestroy() {
		this.$EventBus.$off(events.UPDATE_CLOUDFLARED_STATUS);
	},
	computed: {
		actionText() {
			return !this.isCloudflaredInstalled ? "Install" : "Open"
		}
	},

	methods: {
		async checkCloudflaredStatus() {
			const listRes = await this.$api.container.getMyAppList();
			const systemApps = listRes.data ? listRes.data.data.casaos_apps : [];
			const isDefaultCloudflaredInstalled = systemApps.some(app => {
				return app.image.includes('cloudflared') && app.port === 8080
			})
			if (isDefaultCloudflaredInstalled) {
				this.isCloudflaredInstalled = true
				this.cloudflaredBaseURL = `http://${this.$baseIp}:8080`
				this.cloudflaredPort = 8080
				this.cloudflaredId = systemApps.find(app => {
					return app.image.includes('cloudflared') && app.port === 8080
				}).id
				this.isCloudflaredRunning = systemApps.some(app => {
					return app.image.includes('cloudflared') && app.port === 8080 && app.state === 'running'
				})
			} else {
				this.isCloudflaredInstalled = systemApps.some(app => {
					return app.image.includes('cloudflared')
				})
				if (this.isCloudflaredInstalled) {
					this.isCloudflaredRunning = systemApps.some(app => {
						return app.image.includes('cloudflared') && app.state === "running"
					})
					this.cloudflaredPort = systemApps.find(app => {
						return app.image.includes('cloudflared')
					}).port
					this.cloudflaredId = systemApps.find(app => {
						return app.image.includes('cloudflared')
					}).id
					this.cloudflaredBaseURL = `http://${this.$baseIp}:${this.cloudflaredPort}`
				}
			}
		},
		async openCloudflaredPanel() {
			await this.checkCloudflaredStatus()
			if (!this.isCloudflaredInstalled) {
				this.$EventBus.$emit(events.OPEN_APP_STORE_AND_GOTO_CLOUDFLARED);
			} else {
				if (this.isCloudflaredRunning) {
					window.open(this.cloudflaredBaseURL, '_blank');
				} else {
					this.$buefy.dialog.confirm({
						title: ' ',
						message: this.$t('Cloudflared is not running, start it?'),
						hasIcon: true,
						closeOnConfirm: false,
						confirmText: this.$t('Start'),
						cancelText: this.$t('Cancel'),
						onConfirm: (value, { close }) => {
							this.$buefy.toast.open({
								message: this.$t(`Starting Cloudflared...`),
								type: 'is-white'
							})
							this.$api.container.updateState(this.cloudflaredId, "start").then((res) => {
								this.isStarting = false
								if (res.data.success == 200) {
									this.$EventBus.$emit(events.RELOAD_APP_LIST);
									setTimeout(() => {
										close()
										window.open(this.cloudflaredBaseURL, '_blank');

									}, 2000)
								} else {
									this.$buefy.toast.open({
										message: this.$t(`Failed to start, please try again.`),
										type: 'is-danger'
									})
								}
							})
						}
					})
				}
			}
		},

	},
	sockets: {
		"app:install-end"() {
			this.checkCloudflaredStatus();
		},
		"app:install-error"() {
			this.checkCloudflaredStatus();
		},
	}
}
</script>

<style lang="scss" scoped>
._box {
	height: 10rem;
	padding: 1rem 1.25rem;
	padding-top: 1.125rem;
	margin-bottom: 1rem;

	._notice-content-text {
		margin-right: 2rem;
		margin-left: 2rem;
	}
}

.des {
	line-height: 1.5em;
}
</style>
