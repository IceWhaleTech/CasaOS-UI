<template>
  <div id="login-page" class="flex items-center justify-center h-dvh w-full relative z-[500]">
    <div v-if="!isLoading" class="login-panel is-shadow p-8 rounded-lg backdrop-blur-lg w-96 bg-white/45">
      <div class="is-flex is-justify-content-center pb-3 ">
        <div class="has-text-centered">
          <b-image :src-fallback="require('@/assets/img/account/default-avatar.svg')" src="/v1/users/image?path=/var/lib/casaos/1/avatar.png" class="is-128x128" rounded></b-image>
        </div>
      </div>
      <b-notification v-model="notificationShow" aria-close-label="Close notification" auto-close role="alert" type="is-danger">
        {{ message }}
      </b-notification>
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <ValidationProvider v-slot="{ errors, valid }" name="User" rules="required">
          <b-field :label="$t('Username')" :message="errors" :type="{ 'is-danger': errors[0], 'is-success': valid }" class="mt-3 ">
            <b-input v-model="username" :autofocus="!username" type="text" v-on:keyup.enter.native="handleSubmit(login)"></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors, valid }" name="Password" rules="required|min:5" vid="password">
          <b-field :label="$t('Password')" :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }" class="mt-2">
            <b-input v-model="password" :autofocus="username" password-reveal type="password" v-on:keyup.enter.native="handleSubmit(login)"></b-input>
          </b-field>
        </ValidationProvider>
        <b-button class="mt-5" expanded rounded type="is-primary" @click="handleSubmit(login)">{{ $t("Login") }}</b-button>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";

export default {
  name: "login-page",
  data() {
    return {
      username: "",
      password: "",
      isLoading: false,
      message: "",
      notificationShow: false,
    };
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  beforeMount() {
    let userString = localStorage.getItem("user");
    if (userString) {
      let name = JSON.parse(userString).username || "";
      this.username = name;
    }
  },
  mounted() {
    document.querySelector(".modal.is-active ")?.remove();
  },

  methods: {
    async login() {
      try {
        const userRes = await this.$api.users.login(this.username, this.password);
        localStorage.setItem("access_token", userRes.data.data.token.access_token);
        localStorage.setItem("refresh_token", userRes.data.data.token.refresh_token);
        localStorage.setItem("expires_at", userRes.data.data.token.expires_at);
        localStorage.setItem("user", JSON.stringify(userRes.data.data.user));

        this.$store.commit("SET_USER", userRes.data.data.user);
        this.$store.commit("SET_ACCESS_TOKEN", userRes.data.data.token.access_token);
        this.$store.commit("SET_REFRESH_TOKEN", userRes.data.data.token.refresh_token);

        const versionRes = await this.$api.sys.getVersion();
        if (versionRes.data.success == 200) {
          localStorage.setItem("version", versionRes.data.data.current_version);
        }
        this.$router.push("/");
      } catch (err) {
        this.message = this.$t(err.response.data.message);
        this.notificationShow = true;
      }
    },
  },
};
</script>

<style lang="scss" >
#login-page {
	.login-panel {

		.label {
			color: #dfdfdf;
		}

		.input {
			background: rgba(255, 255, 255, 0.32);
			border-color: transparent;
		}
	}
}

@media screen and (max-width: 480px) {
	.login-panel {
		margin: 0 2rem;

		.is-128x128 {
			height: 96px;
			width: 96px;
		}
	}
}
</style>
