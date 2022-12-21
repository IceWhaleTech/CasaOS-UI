<template>
<div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center is-fullheight">
  <b-image :key="appDetailData.icon" :src="appDetailData.icon"
           :src-fallback="require('@/assets/img/app/default.png')" class="is-64x64 icon-shadow"
           webp-fallback=".jpg"></b-image>
  <h2 class="has-text-emphasis-01 has-text-white mt-2">{{ appDetailData.name }}</h2>
  <h1 class="has-text-sub-03 has-text-white mt-6">{{ $t('Launching the app') }}</h1>
  <b-image :src="require('@/assets/img/waiting.svg')" alt="pending" class="is-48x48 mt-6"/>
  <img class="is-absolute position" :src="require('@/assets/img/logo/logo.svg')" />
</div>
</template>

<script>
import business_OpenThirdApp from "@/mixins/app/Business_OpenThirdApp";
export default {
  name: "AppLauncherCheck",
  mixins: [business_OpenThirdApp],
  data() {
    return {
      appDetailData: {
        icon: "",
        name: ""
      }
    }
  },
  mounted() {
    this.appDetailData = this.$route.params.appDetailData
    let counter = 0
    let timer = setInterval(async() => {
      counter += counter
      let isOk = await this.launcherCheck(this.appDetailData.id);
      if(isOk){
        clearInterval(timer)
        this.openThirdApp(this.appDetailData);
      }else if(counter > 10){
        clearInterval(timer)
      }
    }, 1000);
  },
  methods:{
    async launcherCheck(containerId) {
      let a = await this.$api.container.containerLauncherCheck(containerId).then((res) => res);
      return a
    },
  }
}
</script>

<style lang="scss" scoped>
.is-fullheight{
  background: hsla(208, 20%, 12%, 1);
  height: 100vh;
}
.position{
  left: 2rem;
  bottom: 1.25rem;
}
</style>