<!--
 * @Author: JerryK
 * @Date: 2021-10-25 18:19:17
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-13 18:50:55
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/account/AccountPanel.vue
-->
<template>
  <div class="modal-card">
    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
      <!-- Modal-Card Header Start -->
      <header class="modal-card-head" :class="{'modal-card-head1':state == 1}">
        <div class="is-flex-grow-1">
          <h3 class="title is-3">{{title}}</h3>
        </div>
        <div><button type="button" class="delete" @click="$emit('close')" /></div>
      </header>
      <!-- Modal-Card Header End -->
      <!-- Modal-Card Body Start -->
      <section class="modal-card-body " :class="{'is-flex':state == 1}">
        <template v-if="state == 1">
          <div>
            <b-image :src="require('@/assets/img/account/default-avatar.svg')" class="is-128x128" rounded></b-image>
          </div>
          <div class="ml-5">
            <h2 class="title is-4">{{$t('Name')}}</h2>
            <h2 class="title is-6">{{userInfo.username}}</h2>
            <h2 class="title is-6 has-text-weight-normal"><a @click="goto(2)">{{$t('Change name')}}</a></h2>

            <h2 class="title is-4 mt-6">{{$t('Password')}}</h2>
            <h2 class="title is-6 has-text-weight-normal"><a @click="goto(3)">{{$t('Change Password')}}</a></h2>
          </div>
        </template>

        <template v-if="state == 2">
          <ValidationProvider rules="required" name="User" v-slot="{ errors, valid }">
            <b-field class="mb-5 mt-5 has-text-light" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
              <b-input type="text" v-model="user.username" v-on:keyup.enter.native="handleSubmit(saveUser)"></b-input>
            </b-field>
          </ValidationProvider>
        </template>

        <template v-if="state == 3">
          <b-notification auto-close type="is-danger" v-model="notificationShow" aria-close-label="Close notification" role="alert">
            {{message}}
          </b-notification>
          <ValidationProvider rules="required|min:5" vid="oriPassword" name="oriPassword" v-slot="{ errors, valid }">
            <b-field class="mb-5 mt-5 has-text-light" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
              <b-input type="password" :placeholder="$t('Original password')" v-model="oriPassword" password-reveal></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:5" vid="password" name="Password" v-slot="{ errors, valid }">
            <b-field class="mb-5 mt-5 has-text-light" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
              <b-input type="password" :placeholder="$t('New password')" v-model="password" password-reveal></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|confirmed:password" name="Password Confirmation" v-slot="{ errors, valid }">
            <b-field class="mt-4 mb-5" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
              <b-input type="password" :placeholder="$t('Confirm the new password again')" v-model="confirmation" password-reveal v-on:keyup.enter.native="savePassword(savePassword)"></b-input>
            </b-field>
          </ValidationProvider>
        </template>
      </section>
      <!-- Modal-Card Body End -->
      <!-- Modal-Card Footer Start-->
      <footer class="modal-card-foot is-flex is-align-items-center">
        <div class="is-flex-grow-1"></div>
        <div>
          <b-button v-if="state >= 2" :label="$t('Back')" @click="goto(1)" rounded />
          <b-button v-if="state == 2" :label="$t('Submit')" type="is-primary" rounded expaned @click="handleSubmit(saveUser)" />
          <b-button v-if="state == 3" :label="$t('Submit')" type="is-primary" rounded expaned @click="handleSubmit(savePassword)" />
        </div>
      </footer>
      <!-- Modal-Card Footer End -->
    </ValidationObserver>
    <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";
export default {
  name: "account-panel",
  data() {
    return {
      isLoading: false,
      state: 1,
      user: this.$store.state.user,
      username: this.$store.state.user.username,
      oriPassword: "",
      password: '',
      confirmation: "",
      message: "",
      notificationShow: false
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  computed: {
    title() {
      let val = ""
      switch (this.state) {
        case 1:
          val = "";
          break;
        case 2:
          val = this.$t("Change name");
          break;

        case 3:
          val = this.$t("Change Password");
          break;

        default:
          break;
      }
      return val
    },
    userInfo() {
      return this.$store.state.user;
    }
  },

  methods: {
    goto(val) {
      this.state = val
      if (val == 1) {
        this.username = this.userInfo.username;
      }
    },
    async updateUserInfo() {
      try {
        const userRes = await this.$api.users.getUserInfo()
        this.$store.commit('SET_USER', userRes.data.data);
        this.goto(1);
      } catch (error) {
        console.log(error.response.message);
      }
    },
    async saveUser() {
      this.isLoading = true;
      try {
        const res = await this.$api.users.setUserInfo(this.user)
        this.$store.commit('SET_USER', res.data.data);
        this.user = res.data.data
        this.goto(1);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },

    async savePassword() {
      this.isLoading = true;
      try {
        await this.$api.users.changePassword({
          old_password: this.oriPassword,
          password: this.password,
        })
        this.isLoading = false;
        this.goto(1);
      } catch (error) {
        this.isLoading = false;
        this.notificationShow = true;
        this.message = error.respone.data.message;
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.account-modal {
  .modal-card-head1 {
    padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  }

  .modal-card {
    width: 30rem;
  }

  .input {
    background: rgba(255, 255, 255, 0.32);
    border-color: transparent;
  }
}
</style>