<!--
 * @Author: JerryK
 * @Date: 2022-03-11 22:12:01
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-13 13:05:37
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\AcquaintanceShare\modals\AddFriendModal.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">{{$t('Add friend')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">

        <b-field class="mb-3 mt-5 has-text-light" label="Friend ID" :type="errorType" :message="errors" expanded>
          <b-input v-model="userName" v-on:keyup.enter.native="addFriend"></b-input>
        </b-field>
      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="flex1"></div>
      <div>
        <b-button :label="$t('OK')" type="is-primary" rounded expaned @click="addFriend" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
      errorType: "is-success",
      errors: ""
    }
  },
  methods: {
    addFriend() {

    }
  },
}
</script>

<style>
</style>