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
				<div v-animate-css="s1Ani" class="is-flex is-justify-content-center">
					<b-image v-if="ZIMA" :src="require('@/assets/img/logo/zima-0.0.1-white.svg')"
							 class="is-72x72"></b-image>
					<b-image v-else :src="require('@/assets/img/logo/casa-white.svg')"
							 class="is-72x72"></b-image>
				</div>

				<h2 v-animate-css="s2Ani" class="title mt-5 has-text-centered has-text-title-03">
					{{
						$t('Welcome to {name}', {name: TITLE})
					}}
				</h2>
				<h2 v-animate-css="s3Ani" class="subtitle pt-1 mb-4 has-text-centered has-text-full-02">
					{{
						$t(`Let's create your initial account`)
					}}
				</h2>
				<b-button v-animate-css="s4Ani" class="mt-6" rounded type="is-primary" @click="goToStep(2)">{{
						$t(`Start`)
					}}
				</b-button>

				<p v-if="ZIMA" v-animate-css="s4Ani"
				   class="pt-4 has-text-centered has-text-full-03 cursor-pointer">
					<a href="https://docs.zimaboard.com/docs/Basic-functions-of-dedicated-systems" target="_blank">
						{{
							$t(`Other ways to use`)
						}}
					</a>
				</p>

			</div>

			<div v-if="step == 2">
				<div v-animate-css="s1Ani" class="is-flex is-justify-content-center">
					<div
						class="account-icon has-text-centered has-text-white is-flex is-align-items-center is-justify-content-center">
						<b-icon class="is-56" icon="posted-by" pack="casa"/>
					</div>
				</div>
				<h2 v-animate-css="s2Ani" class="title mt-3 has-text-title-03 has-text-centered">{{
						$t('Create Account')
					}}</h2>
				<ValidationObserver ref="observer" v-slot="{ handleSubmit }" class="has-text-full-03">
					<ValidationProvider v-slot="{ errors, valid }" name="User" rules="required">
						<b-field v-animate-css="s3Ani" :label="$t('Username')" :message="$t(errors)"
								 :type="{ 'is-danger': errors[0], 'is-success': valid }">
							<b-input v-model="username" class="hug" placeholder="Please input" type="text"
									 v-on:keyup.enter.native="handleSubmit(register)"></b-input>
						</b-field>
					</ValidationProvider>
					<ValidationProvider v-slot="{ errors, valid }" name="Password" rules="required|min:5"
										vid="password">
						<b-field v-animate-css="s3Ani" :label="$t('Password')" :message="$t(errors)"
								 :type="{ 'is-danger': errors[0], 'is-success': valid }"
								 class="mt-4">
							<b-input v-model="password" class="hug" password-reveal placeholder="Please input"
									 type="password"
									 v-on:keyup.enter.native="handleSubmit(register)"></b-input>
						</b-field>
					</ValidationProvider>
					<ValidationProvider v-slot="{ errors, valid }" name="Password Confirmation"
										rules="required|confirmed:password">
						<b-field v-animate-css="s3Ani" :label="$t('Confirm Password')" :message="$t(errors)"
								 :type="{ 'is-danger': errors[0], 'is-success': valid }" class="mt-4">
							<b-input v-model="confirmation" class="hug" password-reveal placeholder="Please input"
									 type="password"
									 v-on:keyup.enter.native="handleSubmit(register)"></b-input>
						</b-field>
					</ValidationProvider>
					<div v-animate-css="s4Ani" class="is-flex is-justify-content-center mt-4">
						<b-button class="mt-5" expanded rounded type="is-primary"
								  @click="handleSubmit(goToStep(3))">
							<!--								  @click="handleSubmit(register)">-->
							{{ $t('Create') }}
						</b-button>
					</div>

				</ValidationObserver>
			</div>

			<div v-if="step === 3" key="step3">
				<div v-animate-css="s1Ani" class="is-flex is-justify-content-center">
					<b-image v-if="ZIMA" :src="require('@/assets/img/logo/zima-0.0.1-white.svg')"
							 class="is-72x72"></b-image>
					<b-image v-else :src="require('@/assets/img/logo/casa-white.svg')"
							 class="is-72x72"></b-image>
				</div>
				<h2 v-animate-css="s2Ani" class="title mt-4 has-text-centered has-text-title-03">
					{{
						$t('Zima Client')
					}}
				</h2>
				<h2 v-animate-css="s3Ani" class="subtitle mt-5 mb-4 has-text-full-03">
					{{
						$t(`If you want to access remotely or sync data with your devices.`)
					}}
				</h2>
				<div v-animate-css="s3Ani" class="is-flex mt-5">
					<span class="marker">•</span>
					<span
						class="text has-text-emphasis-03">Please reinstall the software on the following supported systems</span>
				</div>
				<div v-animate-css="s3Ani" class="columns is-variable is-2 mt-1 mb-3">
					<b-image :src="require('@/assets/img/learn/guidance-MacOS-AppStore.svg')" class="column"></b-image>
					<b-image :src="require('@/assets/img/learn/guidance-Windows-AppStore.svg')"
							 class="column"></b-image>
				</div>
				<div v-animate-css="s3Ani" class="is-flex ">
					<span class="marker">•</span>
					<span
						class="text has-text-emphasis-03 mb-5">Use the remote access ID :</span>
					<b-button class="copy-board has-text-full-03" icon-pack="casa" icon-right="copy-outline"
							  @click="copy">
						{{
							V_ID
						}}
					</b-button>
				</div>
				<div v-animate-css="s3Ani" class="is-flex">
					<span class="marker">•</span>
					<span
						class="text has-text-emphasis-03">Search and connect zima in the software</span>
				</div>
				<hr v-animate-css="s3Ani"/>
				<div v-animate-css="s4Ani" class="is-flex is-justify-content-center">
					<b-button expanded rounded type="is-primary"
							  @click="goToStep(4)">
						{{ $t('Continue') }}
					</b-button>
				</div>
			</div>

			<div v-if="step == 4" key="step4">
				<div v-animate-css="s1Ani" class="is-flex is-justify-content-center">
					<b-image v-if="ZIMA" :src="require('@/assets/img/logo/zima-0.0.1-white.svg')"
							 class="is-72x72"></b-image>
					<b-image v-else :src="require('@/assets/img/logo/casa-white.svg')"
							 class="is-72x72"></b-image>
				</div>
				<h2 v-if="ZIMA" v-animate-css="s2Ani" class="title mt-4 mb-5 has-text-centered has-text-title-03">
					{{
						$t('Zima customization system')
					}}
				</h2>
				<h2 v-else v-animate-css="s2Ani" class="title mt-4 mb-5 has-text-centered has-text-title-03">
					{{
						$t('About CasaOS System')
					}}
				</h2>
				<div v-animate-css="s3Ani" class="title item-layout is-flex is-align-items-center has-text-title-06">
					<b-image :src="require('@/assets/img/app/disk_merge.svg')" class="is-24x24"></b-image>
					<p class="ml-2">
						{{ $t('Disk Merge') }}
					</p>
				</div>
				<p v-animate-css="s3Ani" class="subtitle has-text-full-03 ml-4 pl-4">
					{{ $t('Merge multiple disks into a single block.') }}
				</p>

				<div v-animate-css="s3Ani" class="title item-layout is-flex  is-align-items-center has-text-title-06">
					<b-image :src="require('@/assets/img/app/files.svg')" class="is-24x24"></b-image>
					<p class="ml-2">
						{{ $t('Files') }}
					</p>
				</div>
				<p v-animate-css="s3Ani" class="subtitle has-text-full-03 ml-4 pl-4">
					{{ $t('Manage all data in one page.') }}
				</p>

				<div v-animate-css="s3Ani" class="title item-layout is-flex  is-align-items-center has-text-title-06">
					<b-image :src="require('@/assets/img/app/appstore.svg')" class="is-24x24"></b-image>
					<p class="ml-2">
						{{ $t('APP Store') }}
					</p>
				</div>
				<p v-animate-css="s3Ani" class="subtitle has-text-full-03 ml-4 pl-4">
					{{ $t('Manage all data in one page.') }}
				</p>
				<hr v-animate-css="s3Ani"/>
				<p v-if="ZIMA" v-animate-css="s4Ani"
				   class="subtitle mb-5 pb-4 has-text-centered has-text-full-03 cursor-pointer">
					{{ $t('Please read before continuing') }}
					<a href="https://casaos.io/privacy-full.html" target="_blank">
						{{
							$t(`Privacy Policy`)
						}}
					</a>
				</p>
				<div v-else v-animate-css="s4Ani" class="is-flex is-align-items-center mb-4 pb-5">
					<b-switch v-model="isAgreeRSS" class="c-large"></b-switch>
					<span class="subtitle mt-0 mb-0 has-text-full-03">
						{{ $t('Show news feeds from casaos blog.') }}
					</span>
				</div>
				<div v-animate-css="s4Ani" class="is-flex is-justify-content-center">
					<b-button expanded rounded type="is-primary"
							  @click="complete">
						{{ $t('Start') }}
					</b-button>
				</div>


				<!--				<h2 class="title is-3  has-text-centered">{{ $t('All things done!') }}</h2>-->
				<!--				<div class="is-flex is-align-items-center is-justify-content-center">-->
				<!--					<lottie-animation :animationData="require('@/assets/ani/done.json')" :autoPlay="true" :loop="false"-->
				<!--									  class="animation" @complete="complete"></lottie-animation>-->
				<!--				</div>-->
			</div>
		</div>
	</div>
