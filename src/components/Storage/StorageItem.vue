<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/1/6 下午3:05
  * @FilePath: /CasaOS-UI/src/components/Storage/StorageItem.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->

<!--
 * @Author: JerryK
 * @Date: 2022-01-20 13:21:12
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-29 22:12:35
 * @Description:
 * @FilePath: /CasaOS-UI/src/components/Storage/StorageItem.vue
-->
<template>
	<div class="mb-5 mt-2">
		<div class="is-flex mb-2">
			<div class="header-icon">
				<b-image :src="require('@/assets/img/storage/storage.png')" class="is-64x64"></b-image>
			</div>
			<div class="ml-3 is-flex-grow-1 is-flex is-align-items-center">
				<div>
					<h4 class="title is-size-14px mb-0 has-text-left one-line">{{ item.name }}
						<b-tag v-if="item.isSystem" class="ml-2">CasaOS</b-tag>
					</h4>

					<p class="has-text-left is-size-7 has-text-grey-light	">{{ $t('Single Drive Storage') }}, <span
							class="is-uppercase">{{ item.fsType }}</span>
						<b-tooltip :label="$t('CasaOS reserves 1% of file space when creating storage in EXT4 format.')"
						           append-to-body>
							<b-icon class="mr-2 " icon="help-circle-outline" size="is-small"></b-icon>
						</b-tooltip>
					</p>
					<p class="has-text-left is-size-7 ">{{
							$t("Available Total", {
								name: item.diskName,
								avl: renderSize(item.availSize),
								total: renderSize(item.size)
							})
						}}</p>
				</div>

			</div>
			<div v-if="!item.isSystem" class="is-flex is-align-items-center b-group">
				<b-button :disabled="isRemoving" :loading="isFormating" :type="isFormating?'is-primary':''"
				          rounded size="is-small" @click="formatStorage(item.path,item.mount_point)">
					{{ $t('Format') }}
				</b-button>
				<b-button :disabled="isFormating" :loading="isRemoving" :type="isRemoving?'is-primary':''" class="ml-2"
				          rounded size="is-small" @click="removeStorage(item.disk)"> {{ $t('Remove') }}
				</b-button>
			</div>
		</div>
		<b-progress :type="item.usePercent | getProgressType" :value="item.usePercent || 0" size="is-small"></b-progress>
	</div>
</template>

<script>
import {mixin} from '@/mixins/mixin';
import delay from 'lodash/delay';
import jwt_decode from "jwt-decode";
import MD5 from 'md5-es';

export default {
	name: "drive-item",
	mixins: [mixin],
	props: {
		item: {
			type: Object,
			default: null
		},
	},
	data() {
		return {
			isFormating: false,
			isRemoving: false
		}
	},
	methods: {
		removeStorage(path) {
			this.isRemoving = true;

			this.$buefy.dialog.prompt({
				title: this.$t('Remove'),
				message: this.$t('Enter the password to continue:'),
				inputAttrs: {
					type: "password"
				},
				trapFocus: true,
				confirmText: this.$t('OK'),
				cancelText: this.$t('Cancel'),
				onCancel: () => {
					this.isRemoving = false;
				},
				onConfirm: (value) => {
					let data = {
						path: path,
						password: value
					}
					// get token from the local storage
					const token = localStorage.getItem('access_token')
					// decode the token
					const tokenJson = jwt_decode(token)
					if (MD5.hash(value) === tokenJson.password) {
						this.$api.disks.umount(data).then((res) => {
							if (res.data.success != 200) {
								this.isRemoving = false;
								this.$buefy.toast.open({
									duration: 3000,
									message: res.data.message,
									type: 'is-danger'
								})
								console.error(res);
							} else {
								this.isRemoving = false;
								let _this = this
								delay(() => {
									_this.isRemoving = false;
									_this.$emit('getDiskList');
								}, 1000);
							}
						}).catch(e => {
							this.isRemoving = false;
							this.$buefy.toast.open({
								duration: 3000,
								message: e.response.data.message,
								type: 'is-danger'
							})
							console.error(e)
						})
						return
					}
					this.isRemoving = false;
					this.$buefy.toast.open({
						duration: 3000,
						message: this.$t("Password is incorrect"),
						type: 'is-danger'
					})
					console.error("Password is incorrect")
				}
			})
		},

		formatStorage(path, mount_point) {
			this.isFormating = true;

			this.$buefy.dialog.prompt({
				title: this.$t('Format'),
				message: this.$t('Enter the password to continue:'),
				inputAttrs: {
					type: "password"
				},
				trapFocus: true,
				confirmText: this.$t('OK'),
				cancelText: this.$t('Cancel'),
				onCancel: () => {
					this.isFormating = false;
				},
				onConfirm: (value) => {
					let data = {
						path: path,
						volume: mount_point,
						password: value
					}
					// get token from the local storage
					const token = localStorage.getItem('access_token')
					// decode the token
					const tokenJson = jwt_decode(token)
					if (MD5.hash(value) === tokenJson.password) {
						this.$api.storage.format(data).then((res) => {
							if (res.data.success != 200) {
								this.isFormating = false;
								this.$buefy.toast.open({
									duration: 3000,
									message: res.data.message,
									type: 'is-danger'
								})
								console.error(res)
							} else {
								let _this = this
								delay(() => {
									_this.isFormating = false;
									_this.$emit('getDiskList');
								}, 1000);
							}
						}).catch(e => {
							this.isFormating = false;
							this.$buefy.toast.open({
								duration: 3000,
								message: e.response.data.message,
								type: 'is-danger'
							})
							console.error(e)
						})
						return
					}
					this.isFormating = false;
					this.$buefy.toast.open({
						duration: 3000,
						message: this.$t("Password is incorrect"),
						type: 'is-danger'
					})
					console.error("Password is incorrect")
				}
			})
		},

	},
}
</script>
