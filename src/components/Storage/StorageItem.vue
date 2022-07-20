<!--
 * @Author: JerryK
 * @Date: 2022-01-20 13:21:12
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 18:58:45
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\Storage\StorageItem.vue
-->
<template>
  <div class="mb-5 mt-2">
    <div class="is-flex mb-2">
      <div class="header-icon">
        <b-image :src="require('@/assets/img/storage/storage.png')" class="is-64x64"></b-image>
      </div>
      <div class="ml-3 is-flex-grow-1 is-flex is-align-items-center">
        <div>
          <h4 class="title is-size-14px mb-0 has-text-left one-line">{{item.name}} <b-tag class="ml-2" v-if="item.isSystem">CasaOS</b-tag>
          </h4>

          <p class="has-text-left is-size-7 has-text-grey-light	">{{ $t('Single Drive Storage') }}, <span class="is-uppercase">{{item.fsType}}</span>
            <b-tooltip :label="$t('CasaOS reserves 1% of file space when creating storage in EXT4 format.')" multilined>
              <b-icon icon="help-circle-outline" size="is-small" class="mr-2 "></b-icon>
            </b-tooltip>
          </p>
          <p class="has-text-left is-size-7 ">{{$t("Available Total",{name:item.diskName,avl:renderSize(item.availSize),total:renderSize(item.size)})}}</p>
        </div>

      </div>
      <div class="is-flex is-align-items-center b-group" v-if="!item.isSystem">
        <b-button size="is-small" :type="isFormating?'is-primary':''" rounded @click="formatStorage(item.path,item.mount_point)" :loading="isFormating" :disabled="isRemoving">{{ $t('Format') }}</b-button>
        <b-button size="is-small" :type="isRemoving?'is-primary':''" rounded class="ml-2" @click="removeStorage(item.path,item.mount_point)" :loading="isRemoving" :disabled="isFormating"> {{ $t('Remove') }}</b-button>
      </div>
    </div>
    <b-progress :type="item.usePercent | getProgressType" size="is-small" :value="item.usePercent"></b-progress>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import delay from 'lodash/delay';
export default {
  name: "drive-item",
  mixins: [mixin],
  props: {
    item: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      isFormating: false,
      isRemoving: false
    }
  },
  methods: {
    removeStorage(path, mount_point) {
      this.isRemoving = true;

      this.$buefy.dialog.prompt({
        title: this.$t('Remove'),
        message: this.$t('Enter the password to continue:'),
        inputAttrs: {
          type: "password"
        },
        trapFocus: true,
        confirmText: this.$t('OK'),
        cancelText: this.$t('Cancel'),
        onCancel: () => {
          this.isRemoving = false;
        },
        onConfirm: (value) => {
          let data = {
            path: path,
            volume: mount_point,
            password: value
          }
          this.$api.storage.delete(data).then((res) => {
            if (res.data.success != 200) {
              this.isRemoving = false;
              this.$buefy.toast.open({
                duration: 3000,
                message: res.data.message,
                type: 'is-danger'
              })
            } else {
              let _this = this
              delay(() => {
                _this.isRemoving = false;
                _this.$emit('getDiskList');
              }, 1000);
            }
          })
        }
      })
    },

    formatStorage(path, mount_point) {
      this.isFormating = true;

      this.$buefy.dialog.prompt({
        title: this.$t('Format'),
        message: this.$t('Enter the password to continue:'),
        inputAttrs: {
          type: "password"
        },
        trapFocus: true,
        confirmText: this.$t('OK'),
        cancelText: this.$t('Cancel'),
        onCancel: () => {
          this.isFormating = false;
        },
        onConfirm: (value) => {
          let data = {
            path: path,
            volume: mount_point,
            password: value
          }

          this.$api.storage.format(data).then((res) => {
            if (res.data.success != 200) {
              this.isFormating = false;
              this.$buefy.toast.open({
                duration: 3000,
                message: res.data.message,
                type: 'is-danger'
              })
            } else {
              let _this = this
              delay(() => {
                _this.isFormating = false;
                _this.$emit('getDiskList');
              }, 1000);
            }
          })
        }
      })
    },

  },
}
</script>