</template>

<script>
import {ValidationObserver, ValidationProvider} from "vee-validate";
import "@/plugins/vee-validate";
import smoothReflow                             from 'vue-smooth-reflow'
import axios                                    from "axios";
// import LottieAnimation                          from "lottie-web-vue";


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
				delay: 1000,
				duration: 700
			},
			s1Ani: {
				classes: 'fadeInUp',
				delay: 1300,
				duration: 700
			},
			s2Ani: {
				classes: 'fadeInUp',
				delay: 1700,
				duration: 700
			},
			s3Ani: {
				classes: 'fadeInUp',
				delay: 1900,
				duration: 700
			},
			s4Ani: {
				classes: 'fadeIn',
				delay: 2500,
				duration: 700
			},
			ZIMA: false,
			// ZIMA_NAME: '',
			TITLE: "CasaOS",
			V_ID: '!@#$%^&*()10',
			isAgreeRSS: true,
		}
	},
	// computed: {
	// 	title() {
	// 		if (this.ZIMA) {
	// 			return this.ZIMA_NAME
	// 		}
	// 		return "CasaOS"
	// 	}
	// },
	components: {
		ValidationObserver,
		ValidationProvider,
		// LottieAnimation
	},
	async beforeCreate() {
		try {
			// const {device_model, device_name} = await axios.get(`${this.$baseHostname}:9527`).then(res => res.device_model || "CasaOS")
			const {device_model = "ZimaBox", device_name} = await axios.get(`http://192.168.2.114:9527`)
			this.ZIMA = /^Zima/.test(device_model)
			// this.ZIMA_NAME = device_name
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
			if (!this.ZIMA && step === 3) {
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

.cursor-pointer {
	cursor: pointer;
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
			//background: rgba(255, 255, 255, 0.32);
			//border-color: transparent;
		}

		hr {
			height: 1px;
			//margin-bottom: 2.5rem;
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
			height: 38.8125rem;

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
				margin-top: 7px;
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

			// TODO: remove this when the switch to be component.
			&._small input[type=checkbox] {
				& + .check {
					width: 2.286em;
					height: 1.429em;
					padding: 0;

					&::before {
						width: 1.143em;
						height: 1.143em;
						margin-left: 2px;
						margin-right: 2px;
					}
				}

				&:checked + .check {
					&::before {
						transform: translate3d(80%, 0, 0);
					}
				}
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
