<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:30:26
 * @LastEditors: JerryK
 * @LastEditTime: 2022-01-28 11:24:46
 * @Description: 
 * @FilePath: /CasaOS-UI/src/views/Login.vue
-->
<template>
  <div id="login-page" class="is-flex is-justify-content-center is-align-items-center ">
    <div class="login-panel step4 is-shadow" v-if="!isLoading">
      <div class="is-flex is-justify-content-center ">
        <div class="has-text-centered">
          <b-image :src="require('@/assets/img/Account.png')" class="is-128x128" rounded></b-image>
          <p class="is-size-5 has-text-weight-bold mt-3">{{username}}</p>
        </div>

      </div>
      <b-notification auto-close type="is-danger" v-model="notificationShow" aria-close-label="Close notification" role="alert">
        {{message}}
      </b-notification>
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <!-- <ValidationProvider rules="required" name="User" v-slot="{ errors, valid }">
          <b-field label="Username" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
            <b-input type="text" v-model="username" v-on:keyup.enter.native="handleSubmit(login)"></b-input>
          </b-field>
        </ValidationProvider> -->
        <ValidationProvider rules="required|min:5" vid="password" name="Password" v-slot="{ errors, valid }">
          <b-field :label="$t('Password')" class="mt-5 has-text-light" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
            <b-input type="password" v-model="password" password-reveal v-on:keyup.enter.native="handleSubmit(login)"></b-input>
          </b-field>
        </ValidationProvider>
        <b-button type="is-primary" class="mt-5" rounded expanded @click="handleSubmit(login)">{{$t('Login')}}</b-button>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";

export default {

  name: "Login",
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      message: "",
      notificationShow: false,
      isInit: false
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  created() {
    this.isInit = !this.$store.state.needInitialization
    if (!this.isInit) {
      this.$router.push("/welcome");
    }
  },
  mounted() {
    this.$api.user.getUserInfo().then(user => {
      this.username = user.data.data.user_name;
    })
  },

  watch: {
    // Watch  System  Initialization
    '$store.state.needInitialization': {
      handler(data) {
        this.isInit = !data
        if (!this.isInit) {
          this.$router.push("/welcome");
        }
      },
      deep: true
    },
  },
  methods: {
    login() {
      this.$api.user.login({
        username: this.username,
        pwd: this.password
      }).then((res) => {
        if (res.data.success == 200) {
          localStorage.setItem("user_token", res.data.data.token)
          localStorage.setItem("version", res.data.data.version)
          this.$store.commit('setToken', res.data.data.token)
          this.$api.user.getUserInfo().then((res) => {
            if (res.data.success == 200) {
              this.$store.commit('changeUserInfo', res.data.data)
              this.$router.push('/')
            }
          })
        } else {
          this.notificationShow = true;
          this.message = this.$t("Password error!")
        }
      })

    }
  }
}
</script>

<style>
</style>