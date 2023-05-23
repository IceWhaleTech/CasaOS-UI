<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2022/12/1 下午8:02
  * @FilePath: /CasaOS-UI/src/views/Welcome.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->

<template>
	<div id="login-page" class="is-flex is-justify-content-center is-align-items-center">
		<div v-if="!isLoading" v-animate-css="initAni" :class="'step' + step" class="login-panel c-dark">

			<div v-if="step == 1" class="has-text-centered">
				<div v-animate-css="initS1Ani" class="is-flex is-justify-content-center">
					<b-image v-if="isZIMA" :src="require('@/assets/img/logo/zima-0.0.1-white.svg')"
							 class="is-72x72"></b-image>
					<b-image v-else :src="require('@/assets/img/logo/casa-white.svg')"
							 class="is-72x72"></b-image>
				</div>

				<h2 v-animate-css="initS2Ani" class="title mt-5 has-text-centered has-text-title-03">
					{{
						$t('Welcome to {name}', {name: TITLE})
					}}
				</h2>
				<h2 v-animate-css="initS3Ani" class="subtitle pt-1 mb-4 has-text-centered has-text-full-02">
					{{
						$t(`Let's create your initial account`)
					}}
				</h2>
				<b-button v-animate-css="initS4Ani" class="mt-6" rounded type="is-primary" @click="goToStep(2)">{{
						$t(`Start`)
					}}
				</b-button>

				<p v-if="isZIMA" v-animate-css="initS4Ani"
				   class="pt-4 has-text-centered has-text-full-03 cursor-pointer">
					<a href="https://docs.zimaboard.com/docs/Basic-functions-of-dedicated-systems" target="_blank">
						{{
							$t(`Other ways to use`)
						}}
					</a>
				</p>

			</div>

			<div v-if="step == 2" v-animate-css="s0Ani">
				<div class="is-flex is-justify-content-center">
					<div
						class="account-icon has-text-centered has-text-white is-flex is-align-items-center is-justify-content-center">
						<b-icon class="is-56" icon="posted-by" pack="casa"/>
					</div>
				</div>
				<h2 class="title mt-3 has-text-title-03 has-text-centered">{{
						$t('Create Account')
					}}</h2>
				<ValidationObserver ref="observer" v-slot="{ handleSubmit }" class="has-text-full-03">
					<ValidationProvider v-slot="{ errors, valid }" name="User" rules="required">
						<b-field :label="$t('Username')" :message="$t(errors)"
								 :type="{ 'is-danger': errors[0], 'is-success': valid }">
							<b-input v-model="username" autofocus class="hug" type="text"
									 v-on:keyup.enter.native="handleSubmit(register)"></b-input>
						</b-field>
					</ValidationProvider>
					<ValidationProvider v-slot="{ errors, valid }" name="Password" rules="required|min:5"
										vid="password">
						<b-field :label="$t('Password')" :message="$t(errors)"
								 :type="{ 'is-danger': errors[0], 'is-success': valid }"
								 class="mt-4">
							<b-input v-model="password" class="hug" password-reveal
									 type="password"
									 v-on:keyup.enter.native="handleSubmit(register)"></b-input>
						</b-field>
					</ValidationProvider>
					<ValidationProvider v-slot="{ errors, valid }" name="Password Confirmation"
										rules="required|confirmed:password">
						<b-field :label="$t('Confirm Password')" :message="$t(errors)"
								 :type="{ 'is-danger': errors[0], 'is-success': valid }" class="mt-4">
							<b-input v-model="confirmation" class="hug" password-reveal
									 type="password"
									 v-on:keyup.enter.native="handleSubmit(register)"></b-input>
						</b-field>
					</ValidationProvider>
					<div class="is-flex is-justify-content-center mt-4">
						<b-button class="mt-5" expanded rounded type="is-primary"
								  @click="handleSubmit(register)">
							{{ $t('Create') }}
						</b-button>
					</div>

				</ValidationObserver>
			</div>

			<div v-if="step === 3" key="step3" v-animate-css="s0Ani">
				<div class="is-flex is-justify-content-center">
					<b-image v-if="isZIMA" :src="require('@/assets/img/logo/zima-0.0.1-white.svg')"
							 class="is-72x72"></b-image>
					<b-image v-else :src="require('@/assets/img/logo/casa-white.svg')"
							 class="is-72x72"></b-image>
				</div>
				<h2 class="title mt-4 has-text-centered has-text-title-03">
					{{
						$t('Zima Client')
					}}
				</h2>
				<h2 class="subtitle mt-5 mb-4 has-text-full-03">
					{{
						$t(`If you want to access remotely or sync data with your devices.`)
					}}
				</h2>
				<div class="is-flex is-align-items-center mt-5">
					<span class="marker">•</span>
					<span
						class="text has-text-emphasis-03">{{ $t('Install the software.') }}</span>
				</div>
				<div class="is-flex columns is-variable is-2 mt-1 mb-3">
					<b-image :src="require('@/assets/img/learn/guidance-MacOS-AppStore.svg')" class="column"></b-image>
					<b-image :src="require('@/assets/img/learn/guidance-Windows-AppStore.svg')"
							 class="column"></b-image>
				</div>
				<div class="is-flex is-align-items-center mb-5">
					<div class="marker" style="">•</div>
					<span
						class="text has-text-emphasis-03">{{ $t('Using the Network ID :') }}</span>
					<b-button class="copy-board has-text-full-03" icon-pack="casa" icon-right="copy-outline"
							  @click="copy">
						{{
							V_ID
						}}
					</b-button>
				</div>
				<div class="is-flex is-align-items-center">
					<span class="marker">•</span>
					<span
						class="text has-text-emphasis-03">{{ $t('Connect Zima in the software.') }}</span>
				</div>
				<hr v-animate-css="s3Ani"/>
				<div class="is-flex is-justify-content-center">
					<b-button expanded rounded type="is-primary"
							  @click="goToStep(4)">
						{{ $t('Continue') }}
					</b-button>
				</div>
			</div>

			<div v-if="step == 4" key="step4" v-animate-css="s0Ani">
				<div class="is-flex is-justify-content-center">
					<b-image v-if="isZIMA" :src="require('@/assets/img/logo/zima-0.0.1-white.svg')"
							 class="is-72x72"></b-image>
					<b-image v-else :src="require('@/assets/img/logo/casa-white.svg')"
							 class="is-72x72"></b-image>
				</div>
				<h2 v-if="isZIMA" class="title mt-4 mb-5 has-text-centered has-text-title-03">
					{{
						$t('Zima customization system')
					}}
				</h2>
				<h2 v-else class="title mt-4 mb-5 has-text-centered has-text-title-03">
					{{
						$t('About CasaOS System')
					}}
				</h2>
				<div class="title item-layout is-flex is-align-items-center has-text-title-06">
					<b-image :src="require('@/assets/img/app/disk_merge.svg')" class="is-24x24"></b-image>
					<p class="ml-2">
						{{ $t('Storage Merge') }}
					</p>
				</div>
				<p class="subtitle has-text-full-03 ml-4 pl-4">
					{{ $t('Merge multiple disks into one.') }}
				</p>

				<div class="title item-layout is-flex  is-align-items-center has-text-title-06">
					<b-image :src="require('@/assets/img/app/files.svg')" class="is-24x24"></b-image>
					<p class="ml-2">
						{{ $t('Files') }}
					</p>
				</div>
				<p class="subtitle has-text-full-03 ml-4 pl-4">
					{{ $t('Manage all data in one page.') }}
				</p>

				<div class="title item-layout is-flex  is-align-items-center has-text-title-06">
					<b-image :src="require('@/assets/img/app/appstore.svg')" class="is-24x24"></b-image>
					<p class="ml-2">
						{{ $t('APP Store') }}
					</p>
				</div>
				<p class="subtitle has-text-full-03 ml-4 pl-4">
					{{ $t('Over 40 applications installed with one click.') }}
				</p>
				<hr v-animate-css="s3Ani"/>
				<p v-if="isZIMA" v-animate-css="s4Ani"
				   class="subtitle mb-5 pb-4 has-text-centered has-text-full-03">
					{{ $t('Please read before continuing ') }}
					<a class="" href="https://casaos.io/privacy-full.html" target="_blank">
						{{
							$t(`Privacy Policy`)
						}}
					</a>
				</p>
				<div v-else class="is-flex is-align-items-center mb-4 pb-5">
					<b-switch v-model="isAgreeRSS" class="c-large"></b-switch>
					<span class="subtitle mt-0 mb-0 has-text-full-03">
						{{ $t('Show news feed from CasaOS blog.') }}
					</span>
				</div>
				<div class="is-flex is-justify-content-center">
					<b-button expanded rounded type="is-primary"
							  @click="complete">
						{{ $t('Start') }}
					</b-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {ValidationObserver, ValidationProvider} from "vee-validate";
