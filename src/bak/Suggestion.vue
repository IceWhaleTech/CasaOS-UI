<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-17 00:33:01
 * @Description: 
 * @FilePath: \CasaOS-UI\src\bak\Suggestion.vue
-->
<template>
  <div class=" home-section has-text-left ">
    <h1 class="title is-4 mt-6 has-text-white">Recommended</h1>
    <div class="columns is-variable is-2 is-multiline suggestion-list">

      <template v-if="!isLoading">
        <div class="column is-one-third" v-for="(item,index) in list" :key="'ss'+index">
          <a :href="item.url" target="_blank">
            <div class="wuji-card is-flex is-align-items-center">
              <div class="info ">
                <div class="two-line ">
                  {{item.title}}
                </div>
                <div class="des two-line">
                  {{item.content}}
                </div>
              </div>

              <figure class="image is-48x48 simg is-flex">
                <img :src="item.image_url">
              </figure>
            </div>
          </a>
        </div>
      </template>

      <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
    </div>
  </div>

</template>

<script>
export default {
  name: 'suggestion-section',
  data() {
    return {
      isLoading: true,
      list: []
    }
  },
  mounted() {
    this.$api.task.list().then(res => {
      if (res.data.success == 200) {
        this.list = res.data.data;
        this.isLoading = false
      }
    })
  },
}
</script>

<style>
</style>