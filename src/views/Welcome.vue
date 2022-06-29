<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:30:26
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-29 19:00:41
 * @Description: 
 * @FilePath: /CasaOS-UI/src/views/Welcome.vue
-->
<template>
  <div id="login-page" class="is-flex is-justify-content-center is-align-items-center">
    <div class="login-panel is-shadow" v-if="!isLoading" v-animate-css="initAni" :class="'step'+step">

      <div v-if="step == 1" class="has-text-centered">
        <div class=" is-flex is-justify-content-center" v-animate-css="s1Ani">
          <b-image :src="require('@/assets/img/logo/casa-dark.svg')" class="is-128x128 mb-4"></b-image>
        </div>

        <h2 class="title is-2 mb-5 has-text-centered" v-animate-css="s2Ani">{{$t('Welcome to CasaOS')}}</h2>
        <h2 class="subtitle  has-text-centered" v-animate-css="s3Ani">{{$t(`Let's create your initial account`)}}</h2>
        <b-button type="is-primary" class="mt-2" rounded @click="goToStep(2)" v-animate-css="s4Ani">{{$t(`Go →`)}}</b-button>
      </div>

      <div v-if="step == 2">
        <h2 class="title is-3  has-text-centered">{{$t('Create Account')}}</h2>
        <div class="is-flex is-justify-content-center ">
          <div class="has-text-centered">
            <b-image :src="require('@/assets/img/account/default-avatar.svg')" class="is-128x128" rounded></b-image>
          </div>
        </div>
        <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
          <ValidationProvider rules="required" name="User" v-slot="{ errors, valid }">
            <b-field :label="$t('Username')" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
              <b-input type="text" v-model="username" v-on:keyup.enter.native="handleSubmit(reg)"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|min:5" vid="password" name="Password" v-slot="{ errors, valid }">
            <b-field :label="$t('Password')" class="mt-4" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
              <b-input type="password" v-model="password" password-reveal v-on:keyup.enter.native="handleSubmit(reg)"></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider rules="required|confirmed:password" name="Password Confirmation" v-slot="{ errors, valid }">
            <b-field :label="$t('Confirm Password')" class="mt-4" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
              <b-input type="password" v-model="confirmation" password-reveal v-on:keyup.enter.native="handleSubmit(reg)"></b-input>
            </b-field>
          </ValidationProvider>
          <b-button type="is-primary" class="mt-5" rounded expanded @click="handleSubmit(reg)">{{$t('Create')}}</b-button>
        </ValidationObserver>
      </div>

      <div v-if="step == 3" class="has-text-centered ">
        <h2 class="title is-3  has-text-centered">{{$t('All things done!')}}</h2>
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
import smoothReflow from 'vue-smooth-reflow'
export default {

  name: "welcome-page",
  mixins: [smoothReflow],
  data() {
    return {
      step: 1,
      username: '',
      password: '',
      confirmation: "",
      isLoading: true,
      message: "",
      notificationShow: false,
      isInit: false,
      initAni: {
        classes: 'zoomIn',
        delay: 1000,
        duration: 700
      },
      s1Ani: {
        classes: 'fadeInUp',
        delay: 1300,
        duration: 700
      },
      s2Ani: {
        classes: 'fadeInUp',
        delay: 1700,
        duration: 700
      },
      s3Ani: {
        classes: 'fadeInUp',
        delay: 1900,
        duration: 700
      },
      s4Ani: {
        classes: 'fadeIn',
        delay: 2500,
        duration: 700
      }
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    LottieAnimation
  },
  created() {
    // var lang = navigator.language || navigator.userLanguage;
    this.isInit = !this.$store.state.needInitialization
    if (this.isInit) {
      this.$router.push("/login");
    }
  },
  mounted() {
    this.$smoothReflow({
      el: '.login-panel',
      property: ['height', 'width'],
    })
    this.isLoading = false;
  },
  watch: {
    // Watch  System  Initialization
    '$store.state.needInitialization': {
      handler(data) {
        this.isInit = !data
        if (this.isInit) {
          this.$router.push("/login");
        }
      },
      deep: true
    },
  },
  methods: {
    reg() {
      this.$api.user.createUsernameAndPaword({
        username: this.username,
        pwd: this.password
      }).then(res => {
        if (res.data.success == 200) {
          this.$store.commit('changeInitialization', true)
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
          localStorage.setItem("user_id", res.data.data.user.id)
          localStorage.setItem("user_token", res.data.data.token)
          localStorage.setItem("version", res.data.data.version)
          this.$store.commit('setToken', res.data.data.token)
          this.$store.commit('setToken', res.data.data.token)
          this.$store.commit('changeUserInfo', res.data.data)
          this.$router.push('/')
        } else {
          this.notificationShow = true;
          this.message = this.$t("Username or Password error!")
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

<style lang="scss">
.animation {
  width: 120px;
  height: 120px;
}
#login-page {
  height: calc(100% - 5.5rem);
  position: relative;
  z-index: 500;

  .login-panel {
    text-align: left;
    background: rgba(255, 255, 255, 0.46);
    backdrop-filter: blur(1rem);
    border-radius: 8px;
    padding: 2.5rem 4rem;

    .label {
      color: #dfdfdf;
    }

    .input {
      background: rgba(255, 255, 255, 0.32);
      border-color: transparent;
    }

    &.step1 {
      padding: 4rem 6rem;
    }

    &.step2 {
      padding: 2.5rem 4rem;
      width: 32rem;
    }

    &.step3 {
      padding: 4rem 8rem;
    }

    &.step4 {
      width: 28rem;
    }
  }
}

@media screen and (max-width: 480px) {
  .login-panel {
    text-align: left;
    background: rgba(255, 255, 255, 0.46);
    backdrop-filter: blur(1rem);
    border-radius: 8px;
    margin: 0 2rem;
    padding: 2rem !important;

    .label {
      color: #dfdfdf;
    }

    .input {
      background: rgba(255, 255, 255, 0.32);
      border-color: transparent;
    }

    .is-128x128 {
      height: 96px;
      width: 96px;
    }

    .is-3 {
      font-size: 1.5rem;
    }

    &.step1 {
      .is-2 {
        font-size: 1.5rem;
      }

      .subtitle {
        font-size: 1rem;
      }
    }

    &.step3 {
      padding: 4rem !important;
    }
  }
}
</style>