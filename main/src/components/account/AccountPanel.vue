<template>
	<div class="modal-card w-424">
		<ValidationObserver ref="observer" v-slot="{ handleSubmit }">
			<!-- Modal-Card Header Start -->
			<header class="modal-card-head">
				<div class="is-flex-grow-1">
					<h3 class="title is-header">{{ title }}</h3>
				</div>
			</header>
			<!-- Modal-Card Header End -->
			<!-- Modal-Card Body Start -->
			<section class="modal-card-body " :class="bodyPadding">
				<template v-if="state == 1">
					<div class="is-flex is-justify-content-center mb-5">
						<div class=" is-relative ">
							<div class="edit-avatar is-absolute">
								<b-icon icon="edit-outline" pack="casa" />
								<input type="file" class="file-input" accept="image/*" @change="loadImage($event)" />
							</div>
							<b-image :src="avatarUrl" :src-fallback="require('@/assets/img/account/default-avatar.svg')" class="is-80x80" rounded></b-image>
						</div>

					</div>
					<div class="mb-55">
						<div class="has-text-emphasis-04 has-text-gray-font mb-2">{{ $t('Name') }}</div>
						<div class="is-flex is-align-items-center account-item">
							<div class="has-text-emphasis-02 is-flex-grow-1">{{ userInfo.username }}</div>
							<div class="edit-button" @click.stop="goto(2);">
								<b-icon class="close-button ml-2 has-text-gray-font" icon="edit-outline" pack="casa" />
							</div>
						</div>
					</div>
					<div>
						<div class="has-text-emphasis-04 has-text-gray-font mb-2">{{ $t('Password') }}</div>
						<div class="is-flex is-align-items-center account-item">
							<div class="has-text-emphasis-02 is-flex-grow-1 has-text-gray-font">••••••</div>
							<div class="edit-button" @click.stop="goto(3);">
								<b-icon class="close-button ml-2 has-text-gray-font" icon="edit-outline" pack="casa" />
							</div>
						</div>
					</div>
				</template>

				<template v-else-if="state == 2">
					<ValidationProvider v-slot="{ errors, valid }" name="User" rules="required">
						<b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }"
							class="mb-0 has-text-light">
							<b-input v-model="user.username" type="text"
								v-on:keyup.enter.native="handleSubmit(saveUser)"></b-input>
						</b-field>
					</ValidationProvider>
				</template>

				<template v-else-if="state == 3">
					<b-notification v-model="notificationShow" aria-close-label="Close notification" auto-close role="alert"
						type="is-danger">
						{{ message }}
					</b-notification>
					<ValidationProvider v-slot="{ errors, valid }" name="oriPassword" rules="required|min:5"
						vid="oriPassword">
						<b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }"
							class="mb-5 has-text-light">
							<b-input v-model="oriPassword" :placeholder="$t('Original password')" password-reveal
								type="password"></b-input>
						</b-field>
					</ValidationProvider>
					<ValidationProvider v-slot="{ errors, valid }" name="Password" rules="required|min:5" vid="password">
						<b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }"
							class="mb-5 has-text-light">
							<b-input v-model="password" :placeholder="$t('New password')" password-reveal
								type="password"></b-input>
						</b-field>
					</ValidationProvider>
					<ValidationProvider v-slot="{ errors, valid }" name="Password Confirmation"
						rules="required|confirmed:password">
						<b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }" class="mb-0">
							<b-input v-model="confirmation" :placeholder="$t('Confirm the new password again')"
								password-reveal type="password"
								v-on:keyup.enter.native="savePassword(savePassword)"></b-input>
						</b-field>
					</ValidationProvider>
				</template>

				<template v-else-if="state == 4">
					<div class="is-flex">
						<div class="cropper-wrapper is-flex-grow-0 is-flex-shrink-0">
							<cropper :src="image.src" @change="onChange" :debounce="false" :stencil-props="stencilProps"
								check-orientation :min-height="80" :min-width="80" :canvas="canvasProps"
								:default-size="defaultSize" />
						</div>
						<div class=" is-flex is-justify-content-right is-align-items-center is-flex-grow-1">
							<div class=" has-text-centered">
								<preview :width="80" :height="80" :image="result.image" :coordinates="result.coordinates"
									class="preview" />
								<p class="has-text-emphasis-04 has-text-gray-font mt-2">Preview</p>
							</div>

						</div>
					</div>
				</template>
			</section>
			<!-- Modal-Card Body End -->
			<!-- Modal-Card Footer Start-->
			<footer class="modal-card-foot is-flex is-align-items-center" :class="buttonAlign">
				<b-button v-if="state != 1" :label="$t('Back')" rounded @click.stop="goto(1)" />
				<b-button v-if="state == 1" :label="$t('Logout')" rounded @click="logout" type="is-dark" />
				<b-button v-else-if="state == 2" :label="$t('Submit')" expaned rounded type="is-dark"
					@click="handleSubmit(saveUser)" />
				<b-button v-else-if="state == 3" :label="$t('Submit')" expaned rounded type="is-dark"
					@click="handleSubmit(savePassword)" />
				<b-button v-else-if="state == 4" :label="$t('Submit')" expaned rounded type="is-dark"
					@click="handleSubmit(saveAvatar)" />

			</footer>
			<!-- Modal-Card Footer End -->
		</ValidationObserver>
		<b-loading v-model="isLoading" :is-full-page="false"></b-loading>
	</div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";
