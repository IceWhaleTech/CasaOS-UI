<!--
 * @Author: ezreal.ice hengxin.zhang@icewhale.org
 * @Date:  2022-08-23 14:10:59
 * @LastEditors: ezreal.ice hengxin.zhang@icewhale.org
 * @LastEditTime: 2022-08-23 14:11:18
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
        <button class="delete" type="button" @click="$emit('close')"/>
      </div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class=" mt-5 mb-5">
          <b-field class="is-flex-wrap-nowrap">
            <template #label>
              {{ $t('Address') }}
              <label style="color:red">*</label>
            </template>
            <b-autocomplete ref="inputs"
              v-model="host"
              :data="filteredDataObj"
              :placeholder="$t('Local URL,Pblic URL')"
              append-to-body
              field="host"
              max-height="120px"
              open-on-focus
              @select="option => selected = option">
              <template slot-scope="props">
                <div class="media is-align-items-center smb-media">
                  <div class="media-left is-flex is-align-items-center">
                    <b-icon icon="history"></b-icon>
                  </div>
                  <div class="media-content">
                    {{ props.option.host }}

                  </div>
                </div>
              </template>
            </b-autocomplete>

          </b-field>
          <div class="message-alert is-flex is-align-items-center">
            <div class="left mr-2 is-flex is-align-items-center">
              <b-icon icon="danger" pack="casa"></b-icon>
            </div>
            <div class="main is-flex is-align-items-center">
              {{ $t('Eg: //192.168.1.1:5000 or https://www.google.com') }}
            </div>
          </div>


        </div>

      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Connect')" :loading="isConnecting" expaned rounded type="is-primary" @click="connect"/>
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import smoothReflow from 'vue-smooth-reflow'
import events from '@/events/events';

export default {
  mixins: [smoothReflow],
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      isGuest: true,
      isConnecting: false,
      host: "",
      username: "",
      password: "",
      selected: null,
      data: [
        {
          host: 'smb://192.168.1.1',
          username: '',
          password: '',
        },
        {
          host: 'smb://192.168.1.2',
          username: 'root',
          password: 'password',
        },
        {
          host: 'smb://192.168.1.3',
          username: '',
          password: '',
        },
        {
          host: 'smb://192.168.1.4',
          username: '',
          password: '',
        }
      ]
    }
  },
  computed: {
    filteredDataObj() {
      return this.$store.state.networkStorage
    }
  },
  watch: {
    selected(val) {
      this.isGuest = val.guest
      if (!val.guest) {
        this.username = val.username
        this.password = val.password
      }
    }
  },
  created() {

  },
  mounted() {
    //Smooth
    this.$smoothReflow({
      el: '.modal-card',
      property: ['height', 'width'],
      transition: 'height .25s ease, width .75s ease-out'
    })

    setTimeout(() => {
      this.$refs.inputs.focus()
    }, 500)

  },
  methods: {
    connect() {
      if (this.host.startsWith("smb://") || this.host.startsWith("nfs://")) {
        if (!this.isGuest && (this.username == "" || this.password == "")) {
          this.$buefy.toast.open({
            message: this.$t(`Username or password cannot be empty.`),
            type: 'is-danger'
          })
          return
        } else {

          const host = this.host.replace("smb://", "").replace("nfs://", "")
          const data = this.isGuest ? {
            host: host,
            username: "guest"
          } : {
            host: host,
            username: this.username,
            password: this.password
          }
          this.isConnecting = true
          this.$api.samba.createConnection(data).then(res => {
            this.isConnecting = false
            this.saveNewLoginInfoToLocalStorage()
            this.$EventBus.$emit(events.RELOAD_MOUNT_LIST);
            const item = {
              path: res.data.data.mount_point
            }
            this.$EventBus.$emit(events.GOTO, item);
            this.$emit('close')
          }).catch(err => {
            this.isConnecting = false
            this.$buefy.toast.open({
              message: this.$t(err.response.data.data),
              type: 'is-danger'
            })
          })


        }

      } else {
        this.$buefy.toast.open({
          message: this.$t(`Please enter a correct Samba address!`),
          type: 'is-danger'
        })
        return
      }
    },


    saveNewLoginInfoToLocalStorage() {
      let oldInfo = this.$store.state.networkStorage
      const loginItem = this.isGuest ? {
        host: this.host,
        guest: true,
        username: "",
        password: "",
      } : {
        host: this.host,
        guest: false,
        username: this.username,
        password: "",
      }
      const isInArray = oldInfo.some(item => item.host === loginItem.host && item.guest === loginItem.guest)
      if (!isInArray) {
        oldInfo.push(loginItem)
        this.$store.commit('SET_NETWORK_STORAGE', oldInfo)
      }
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