import "@/plugins/vee-validate";
import smoothReflow                             from 'vue-smooth-reflow'
import axios                                    from "axios";


export default {

	name: "welcome-page",
	mixins: [smoothReflow],
	data() {
		return {
			step: 1,
			username: '',
			password: '',
			confirmation: "",
			isLoading: true,
			isLogin: false,
			message: "",
			notificationShow: false,
			initAni: {
				classes: 'zoomIn',
				delay: 500,
				duration: 700
			},
			initS1Ani: {
				classes: 'fadeInUp',
				delay: 750,
				duration: 700
			},
			initS2Ani: {
				classes: 'fadeInUp',
				delay: 1150,
				duration: 700
			},
			initS3Ani: {
				classes: 'fadeInUp',
				delay: 1300,
				duration: 700
			},
			initS4Ani: {
				classes: 'fadeIn',
				delay: 1400,
				duration: 700
			},
			s0Ani: {
				classes: 'fadeIn',
				delay: 300,
				duration: 500
			},
			isZIMA: false,
			TITLE: "CasaOS",
			V_ID: '!@#$%^&*()10',
			isAgreeRSS: true,
		}
	},
	components: {
		ValidationObserver,
		ValidationProvider,
	},
	async beforeCreate() {
		try {
			const {
				device_model,
				device_name
			} = await axios.get(`${this.$baseHostname}:9527`).then(res => res.device_model || "CasaOS")
			// const {device_model = "ZimaBox", device_name} = await axios.get(`http://192.168.2.114:9527`)
			this.isZIMA = /^Zima/.test(device_model)
			this.TITLE = device_model
		} catch (e) {
			console.error("GETTING THE CONFIG OF YOUR MACHINE IS EXPERIENCING AN ERROR:", e)
		}
	},
	created() {
		this.path = '@/assets/img/logo/zima-0.0.1-white.svg'
	},

	mounted() {
		this.$smoothReflow({
			el: '.login-panel',
			property: ['height', 'width'],
		})
		this.isLoading = false;

	},

	methods: {
		/**
		 * @description: register
		 * @return {*}
		 */
		register() {
			const initKey = this.$store.state.initKey;
			this.$api.users.register(this.username, this.password, initKey).then(res => {
				if (res.data.success == 200) {
					this.login().then(() => {
						// First login set default app order
						this.$api.users.setCustomStorage("app_order", {data: ["App Store", "Files"]})
					});
					this.goToStep(3);
				}
			}).catch(err => {
				this.$buefy.toast.open({
					message: err.response.data.message,
					type: 'is-danger',
					position: 'is-top',
					duration: 5000,
					queue: false
				})
			})
		},

		/**
		 * @description: login
		 * @return {*}
		 */
		async login() {
			const userRes = await this.$api.users.login(this.username, this.password)
			if (userRes.data.success == 200) {
				localStorage.setItem("access_token", userRes.data.data.token.access_token);
				localStorage.setItem("refresh_token", userRes.data.data.token.refresh_token);
				localStorage.setItem("expires_at", userRes.data.data.token.expires_at);
				localStorage.setItem("user", JSON.stringify(userRes.data.data.user));

				this.$store.commit("SET_NEED_INITIALIZATION", false);
				this.$store.commit("SET_INIT_KEY", "");
				this.$store.commit("SET_USER", userRes.data.data.user);
				this.$store.commit("SET_ACCESS_TOKEN", userRes.data.data.token.access_token);
				this.$store.commit("SET_REFRESH_TOKEN", userRes.data.data.token.refresh_token);

				const versionRes = await this.$api.sys.getVersion();
				if (versionRes.data.success == 200) {
					localStorage.setItem("version", versionRes.data.data.current_version);
				}
				sessionStorage.setItem("fromWelcome", true);
				this.isLogin = true

			} else {
				this.isLogin = false
				this.message = this.$t("Username or Password error!")
				this.notificationShow = true
			}
		},
		goToStep(step) {
			if (!this.isZIMA && step === 3) {
				this.step = 4
			}
			this.step = step
		},
		complete() {
			this.$store.commit('SET_RSS_SWITCH', this.isAgreeRSS)
			if (this.isLogin) {
				this.$router.push("/");
			} else {
				this.$router.push("/login");
			}
		},
		async copy(e) {
			try {
				await navigator.clipboard.writeText(this.V_ID);
				this.$buefy.notification.open('Copy complete!')
			} catch (err) {
				console.error('Failed to copy: ', err);
			}

		}
	}
}
</script>

