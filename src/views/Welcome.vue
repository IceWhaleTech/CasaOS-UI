<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:30:26
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-26 17:03:55
 * @Description: 
 * @FilePath: /CasaOS-UI/src/views/Welcome.vue
-->
<template>
  <div id="login-page" class="is-flex is-justify-content-center is-align-items-center">
    <div class="login-panel " v-if="!isLoading">

      <div v-if="step == 1" class="has-text-centered">
        <h2 class="title is-3  has-text-centered">Welcome to CasaOS</h2>
        <h2 class="subtitle  has-text-centered">Let's create your initial account</h2>
        <b-button type="is-primary" class="mt-2" rounded @click="goToStep(2)">Go →</b-button>
      </div>

      <div v-if="step == 2">
        <h2 class="title is-3  has-text-centered">Create Account</h2>
        <div class="is-flex is-justify-content-center ">
          <div class="has-text-centered">
            <b-image :src="require('@/assets/img/user.svg')" class="is-128x128" rounded></b-image>
          </div>
        </div>
        <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
          <ValidationProvider rules="required" name="User" v-slot="{ errors, valid }">
            <b-field label="Username" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-input type="text" v-model="username" v-on:keyup.enter.native="handleSubmit(reg)"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:5" vid="password" name="Password" v-slot="{ errors, valid }">
            <b-field label="Password" class="mt-4" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-input type="password" v-model="password" password-reveal v-on:keyup.enter.native="handleSubmit(reg)"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|confirmed:password" name="Password Confirmation" v-slot="{ errors, valid }">
            <b-field label="Confirm Password" class="mt-4" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-input type="password" v-model="confirmation" password-reveal v-on:keyup.enter.native="handleSubmit(reg)"></b-input>
            </b-field>
          </ValidationProvider>
          <b-button type="is-primary" class="mt-5" rounded expanded @click="handleSubmit(reg)">Create</b-button>
        </ValidationObserver>
      </div>

      <div v-if="step == 3" class="has-text-centered ">
        <h2 class="title is-3  has-text-centered">All things done!</h2>
        <div class="is-flex is-align-items-center is-justify-content-center">
          <lottie-animation class="animation" :animationData="require('@/assets/ani/done.json')" :autoPlay="true" :loop="false" @complete="complete"></lottie-animation>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";
import LottieAnimation from "lottie-web-vue";
export default {

  name: "Welcome",
  data() {
    return {
      step: 1,
      username: '',
      password: '',
      confirmation: "",
      isLoading: true,
      message: "",
      notificationShow: false
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    LottieAnimation
  },
  mounted() {
    this.$api.info.guideCheck().then(res => {
      if (res.data.success == 200 && !res.data.data.need_init_user) {
        this.$router.push("/login");
      } else {
        this.isLoading = false;
      }
    })
  },

  methods: {
    reg() {
      this.$api.user.createUsernameAndPaword({
        username: this.username,
        pwd: this.password
      }).then(res => {
        if (res.data.success == 200) {
          this.goToStep(3);
        }
      })
    },
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

    },
    goToStep(step) {
      this.step = step
    },
    complete() {
      this.login()
    }
  }
}
</script>

<style>
.animation {
  width: 120px;
  height: 120px;
}
</style>