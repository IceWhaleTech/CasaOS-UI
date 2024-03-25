<template>
	<div id="login-page" class="is-flex is-justify-content-center is-align-items-center ">
		<div v-if="!isLoading" class="login-panel step4 is-shadow">
			<div class="is-flex is-justify-content-center pb-3 ">
				<div class="has-text-centered">
					<b-image :src-fallback="require('@/assets/img/account/default-avatar.svg')" src="/v1/users/image?path=/var/lib/casaos/1/avatar.png" class="is-128x128" rounded></b-image>
				</div>

			</div>
			<b-notification v-model="notificationShow" aria-close-label="Close notification" auto-close role="alert"
							type="is-danger">
				{{ message }}
			</b-notification>
			<ValidationObserver ref="observer" v-slot="{ handleSubmit }">
				<ValidationProvider v-slot="{ errors, valid }" name="User" rules="required">
					<b-field :label="$t('Username')" :message="errors"
							 :type="{ 'is-danger': errors[0], 'is-success': valid }"
							 class="mt-3">
						<b-input v-model="username" :autofocus="!username" type="text" v-on:keyup.enter.native="handleSubmit(login)"></b-input>
					</b-field>
				</ValidationProvider>
				<ValidationProvider v-slot="{ errors, valid }" name="Password" rules="required|min:5" vid="password">
					<b-field :label="$t('Password')" :message="$t(errors)"
							 :type="{ 'is-danger': errors[0], 'is-success': valid }" class="mt-2">
						<b-input v-model="password" :autofocus="username" password-reveal
								 type="password" v-on:keyup.enter.native="handleSubmit(login)"></b-input>
					</b-field>
				</ValidationProvider>
				<b-button class="mt-5" expanded rounded type="is-primary" @click="handleSubmit(login)">{{ $t('Login') }}
				</b-button>
			</ValidationObserver>
		</div>
	</div>
</template>

<script>
import {ValidationObserver, ValidationProvider} from "vee-validate";
import "@/plugins/vee-validate";

export default {

	name: "login-page",
	data() {
		return {
			username: '',
			password: '',
			isLoading: false,
			message: "",
			notificationShow: false,
		}
	},
	components: {
		ValidationObserver,
		ValidationProvider,
	},
	beforeMount(){
		let userString = localStorage.getItem('user')
		if (userString) {
			let name = JSON.parse(userString).username || '';
			this.username = name;
		}
	},
	mounted() {
		document.querySelector('.modal.is-active ')?.remove();
	},

	methods: {
		async login() {
			try {
				const userRes = await this.$api.users.login(this.username, this.password)
				localStorage.setItem("access_token", userRes.data.data.token.access_token);
				localStorage.setItem("refresh_token", userRes.data.data.token.refresh_token);
				localStorage.setItem("expires_at", userRes.data.data.token.expires_at);
				localStorage.setItem("user", JSON.stringify(userRes.data.data.user));

				this.$store.commit("SET_USER", userRes.data.data.user);
				this.$store.commit("SET_ACCESS_TOKEN", userRes.data.data.token.access_token);
				this.$store.commit("SET_REFRESH_TOKEN", userRes.data.data.token.refresh_token);

				const versionRes = await this.$api.sys.getVersion();
				if (versionRes.data.success == 200) {
					localStorage.setItem("version", versionRes.data.data.current_version);
				}
				this.$router.push("/");
			} catch (err) {
				this.message = this.$t(err.response.data.message)
				this.notificationShow = true
			}
		}
	}
}
</script>

<style lang="scss">
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
</style>
