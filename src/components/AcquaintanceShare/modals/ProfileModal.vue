<!--
 * @Author: JerryK
 * @Date: 2022-03-11 22:12:01
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-24 15:27:44
 * @Description: 
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-3">{{$t('Edit My Info')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <b-field class="mb-3 mt-5 has-text-light" :label="$t('My ID')" expanded>
          <b-input :value="myID" icon-right="content-copy" icon-right-clickable @icon-right-click="copyMyId" readonly></b-input>
        </b-field>
        <ValidationObserver ref="accountValid">
          <ValidationProvider rules="required" name="nickname" v-slot="{ errors, valid }">
            <b-field class="mb-3 mt-5 has-text-light" :label="$t('Nickname')" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
              <b-input v-model="nickname" :placeholder="$t('Please enter your nickname.')"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required" name="description" v-slot="{ errors, valid }">
            <b-field class="mb-3 mt-5 has-text-light" :label="$t('Description')" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
              <b-input v-model="description" :placeholder="$t('Please enter your description.')"></b-input>
            </b-field>
          </ValidationProvider>
        </ValidationObserver>
      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('OK')" type="is-primary" rounded expaned @click="saveInfo" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";
import copy from 'clipboard-copy'
export default {
  data() {
    return {
      shardId: "",
      errorType: "is-success",
      errors: "",
      nickname: "",
      description: "",
      myID: ""
    }
  },

  components: {
    ValidationObserver,
    ValidationProvider,
  },
  created() {
    this.$api.user.getUserInfo(localStorage.getItem("user_id")).then(res => {
      this.nickname = res.data.data.nick_name
      this.description = res.data.data.description
    });
    this.getMyShareId()
  },
  methods: {
    //   Get MyID
    getMyShareId() {
      this.$api.person.getMyShareId().then(res => {
        this.myID = res.data.data
      })
    },
    //   Copy MyID to clipboard
    copyMyId() {
      copy(this.myID)
      this.$buefy.toast.open({
        message: this.$t('Copied to clipboard'),
        type: 'is-success'
      })
    },
    /**
     * @description: Validate form async
     * @param {Object} ref ref of component
     * @return {Boolean} 
     */
    async checkValid(ref) {
      let isValid = await ref.validate()
      return isValid
    },

    saveInfo() {
      this.checkValid(this.$refs.accountValid).then(val => {
        if (val) {
          this.$api.user.personInfo(this.nickname, this.description).then(res => {
            let message = ""
            let type = ""
            if (res.data.success == 200) {
              message = this.$t('Update successful')
              type = "is-success"
              this.$emit('close')
            } else {
              message = this.$t('Update failed')
              type = "is-danger"
            }
            this.$buefy.toast.open({
              message: message,
              type: type
            })
          })

        }
      })
    }
  },
}
</script>

<style>
</style>