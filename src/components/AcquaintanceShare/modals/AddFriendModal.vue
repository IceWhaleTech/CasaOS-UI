<!--
 * @Author: JerryK
 * @Date: 2022-03-11 22:12:01
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-21 11:23:42
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\AcquaintanceShare\modals\AddFriendModal.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-4 has-text-weight-normal">{{$t('Send Friend Request')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <ValidationObserver ref="uuidValid" v-slot="{ addFriend }">
          <ValidationProvider rules="required|uuid" name="uuid" v-slot="{ errors, valid }">
            <b-field class="mb-3 mt-5 has-text-light" :label="$t('Friend\'s ID')" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
              <b-input v-model="shardId" v-on:keyup.enter.native="addFriend" :placeholder="$t('Please enter friend\'s Share ID.')"></b-input>
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
        <b-button :label="$t('Send Friend Request')" type="is-primary" rounded expaned @click="addFriend" :loading="isLoading" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";
export default {
  data() {
    return {
      shardId: "",
      errorType: "is-success",
      errors: "",
      isLoading: false
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  methods: {
    /**
     * @description: Validate form async
     * @param {Object} ref ref of component
     * @return {Boolean} 
     */
    async checkValid(ref) {
      let isValid = await ref.validate()
      return isValid
    },

    addFriend() {
      this.isLoading = true
      this.checkValid(this.$refs.uuidValid).then(val => {
        if (val) {
          this.$api.person.addFriend(this.shardId).then(res => {
            let message = ""
            let type = ""
            if (res.data.success == 200) {
              message = this.$t('Friend Request Sent.')
              type = "is-success"
              this.$emit("reloadFriendList")
              this.$emit('close')
            } else {
              this.isLoading = false
              message = this.shardId + " " + this.$t('is already your friend.')
              type = "is-danger"
            }
            this.$buefy.toast.open({
              message: message,
              type: type
            })
          })
        } else {
          this.isLoading = false
        }
      })
    }
  },
}
</script>

<style>
</style>