<template>
<div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center is-fullheight">
  <b-image :key="appDetailData.icon" :src="appDetailData.icon"
           :src-fallback="require('@/assets/img/app/default.png')" class="is-64x64 icon-shadow"
           webp-fallback=".jpg"></b-image>
  <h2 class="has-text-emphasis-01 has-text-white mt-2">{{ appDetailData.name }}</h2>
  <h1 class="has-text-sub-03 has-text-white mt-6" v-if="status === 'pending'">{{ $t('Preparing for launch') }}</h1>
  <h1 class="has-text-sub-03 has-text-white mt-6" v-else>{{ $t('APP may not be available') }}</h1>
  <b-image :src="require('@/assets/img/waiting.svg')" alt="pending" class="is-48x48 mt-6" v-if="status === 'pending'"/>
  <span class="has-text-full-03 has-text-grey-600 mt-6" v-else>{{
      $t('Please') }}
    <a @click="openThirdApp(appDetailData);">{{$t('click here')}}
    </a> {{$t('try to open the APP, if it does not work, please restart or try again later.')}}
  </span>
  <img class="is-absolute position" :src="require('@/assets/img/logo/logo.svg')" alt=""/>
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
      },
      status: "pending",
    }
  },
  mounted() {
    this.appDetailData = JSON.parse(this.$route.query.appDetailData)
    let counter = 0
    let timer = setInterval(async() => {
      counter += 1
      let isOk = await this.$api.container.containerLauncherCheck(this.appDetailData.id).then((res) => {
        return res.status === 200
      }).catch(() => {
        return false
      });
      console.log(counter)
      if(isOk){
        clearInterval(timer)
        this.openThirdApp(this.appDetailData);
      }else if(counter > 10){
        this.status = "reject"
        clearInterval(timer)
      }
    }, 1000);
  },
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