<style lang="scss">
.animation {
	width: 120px;
	height: 120px;
}

#login-page {
	height: calc(100% - 5.5rem);
	position: relative;
	z-index: 500;

	.login-panel {
		text-align: left;
		background: rgba(90, 108, 124, 0.3);
		backdrop-filter: blur(0.75rem);
		border-radius: 12px;
		padding: 3.75rem 3rem;

		.label {
			color: #dfdfdf;
		}

		.input {
		}

		hr {
			height: 1px;
			background-color: hsla(208, 16%, 94%, 0.2);
		}

		a {
			color: hsla(208, 100%, 53%, 1);

			&:hover {
				color: hsla(208, 100%, 53%, 0.8);
				text-decoration: underline;
			}
		}

		button {
			height: 2.25rem;
			width: 10rem;
			background-color: hsla(208, 100%, 45%, 1);


			&:active {
				background-color: hsla(208, 100%, 32%, 1);
			}

			&:focus {
				background-color: hsla(208, 100%, 45%, 1);
				outline: 2px solid hsla(208, 100%, 45%, 0.24);
			}

			&:hover {
				background-color: hsla(208, 100%, 38%, 1);
			}
		}

		&.step1 {
			width: 22.5rem;

			.title {
				color: hsla(208, 16%, 98%, 1);
			}

			.subtitle {
				color: hsla(208, 16%, 72%, 1);
			}
		}

		&.step2 {
			padding: 3rem 3rem 3.75rem 3rem;
			width: 22.5rem;

			.account-icon {
				background: hsla(210, 16%, 85%, 0.3);
				backdrop-filter: blur(0.75rem);
				border-radius: 2.5rem;
				height: 5rem;
				width: 5rem;
			}

			.title {
				color: hsla(208, 16%, 98%, 1);
			}

			span .field .label {
				margin-bottom: 0.5rem;
			}
		}

		&.step3 {
			padding: 3.75rem 3rem 3.75rem 3rem;
			width: 26.5rem;
			height: 36.8125rem;

			.title {
				color: hsla(208, 16%, 98%, 1);
			}

			.subtitle {
				color: hsla(208, 16%, 72%, 1);
			}

			.text {
				color: hsla(208, 16%, 98%, 1);
			}

			.marker {
				display: inline-block;
				width: 6px;
				height: 6px;
				margin-right: 8px;
				background-color: hsla(208, 16%, 98%, 1);
				border-radius: 50%;
				font-size: 1px;
				line-height: 1;
				text-align: center;
			}

			.copy-board {
				margin-left: 0.5rem;
				padding: 0;
				border: 0;
				border-radius: 3px;
				height: 1.5rem;
				width: 113px;
				color: hsla(0, 0%, 100%, 1);
				background-color: hsla(208, 14%, 58%, 1);

				.icon {
					border-radius: 0 3px 3px 0;
					height: 100%;
					width: 1.5rem;
					background-color: hsla(208, 100%, 45%, 1);

					i {
						height: 1rem;
						width: 1rem;
						font-size: 1rem;
					}
				}
			}
		}

		&.step4 {
			padding: 3.75rem 3rem 3.75rem 3rem;
			width: 26.5rem;

			.title {
				color: hsla(208, 16%, 98%, 1);
			}

			.subtitle {
				color: hsla(208, 16%, 72%, 1);
				margin-top: 2px;
				margin-bottom: 1.25rem;
			}

			.item-layout {
				margin-top: 1.25rem;
				margin-bottom: 0;
			}
		}
	}
}

@media screen and (max-width: 480px) {
	.login-panel {
		text-align: left;
		background: rgba(90, 108, 124, 0.3);
		backdrop-filter: blur(0.75rem);
		border-radius: 12px;
		padding: 3.75rem 3rem;
		margin: 0 2rem;

		.label {
			color: #dfdfdf;
		}

		.input {
			background: rgba(255, 255, 255, 0.32);
			border-color: transparent;
		}

		.is-3 {
			font-size: 1.5rem;
		}

		&.step1 {
			.is-2 {
				font-size: 1.5rem;
			}

			.subtitle {
				font-size: 1rem;
			}
		}

		&.step3 {
			padding: 4rem !important;
		}
	}
}
</style>
