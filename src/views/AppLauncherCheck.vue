<!--
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-01-30 15:06:13
 * @FilePath: /CasaOS-UI/src/views/AppLauncherCheck.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
	<div v-if="isCheckFailed"
			 class="app-launcher-overlay is-flex is-flex-direction-column is-align-items-center is-justify-content-center is-fullheight">
		<button
			class="app-launcher-close"
			type="button"
			:aria-label="$t('Close')"
			:title="$t('Close')"
			@click="close"
		>
			<b-icon custom-size="casa-24px" icon="close-outline" pack="casa" />
		</button>
		<b-image :key="appDetailData.icon" :src="appDetailData.icon"
				 :src-fallback="require('@/assets/img/app/default.svg')"
				 class="is-64x64 icon-shadow" webp-fallback=".jpg"></b-image>
		<h2 class="has-text-emphasis-01 has-text-white mt-2">{{ appDetailData.name }}</h2>
		<h1 v-if="status === 'pending'" class="has-text-sub-03 has-text-white mt-6">{{ $t('Preparing for launch') }}
		</h1>
		<h1 v-else class="has-text-sub-03 has-text-white mt-6">{{ $t('APP may not be available') }}</h1>
		<b-image v-if="status === 'pending'" :src="require('@/assets/img/loading/waiting.svg')" alt="pending"
				 class="is-48x48 mt-6"/>
		<span v-else class="has-text-full-03 has-text-grey-600 mt-6">{{
				$t('Please')
			}}
      <a @click="openThirdApp(appDetailData);">{{ $t('Click here') }}
      </a> {{ $t('to open the app. If it does not work, please restart or try again later.') }}
    </span>
		<img :src="require('@/assets/img/logo/logo.svg')" alt="" class="is-absolute position"/>
	</div>
</template>

<script>
import business_OpenThirdApp from "@/mixins/app/Business_OpenThirdApp";
import events from '@/events/events'

export default {
	name: "AppLauncherCheck",
	mixins: [business_OpenThirdApp],
	props: {
		appDetail: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			appDetailData: {
				icon: "",
				name: ""
			},
			status: "pending",
			timer: null,
			isCheckFailed: true,
			checkCounts: 3,
			counter: 0,
			isCancelled: false,
		}
	},

	async created() {
		if (this.appDetail) {
			this.appDetailData = this.appDetail
		} else if (this.$route.query.appDetailData) {
			this.appDetailData = JSON.parse(this.$route.query.appDetailData)
		}
		await this.startContainer()
		if (this.isCancelled) return
		this.timer && clearInterval(this.timer)
		this.timer = setInterval(this.check, 1000)
		this.check()
	},
	beforeDestroy() {
		this.isCancelled = true
		this.timer && clearInterval(this.timer)
	},

	methods: {
		close() {
			this.isCancelled = true
			this.timer && clearInterval(this.timer)
			if (this.appDetail) {
				this.$EventBus.$emit(events.CLOSE_APP_IFRAME)
			} else {
				this.$router.replace({ name: 'Home' })
			}
		},
		// Get container running state
		async getContainerState() {
			try {
				let res = await this.$api.container.getState(this.appDetailData.name)
				return res.data.data
			} catch (error) {
				return {
					state: "error"
				}
			}
		},
		// Start container
		async startContainer() {
			try {
				let res = await this.$openAPI.appManagement.compose.setComposeAppStatus(this.appDetailData.name, "start")
				return res.data
			} catch (error) {
				return "error"
			}
		},
		// Check container health
		async healthCheck() {
			try {
				let res = await this.$openAPI.appManagement.compose.checkComposeAppHealthByID(this.appDetailData.name)
				return res.status === 200
			} catch (error) {
				return false
			}
		},

		async check() {
			if (this.isCancelled) return
			this.counter += 1
			const isOk = await this.healthCheck()
			if (this.isCancelled) return
			if (isOk) {
				clearInterval(this.timer)
				this.openThirdApp(this.appDetailData)
			} else if (this.counter >= this.checkCounts) {
				this.status = "reject"
				clearInterval(this.timer)
			} else {
				this.isCheckFailed = true
			}
		}
	},
}
</script>

<style lang="scss" scoped>
.app-launcher-overlay {
	position: fixed;
	inset: 0;
	z-index: 1000;
}

.is-fullheight {
	background: hsla(208, 20%, 12%, 1);
	height: 100vh;
}

.app-launcher-close {
	position: absolute;
	top: 1rem;
	right: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.25rem;
	height: 2.25rem;
	padding: 0;
	color: #fff;
	cursor: pointer;
	background: transparent;
	border: 0;
	border-radius: 0.25rem;
}

.app-launcher-close:hover,
.app-launcher-close:focus-visible {
	background: rgba(255, 255, 255, 0.12);
}

.app-launcher-close:focus {
	outline: 2px solid rgba(255, 255, 255, 0.8);
	outline-offset: 2px;
}

.position {
	left: 2rem;
	bottom: 1.25rem;
}
</style>
