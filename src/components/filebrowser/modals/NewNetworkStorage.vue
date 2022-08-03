<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-08-03 15:28:43
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-03 17:42:40
 * @FilePath: /CasaOS-UI/src/components/filebrowser/modals/NewNetworkStorage.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-3">{{$t('Connect Network Storage')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class=" mt-5 mb-5">
          <b-field :label="$t('Server Address')">
            <b-autocomplete v-model="host" :placeholder="$t('eg : smb://192.168.1.1')"  max-height="120px" open-on-focus :data="filteredDataObj" append-to-body>
              <template slot-scope="props">
                <div class="media is-align-items-center">
                  <div class="media-left is-flex is-align-items-center">
                     <b-icon  icon="history"></b-icon>
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
              <b-icon pack="casa" icon="danger"></b-icon>
            </div>
            <div class="main is-flex is-align-items-center">
              {{ $t('Support Samba Address eg : smb://192.168.1.1') }}
            </div>
          </div>

          <div class="field is-flex ">
            <label class="label is-flex-grow-1">{{ $t('Connect As Guest') }}</label>
            <b-switch v-model="isGuest" type="is-dark"></b-switch>
          </div>

          <div class="mt-5" v-if="!isGuest">
            <b-field horizontal :label="$t('Name')" class="mb-5">
              <b-input name="username" expanded value=""></b-input>
            </b-field>
            <b-field horizontal :label="$t('Password')" class="mb-5">
              <b-input name="password" type="password" expanded value=""></b-input>
            </b-field>
          </div>

        </div>

      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Connect')" type="is-primary" rounded expaned />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import smoothReflow from 'vue-smooth-reflow'
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
      host: "",
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
      return this.data.filter((option) => {
        return option.host
          .toLowerCase()
          .indexOf(this.host.toLowerCase()) >= 0
      })
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
  },
  methods: {

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
    flex-grow: 1 !important;
    text-align: left;
  }
  .field-body {
    flex-grow: 7 !important;
  }
}
</style>