<!--
 * @Author: ezreal.ice hengxin.zhang@icewhale.org
 * @Date:  2022-08-23 14:10:59
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-08-26 00:36:35
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
        <h3 class="title is-3">{{ $t('Add External Link/APP') }}</h3>
      </div>
      <div>
        <button class="delete" type="button" @click="$emit('close')" />
      </div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class=" mt-5 mb-5">

          <ValidationProvider rules="required|url" v-slot="{ errors, valid }">
            <b-field class="is-flex-wrap-nowrap" :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="$t(errors)">
              <template #label>
                {{ $t('Address') }}
                <label style="color:red">*</label>
              </template>
              <b-autocomplete ref="inputs" v-model="host" :data="filteredDataObj"
                :placeholder="$t('Local URL,Pblic URL')" append-to-body field="host" max-height="120px" open-on-focus>
              </b-autocomplete>
            </b-field>
          </ValidationProvider>

          <div class="message-alert is-flex is-align-items-center" v-if="!state_hostIsExist">
            <div class="left mr-2 is-flex is-align-items-center">
              <b-icon icon="danger" pack="casa"></b-icon>
            </div>
            <div class="main is-flex is-align-items-center">
              {{ $t('Eg: //192.168.1.1:5000 or https://www.google.com') }}
            </div>
          </div>

          <ValidationProvider rules="required" v-slot="{ errors, valid }" v-if="state_nameIsExist">
            <b-field class="is-flex-wrap-nowrap" :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="$t(errors)">
              <template #label>
                {{ $t('App Name') }}
                <label style="color:red">*</label>
              </template>
              <b-autocomplete ref="inputs" v-model="name" :placeholder="$t('Customize your APP name')" append-to-body
                field="host" max-height="120px">
              </b-autocomplete>
            </b-field>
          </ValidationProvider>


          <ValidationProvider rules="required" v-slot="{ errors, valid }" v-if="state_nameIsExist">
            <b-field class="is-flex-wrap-nowrap">
              <template #label>
                {{ $t('Icon URL') }}
              </template>
              <b-autocomplete ref="inputs" v-model="icon" :data="filteredDataObj" :placeholder="$t('Local URL')"
                append-to-body field="host" max-height="120px">
              </b-autocomplete>
            </b-field>
          </ValidationProvider>


        </div>

      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Connect')" :loading="isLoading" expaned rounded type="is-primary" @click="connect" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import smoothReflow from 'vue-smooth-reflow'
// import events from '@/events/events';
import { ValidationProvider } from 'vee-validate'
import "@/plugins/vee-validate";


export default {
  mixins: [smoothReflow],
  components: { ValidationProvider },
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
      type:String,
      default:"",
    }
  },
  data() {
    return {
      host: "",
      name: "",
      icon: "",
      isLoading: false
    }
  },
  computed: {
    filteredDataObj() {
      return this.$store.state.networkStorage
    },
    state_hostIsExist() {
      return this.host === "" ? false : true
    },
    state_nameIsExist() {
      return this.name === "" ? false : true
    }
  },
  watch: {},
  created() {
    this.host = this.linkHost
    this.name = this.linkName
    this.icon = this.linkIcon
  },
  mounted() { },
  methods: {
    connect() {
      this.isLoading = true
      if (this.state_nameIsExist) {
        let listLinkApp = JSON.parse(localStorage.getItem("listLinkApp"))
        if(!listLinkApp.find((item)=>{
          if(item.host === this.host){
            item.name = this.name
            item.icon = this.icon
            return true
          }
        })){
          listLinkApp = listLinkApp.concat({
            host: this.host,
            name: this.name,
            icon: this.icon,
            type:"LinkApp",
            id:this.name
          })
        }
        this.saveLinkApp(listLinkApp)
      } else {
        this.getLinkAppByHost()
      }
    },

    getLinkAppByHost() {
      this.$api.sys.getProxyRequestContent(this.host).then((res) => {
        this.isLoading = false;
        if (res.status == 200) {
          this.name = "res.data.data"
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
      this.name = "res.data.data"
      this.icon = "https://avatars.githubusercontent.com/u/91336243?s=200&v=4"
      this.isLoading = false;
    },

    saveLinkApp(data) {
      let json = JSON.stringify(data)
      this.$api.users.saveLinkAppDetail(json).then((res) => {
        this.isLoading = false;
        if (res.data.success == 200) {
          localStorage.setItem('listLinkApp',JSON.stringify(res.data.data))
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
          message: this.$t(`Please enter a correct Samba address!`),
          type: 'is-danger'
        })
      })
    }
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
