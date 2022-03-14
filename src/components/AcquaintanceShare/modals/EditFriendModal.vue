<!--
 * @Author: JerryK
 * @Date: 2022-03-11 22:12:51
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-13 13:04:36
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\AcquaintanceShare\modals\EditFriendModal.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">{{$t('Modify remarks')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class="is-flex is-flex-grow-1 is-align-items-center">
          <div class="avatar size-44 is-flex-shrink-0">
            <b-image :src="require('@/assets/img/avatars/1-small.png')" rounded></b-image>
          </div>
          <div class="ml-2 is-flex-grow-1 has-text-left">
            <h1 class="is-size-65 mb-0 one-line has-text-weight-medium has-text-black">Kristin Watson</h1>
          </div>
        </div>
        <b-field class="mb-3 mt-3 has-text-light" :type="errorType" :message="errors" expanded>
          <b-input v-model="userIntroduction" v-on:keyup.enter.native="saveIntroduction"
            placeholder="Please enter friend's ID to add friend to share list."></b-input>
        </b-field>
      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="flex1"></div>
      <div>
        <b-button :label="$t('OK')" type="is-primary" rounded expaned @click="saveIntroduction" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      userIntroduction: "",
      errorType: "is-success",
      errors: ""
    }
  },
  methods: {
    saveIntroduction() {

    }
  },
}
</script>

<style>
</style>