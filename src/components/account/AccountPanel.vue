<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/1/6 下午3:03
  * @FilePath: /CasaOS-UI/src/components/account/AccountPanel.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->

<!--
 * @Author: JerryK
 * @Date: 2021-10-25 18:19:17
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-08-30 16:23:26
 * @Description:
 * @FilePath: /CasaOS-UI/src/components/account/AccountPanel.vue
-->
<template>
	<div class="modal-card">
		<ValidationObserver ref="observer" v-slot="{ handleSubmit }">
			<!-- Modal-Card Header Start -->
			<header :class="{'modal-card-head1':state == 1}" class="modal-card-head">
				<div class="is-flex-grow-1">
					<h3 class="title is-3">{{ title }}</h3>
				</div>
				<div>
					<button class="delete" type="button" @click="$emit('close')"/>
				</div>
			</header>
			<!-- Modal-Card Header End -->
			<!-- Modal-Card Body Start -->
			<section :class="{'is-flex':state == 1}" class="modal-card-body ">
				<template v-if="state == 1">
					<div>
						<b-image :src="require('@/assets/img/account/default-avatar.svg')" class="is-128x128" rounded></b-image>
					</div>
					<div class="ml-5">
						<h2 class="title is-4">{{ $t('Name') }}</h2>
						<h2 class="title is-6">{{ userInfo.username }}</h2>
						<h2 class="title is-6 has-text-weight-normal"><a @click="goto(2)">{{ $t('Change name') }}</a></h2>

						<h2 class="title is-4 mt-6">{{ $t('Password') }}</h2>
						<h2 class="title is-6 has-text-weight-normal"><a @click="goto(3)">{{ $t('Change Password') }}</a></h2>
					</div>
				</template>

				<template v-if="state == 2">
					<ValidationProvider v-slot="{ errors, valid }" name="User" rules="required">
						<b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }"
						         class="mb-5 mt-5 has-text-light">
							<b-input v-model="user.username" type="text" v-on:keyup.enter.native="handleSubmit(saveUser)"></b-input>
						</b-field>
					</ValidationProvider>
				</template>

				<template v-if="state == 3">
					<b-notification v-model="notificationShow" aria-close-label="Close notification" auto-close role="alert"
					                type="is-danger">
						{{ message }}
					</b-notification>
					<ValidationProvider v-slot="{ errors, valid }" name="oriPassword" rules="required|min:5" vid="oriPassword">
						<b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }"
						         class="mb-5 mt-5 has-text-light">
							<b-input v-model="oriPassword" :placeholder="$t('Original password')" password-reveal
							         type="password"></b-input>
						</b-field>
					</ValidationProvider>
					<ValidationProvider v-slot="{ errors, valid }" name="Password" rules="required|min:5" vid="password">
						<b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }"
						         class="mb-5 mt-5 has-text-light">
							<b-input v-model="password" :placeholder="$t('New password')" password-reveal type="password"></b-input>
						</b-field>
					</ValidationProvider>
					<ValidationProvider v-slot="{ errors, valid }" name="Password Confirmation"
					                    rules="required|confirmed:password">
						<b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }" class="mt-4 mb-5">
							<b-input v-model="confirmation" :placeholder="$t('Confirm the new password again')" password-reveal
							         type="password" v-on:keyup.enter.native="savePassword(savePassword)"></b-input>
						</b-field>
					</ValidationProvider>
				</template>
			</section>
			<!-- Modal-Card Body End -->
			<!-- Modal-Card Footer Start-->
			<footer class="modal-card-foot is-flex is-align-items-center">
				<div class="is-flex-grow-1"></div>
				<div>
					<b-button v-if="state >= 2" :label="$t('Back')" rounded @click="goto(1)"/>
					<b-button v-if="state == 2" :label="$t('Submit')" expaned rounded type="is-primary"
					          @click="handleSubmit(saveUser)"/>
					<b-button v-if="state == 3" :label="$t('Submit')" expaned rounded type="is-primary"
					          @click="handleSubmit(savePassword)"/>
				</div>
			</footer>
			<!-- Modal-Card Footer End -->
		</ValidationObserver>
		<b-loading v-model="isLoading" :is-full-page="false"></b-loading>
	</div>
</template>

<script>
import {ValidationObserver, ValidationProvider} from "vee-validate";
import "@/plugins/vee-validate";

export default {
	name: "account-panel",
	data() {
		return {
			isLoading: false,
			state: 1,
			user: this.$store.state.user,
			username: this.$store.state.user.username,
			oriPassword: "",
			password: '',
			confirmation: "",
			message: "",
			notificationShow: false
		}
	},
	components: {
		ValidationObserver,
		ValidationProvider,
	},
	computed: {
		title() {
			let val = ""
			switch (this.state) {
				case 1:
					val = "";
					break;
				case 2:
					val = this.$t("Change name");
					break;

				case 3:
					val = this.$t("Change Password");
					break;

				default:
					break;
			}
			return val
		},
		userInfo() {
			return this.$store.state.user;
		}
	},

	methods: {
		goto(val) {
			this.state = val
			if (val == 1) {
				this.username = this.userInfo.username;
			}
		},
		async updateUserInfo() {
			try {
				const userRes = await this.$api.users.getUserInfo()
				this.$store.commit('SET_USER', userRes.data.data);
				this.goto(1);
			} catch (error) {
				console.error(error.response.message);
			}
		},
		async saveUser() {
			this.isLoading = true;
			try {
				const res = await this.$api.users.setUserInfo(this.user)
				this.$store.commit('SET_USER', res.data.data);
				this.user = res.data.data
				this.goto(1);
				this.isLoading = false;
			} catch (error) {
				this.isLoading = false;
			}
		},

		async savePassword() {
			this.isLoading = true;
			try {
				await this.$api.users.changePassword({
					old_password: this.oriPassword,
					password: this.password,
				})
				this.oriPassword = "";
				this.password = "";
				this.confirmation = "";
				this.isLoading = false;
				this.goto(1);
			} catch (error) {
				this.isLoading = false;
				this.notificationShow = true;
				this.message = error.response.data.message;
			}
		}
	},
}
</script>

<style lang="scss" scoped>
.account-modal {
	.modal-card-head1 {
		padding: 1.5rem 1.5rem 0.5rem 1.5rem;
	}

	.modal-card {
		width: 30rem;
	}

	.input {
		background: rgba(255, 255, 255, 0.32);
		border-color: transparent;
	}

	.title {
		line-height: 1.5em;
	}
}
</style>
