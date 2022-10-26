<!--
 * @Author: ezreal.ice hengxin.zhang@icewhale.org
 * @Date:  2022-08-23 14:10:59
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-08-27 18:45:33
 * @FilePath: /CasaOS-UI/src/components/Apps/ExternalLinkPanel.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->

<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-3">{{ panelTitle }}</h3>
      </div>
      <div>
        <button class="delete" type="button" @click="$emit('close')"/>
      </div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class=" mt-5 mb-5">
          <ValidationObserver ref="ob1">
            <ValidationProvider v-slot="{ errors, valid }" rules="required|url">
              <b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }"
                       class="is-flex-wrap-nowrap">
                <template #label>
                  {{ $t('Address') }}
                  <label style="color:red">*</label>
                </template>
                <b-autocomplete ref="inputs" v-model="host" :data="filteredDataObj"
                                :placeholder="$t('Local URL,Pblic URL')" append-to-body field="host" max-height="120px"
                                open-on-focus>
                </b-autocomplete>
              </b-field>
            </ValidationProvider>

            <div v-if="!state_hostIsExist" class="message-alert is-flex is-align-items-center">
              <div class="left mr-2 is-flex is-align-items-center">
                <b-icon icon="danger" pack="casa"></b-icon>
              </div>
              <div class="main is-flex is-align-items-center">
                {{ $t('Eg: //192.168.1.1:5000 or https://www.google.com') }}
              </div>
            </div>

            <ValidationProvider v-slot="{ errors, valid }" rules="required">
              <b-field :message="$t(errors)" :type="{ 'is-danger': errors[0], 'is-success': valid }"
                       class="is-flex-wrap-nowrap">
                <template #label>
                  {{ $t('App Name') }}
                  <label style="color:red">*</label>
                </template>
                <b-autocomplete ref="inputs" v-model="name" :placeholder="$t('Customize your APP name')" append-to-body
                                field="host" max-height="120px">
                </b-autocomplete>
              </b-field>
            </ValidationProvider>

            <b-field :label="$t('Icon URL')">
              <p class="control">
                <span class="button is-static container-icon">
                  <b-image :key="icon" :src="icon" :src-fallback="require('@/assets/img/app/default.png')"
                           class="is-32x32" ratio="1by1"></b-image>
                </span>
              </p>
              <b-input v-model="icon" :placeholder="$t('Your custom icon URL')" expanded></b-input>
            </b-field>

          </ValidationObserver>
        </div>

      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Connect')" :loading="isLoading" expaned rounded type="is-primary" @click="connect"/>
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import smoothReflow from 'vue-smooth-reflow'
import {ValidationObserver, ValidationProvider} from 'vee-validate'
import "@/plugins/vee-validate";
import {nanoid} from 'nanoid'
// import debounce from 'lodash/debounce'


export default {
  mixins: [smoothReflow],
  components: {ValidationProvider, ValidationObserver},
  props: {
    linkName: {
      type: String,
      default: "",
    },
    linkHost: {
      type: String,
      default: "",
    },
    linkIcon: {
      type: String,
      default: "",
    },
    linkId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      id: "",
      host: "",
      name: "",
      icon: "",
      isLoading: false,
    }
  },
  computed: {
    filteredDataObj() {
      return this.$store.state.networkStorage
    },
    state_hostIsExist() {
      return this.host === "" ? false : true
    },
    panelTitle() {
      if (this.linkName === "") {
        return this.$t('Add External Link/APP');
      } else {
        return this.$t("Set External Link/APP")
      }
    },
  },
  watch: {},
  created() {
    this.id = this.linkId
    this.host = this.linkHost || "http://"
    this.name = this.linkName
    this.icon = this.linkIcon
  },
  mounted() {
  },
  methods: {
    /**
     * @description: Validate form async
     * @param {Object} ref ref of component
     * @return {Boolean}
     */
    async checkStep(ref) {
      let isValid = await ref.validate()
      return isValid
    },

    connect() {
      this.checkStep(this.$refs.ob1).then(valid => {
        if (valid) {
          this.isLoading = true
          let listLinkApp = JSON.parse(localStorage.getItem("listLinkApp"))
          if (!listLinkApp.find((item) => {
            if (item.id === this.id) {
              item.host = this.host
              item.name = this.name
              item.icon = this.icon
              return true
            }
          })) {
            let id = nanoid()
            listLinkApp = listLinkApp.concat({
              host: this.host,
              name: this.name,
              icon: this.icon,
              type: "LinkApp",
              state: "running",
              custom_id: id,
              id
            })
          }
          this.saveLinkApp(listLinkApp)
        }
      })
    },

    getLinkAppByHost() {
      this.$api.sys.getProxyRequestContent(this.host).then((res) => {
        this.isLoading = false;
        if (res.status == 200) {
          this.name = ""
          this.icon = "https://avatars.githubusercontent.com/u/91336243?s=200&v=4"
        } else {
          this.$buefy.toast.open({
            message: res.data.message,
            type: 'is-warning'
          })
        }
      }).catch((err) => {
        this.isLoading = false;
        this.$buefy.toast.open({
          message: err.response.data.message || "NOT FOUND",
          type: 'is-danger'
        })
      })
    },

    saveLinkApp(data) {
      let json = JSON.stringify(data)
      this.$api.users.saveLinkAppDetail(json).then((res) => {
        this.isLoading = false;
        if (res.data.success == 200) {
          let stor = res.data.data
          if (stor === "") {
            stor = []
          }
          localStorage.setItem('listLinkApp', JSON.stringify(stor))
          this.$emit('updateState')
          this.$emit('close')
        } else {
          this.$buefy.toast.open({
            message: res.data.message,
            type: 'is-warning'
          })
        }
      }).catch((err) => {
        this.isLoading = false;
        this.$buefy.toast.open({
          message: err.response.data.message || "NOT FOUND",
          type: 'is-danger'
        })
      })
    },

  },
}
</script>

<style lang="scss" scoped>
.modal-card {
  max-width: 40rem;
}

.modal-card-body {
  overflow-y: hidden;
}

.message-alert {
  padding: 0.4rem 1rem;
  margin-bottom: 1.75rem;
  background: #fff7e6;
  border-radius: 4px;
  color: #d99000;
  font-size: 0.875rem;
}
</style>

<style lang="scss">
.network-storage-modal {
  .field-label {
    text-align: left;
  }
}

.smb-media {
  color: #999;
}
</style>
