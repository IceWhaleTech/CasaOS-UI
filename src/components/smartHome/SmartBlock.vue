<!--
 * @Author: JerryK
 * @Date: 2021-11-10 18:14:56
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-04 18:22:56
 * @Description:
 * @FilePath: /CasaOS-UI/src/components/smartHome/SmartBlock.vue
-->
<template>
  <div class="column is-half">
    <div class="common-card">
      <div class="blur-background"></div>
      <div class="wuji-content">
        <h6 class="title is-4 mb-0 has-text-white">{{ $t('Smarten up your home') }}</h6>
        <div class="is-flex is-align-items-center">
          <div class="info ">
            <div class="des two-line  is-size-14px">
              {{ $t('We want to give you a smart home experience with privacy, high speed, and localized storage.') }}
            </div>
          </div>
          <b-image :src="require('@/assets/img/smart/smart_icon.svg')" class="is-80x80"></b-image>
        </div>
        <div class="buttons">
          <b-button type="is-primary" size="is-small" @click="goToDiscord" rounded>{{ $t('In development') }}</b-button>
        </div>
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

<style>
</style>