import { Cropper, Preview, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';
function getMimeType(file, fallback = null) {
	const byteArray = (new Uint8Array(file)).subarray(0, 4);
	let header = '';
	for (let i = 0; i < byteArray.length; i++) {
		header += byteArray[i].toString(16);
	}
	switch (header) {
		case "89504e47":
			return "image/png";
		case "47494638":
			return "image/gif";
		case "ffd8ffe0":
		case "ffd8ffe1":
		case "ffd8ffe2":
		case "ffd8ffe3":
		case "ffd8ffe8":
			return "image/jpeg";
		default:
			return fallback;
	}
}

const avatarUrlPrefix = "v1/users/avatar?token=";

export default {
	name: "account-panel",
	data() {
		return {
			isLoading: false,
			state: 1,
			user: this.$store.state.user,
			username: this.$store.state.user.username,
			avatarUrl: `${avatarUrlPrefix}${this.$store.state.token || localStorage.getItem("access_token")}`,
			oriPassword: "",
			password: '',
			confirmation: "",
			message: "",
			notificationShow: false,
			image: {
				src: null,
				type: null
			},
			result: {
				coordinates: null,
				image: null,
				canvas: null
			},
			stencilProps: {
				aspectRatio: 1,
			},
			canvasProps: {
				height: 160,
				width: 160
			}
		}
	},
	components: {
		ValidationObserver,
		ValidationProvider,
		Cropper,
		Preview,
		CircleStencil
	},
	computed: {
		title() {
			let val = ""
			switch (this.state) {
				case 1:
					val = this.$t("Account");
					break;
				case 2:
					val = this.$t("Change name");
					break;

				case 3:
					val = this.$t("Change Password");
					break;
				case 4:
					val = this.$t("Change Avatar");
					break;
				default:
					break;
			}
			return val
		},
		userInfo() {
			return this.$store.state.user;
		},
		bodyPadding() {
			return this.state == 1 || this.state == 4 ? "px-40 py-24" : ""
		},
		buttonAlign() {
			return this.state == 1 ? "is-justify-content-center" : "is-justify-content-end"
		}
	},

	methods: {
		goto(val) {
			this.state = val
			if (val == 1) {
				if (this.image.src) {
					URL.revokeObjectURL(this.image.src)
				}
				this.oriPassword = "";
				this.password = "";
				this.confirmation = "";
				this.username = this.userInfo.username;
			}
		},
		onChange({ coordinates, image, canvas }) {
			this.result = {
				coordinates,
				image,
				canvas
			};
		},
		loadImage(event) {
			const { files } = event.target;
			if (files && files[0]) {
				if (this.image.src) {
					URL.revokeObjectURL(this.image.src)
				}
				const blob = URL.createObjectURL(files[0]);
				const reader = new FileReader();
				reader.onload = (e) => {
					this.image = {
						src: blob,
						type: getMimeType(e.target.result, files[0].type),
					};
					this.goto(4);
				};
				reader.readAsArrayBuffer(files[0]);
			}
		},
		defaultSize({ imageSize, visibleArea }) {
			return {
				width: (visibleArea || imageSize).width,
				height: (visibleArea || imageSize).height,
			};
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
		},

		async saveAvatar() {
			this.isLoading = true;
			const imageData = this.result.canvas.toDataURL();
			this.$api.users.saveAvatar({ file: imageData }).then(() => {
				this.$buefy.toast.open({
					message: this.$t(`Update successful`),
					type: 'is-success'
				})
				this.isLoading = false;
				this.state = 1;
			}).catch(() => {
				this.$buefy.toast.open({
					message: this.$t(`Update failure`),
					type: 'is-danger'
				})
				this.isLoading = false;
			})
		},
		logout() {
			this.$messageBus('account_setting_logout')
			this.$store.commit('SET_DEFAULT_WALLPAPER')
			this.$router.push("/logout");
		},
	},
	destroyed() {
		if (this.image.src) {
			URL.revokeObjectURL(this.image.src)
		}
	}
}
</script>

<style lang="scss" scoped>
.modal-card {
	@include mobile {
		margin: 0 !important;

		&.w-424 {
			width: auto !important;
		}
	}
}

.account-item {
	cursor: pointer;

	.edit-button {
		transition: all 0.3s;
		opacity: 0;
		visibility: hidden;
	}

	&:hover {
		.edit-button {
			opacity: 1;
			visibility: visible;
		}
	}
}

.edit-avatar {
	cursor: pointer;
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background-color: rgba(0, 0, 0, 0.5);
	transition: all 0.3s;
	z-index: 10;
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0;

	.file-input {
		width: 100%;
		height: 100%;
		opacity: 0;
		border-radius: 50%;
		cursor: pointer;
	}

	.icon {
		pointer-events: none;
		color: #fff !important;
	}

	&:hover {
		opacity: 1;
	}
}

.cropper-wrapper {
	width: 220px;
	height: 220px;
	overflow: hidden;
	position: relative;
	background-color: rgba(0, 0, 0, 0.2);
	display: flex;
	justify-content: center;
	align-items: center;
}

.preview {
	border-radius: 50%;
}

.vue-advanced-cropper {
	::v-deep img {
		max-height: none !important;
	}
}

::v-deep .vue-preview__image {
	max-height: none !important;
}

::v-deep .vue-simple-handler-wrapper {
	width: 18px !important;
	height: 18px !important;
}
</style>
