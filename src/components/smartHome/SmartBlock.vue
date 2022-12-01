<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2022/12/1 下午1:57
  * @FilePath: /CasaOS-UI/src/components/smartHome/SmartBlock.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
	<div class="common-card">
		<div class="blur-background"></div>
		<div class="wuji-content _box is-flex is-flex-direction-column">
			<h6 class="title is-4 mb-0 has-text-white is-flex-shrink-0">{{ $t('Smarten up your home') }}</h6>
			<div class="is-flex is-align-items-center is-flex-grow-1">
				<div class="info ">
					<div class="des two-line  is-size-14px">
						{{ $t('We want to give you a smart home experience with privacy, high speed, and localized storage.') }}
					</div>
				</div>
				<b-image :src="require('@/assets/img/smart/smart_icon.svg')" class="is-80x80"></b-image>
			</div>
			<div class="buttons is-flex is-flex-shrink-0 is-flex-direction-row-reverse">
				<b-button class="mb-0" rounded size="is-small" type="is-primary" @click="goToDiscord">{{
						$t('In development')
					}}
				</b-button>
			</div>
		</div>

	</div>
</template>

<script>
export default {
	name: "smart-block",
	methods: {
		goToDiscord() {
			this.$buefy.dialog.confirm({
				title: ' ',
				message: this.$t('Have an idea? Shoot it on Discord!'),
				hasIcon: true,
				icon: 'discord',
				confirmText: this.$t('Go'),
				cancelText: this.$t('Cancel'),
				onConfirm: () => {
					window.open('https://discord.gg/Gx4BCEtHjx', '_blank');
				}
			})
		}
	},
}
</script>

<style lang="scss" scoped>
._box {
	height: 11.5rem;
	padding: 1rem 1.25rem;
	margin-bottom: 1rem;
}
</style>
