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
		<div v-if="!isLoading" v-animate-css="initAni" :class="'step' + step" class="login-panel is-shadow">

			<div v-if="step == 1" class="has-text-centered">
				<div v-animate-css="s1Ani" class=" is-flex is-justify-content-center">
					<b-image :src="require('@/assets/img/logo/casa-dark.svg')" class="is-128x128 mb-4"></b-image>
				</div>

				<h2 v-animate-css="s2Ani" class="title is-2 mb-5 has-text-centered __attached_title">{{
						$t('Welcome to Your New Car!')
					}}</h2>
				<h2 v-animate-css="s3Ani" class="subtitle  has-text-centered __attached_sub_title">{{
						$t(`Let's create your initial account`)
					}}</h2>
				<b-button v-animate-css="s4Ani" class="mt-2" rounded type="is-primary" @click="goToStep(2)">{{
						$t(`Go →`)
					}}
				</b-button>
			</div>

			<div v-if="step == 2">
				<h2 class="title is-3  has-text-centered">{{ $t('Create Account') }}</h2>
				<div class="is-flex is-justify-content-center ">
					<div class="has-text-centered">
						<b-image :src="require('@/assets/img/account/default-avatar.svg')" class="is-128x128"
								 rounded></b-image>
					</div>
				</div>
				<ValidationObserver ref="observer" v-slot="{ handleSubmit }">
					<ValidationProvider v-slot="{ errors, valid }" name="User" rules="required">
						<b-field :label="$t('Username')" :message="$t(errors)"
								 :type="{ 'is-danger': errors[0], 'is-success': valid }">
							<b-input v-model="username" type="text"
									 v-on:keyup.enter.native="handleSubmit(register)"></b-input>
						</b-field>
					</ValidationProvider>
					<ValidationProvider v-slot="{ errors, valid }" name="Password" rules="required|min:5"
										vid="password">
						<b-field :label="$t('Password')" :message="$t(errors)"
								 :type="{ 'is-danger': errors[0], 'is-success': valid }"
								 class="mt-4">
							<b-input v-model="password" password-reveal type="password"
									 v-on:keyup.enter.native="handleSubmit(register)"></b-input>
						</b-field>
					</ValidationProvider>
					<ValidationProvider v-slot="{ errors, valid }" name="Password Confirmation"
										rules="required|confirmed:password">
						<b-field :label="$t('Confirm Password')" :message="$t(errors)"
								 :type="{ 'is-danger': errors[0], 'is-success': valid }" class="mt-4">
							<b-input v-model="confirmation" password-reveal type="password"
									 v-on:keyup.enter.native="handleSubmit(register)"></b-input>
						</b-field>
					</ValidationProvider>
					<b-button class="mt-5" expanded rounded type="is-primary" @click="handleSubmit(register)">
						{{ $t('Create') }}
					</b-button>
				</ValidationObserver>
			</div>

			<div v-if="step == 3" class="has-text-centered ">
				<h2 class="title is-3  has-text-centered">{{ $t('All things done!') }}</h2>
				<div class="is-flex is-align-items-center is-justify-content-center">
					<lottie-animation :animationData="require('@/assets/ani/done.json')" :autoPlay="true" :loop="false"
									  class="animation" @complete="complete"></lottie-animation>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {ValidationObserver, ValidationProvider} from "vee-validate";
import "@/plugins/vee-validate";
import LottieAnimation                          from "lottie-web-vue";
import smoothReflow                             from 'vue-smooth-reflow'

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
			}
		}
	},
	components: {
		ValidationObserver,
		ValidationProvider,
		LottieAnimation
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
			this.step = step
		},
		complete() {
			if (this.isLogin) {
				this.$router.push("/");
			} else {
				this.$router.push("/login");
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
		background: rgba(255, 255, 255, 0.46);
		backdrop-filter: blur(1rem);
		border-radius: 8px;
		padding: 2.5rem 4rem;

		.label {
			color: #dfdfdf;
		}

		.input {
			background: rgba(255, 255, 255, 0.32);
			border-color: transparent;
		}

		&.step1 {
			padding: 4rem 6rem;
		}

		&.step2 {
			padding: 2.5rem 4rem;
			width: 32rem;
		}

		&.step3 {
			padding: 4rem 8rem;
		}

		&.step4 {
			width: 28rem;
		}
	}
}

@media screen and (max-width: 480px) {
	.login-panel {
		text-align: left;
		background: rgba(255, 255, 255, 0.46);
		backdrop-filter: blur(1rem);
		border-radius: 8px;
		margin: 0 2rem;
		padding: 2rem !important;

		.label {
			color: #dfdfdf;
		}

		.input {
			background: rgba(255, 255, 255, 0.32);
			border-color: transparent;
		}

		.is-128x128 {
			height: 96px;
			width: 96px;
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


// Temporary
.__attached_title {
	// former color.Not in existing architecture.
	color: hsl(211, 72%, 20%, 100%);;
}

.__attached_sub_title {
	color: hsl(211, 72%, 20%, 60%);
}

.__op60 {
	opacity: 0.6;
}
</style>
