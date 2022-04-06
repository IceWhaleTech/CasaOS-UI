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
            <avatar :username="user.nick_name" :size="44"></avatar>
            
          </div>
          <div class="ml-2 is-flex-grow-1 has-text-left">
            <h1 class="is-size-6 title mb-0 one-line  has-text-black">{{userIntroduction}}</h1>
            <h2 class="subtitle is-7 mt-0 one-line has-text-grey">{{user.profile}}</h2>
          </div>
        </div>
        <b-field class="mb-3 mt-3 has-text-light" :type="errorType" :message="errors" expanded>
          <b-input v-model="userIntroduction" v-on:keyup.enter.native="saveIntroduction" :placeholder="$t('Please enter the remark.')"></b-input>
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
import Avatar from 'vue-avatar'
export default {
  data() {
    return {
      userIntroduction: "",
      errorType: "is-success",
      errors: ""
    }
  },
  components: {
    Avatar,
  },
  props: {
    user: {},
  },
  created() {
    this.userIntroduction = this.user.mark != "" ? this.user.mark : this.user.nick_name;
  },
  methods: {
    saveIntroduction() {
      this.$api.person.updateFriendRemarks(this.user.token, this.userIntroduction).then(res => {
        let message = ""
        let type = ""
        if (res.data.success == 200) {
          message = this.$t('Remark saved')
          type = "is-success"
          this.$emit("reloadFriendList")
          this.$emit("close")
        } else {
          message = this.$t('Remark save failed')
          type = "is-danger"
        }
        this.$buefy.toast.open({
          message: message,
          type: type
        })

      })
    }
  },
}
</script>

<style>
</style>