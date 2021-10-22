<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:30:26
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-22 14:06:58
 * @Description: 
 * @FilePath: /CasaOS-UI/src/views/Login.vue
-->
<template>
  <div id="login-page" class="is-flex is-justify-content-center is-align-items-center">
    <div class="login-panel" v-if="!isLoading">
      <h2 class="title is-3  has-text-centered">Welcome to CasaOS</h2>
      <b-notification auto-close type="is-danger" v-model="notificationShow" aria-close-label="Close notification" role="alert">
        {{message}}
      </b-notification>
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <ValidationProvider rules="required" name="User" v-slot="{ errors, valid }">
          <b-field label="Username" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
            <b-input type="text" v-model="username" v-on:keyup.enter.native="handleSubmit(login)"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider rules="required|min:5" vid="password" name="Password" v-slot="{ errors, valid }">
          <b-field label="Password" class="mt-5" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
            <b-input type="password" v-model="password" password-reveal v-on:keyup.enter.native="handleSubmit(login)"></b-input>
          </b-field>
        </ValidationProvider>
        <b-button type="is-primary" class="mt-6" rounded expanded @click="handleSubmit(login)">Sign In</b-button>
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
      isLoading: true,
      message: "",
      notificationShow: false
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  mounted() {
    this.$api.info.guideCheck().then(res => {
      if (res.data.success == 200 && res.data.data.need_init_user) {
        this.$router.push("/welcome");
      }else{
          this.isLoading = false
      }
    })
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
          this.message = "Username or Password error!"
        }
      })

    }
  }
}
</script>

<style>
</style>