<!--
 * @Author: JerryK
 * @Date: 2022-01-20 13:21:12
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-11 17:15:53
 * @Description:
 * @FilePath: \CasaOS-UI\src\components\Storage\StorageItem.vue
-->
<template>
  <div class="mb-5 mt-2">
    <div :class="false" class="is-flex mb-2 line-number">
      <ValidationProvider v-slot="{errors, valid} ">
        <b-radio :native-value="system"
                 :value="system"
                 name="selectInstallationLacation"
                 type="is-info"
                 @input="$emit('selection', 'jiejiefirst'+item.path)">
        </b-radio>
      </ValidationProvider>
      <div class="header-icon">
        <b-image :src="require('@/assets/img/storage/storage.png')" class="is-64x64"></b-image>
      </div>
      <div class="ml-3 is-flex-grow-1 is-flex is-align-items-center">
        <div>
          <h4 class="title is-size-14px mb-0 has-text-left one-line">{{ item.name }}
            <b-tag v-if="item.isSystem" class="ml-2">CasaOS</b-tag>
          </h4>

          <p class="has-text-left is-size-7 has-text-grey-light	">{{ $t('Single Drive Storage') }}, <span
              class="is-uppercase">{{ item.fsType }}</span>
            <b-tooltip :label="$t('CasaOS reserves 1% of file space when creating storage in EXT4 format.')"
                       append-to-body>
              <b-icon class="mr-2 " icon="help-circle-outline" size="is-small"></b-icon>
            </b-tooltip>
          </p>
          <p class="has-text-left is-size-7 ">{{
              $t("Available Total", {
                name: item.diskName,
                avl: renderSize(item.availSize),
                total: renderSize(item.size)
              })
            }}</p>
        </div>

      </div>
      <div v-if="!item.isSystem && scence !== 'select installation location'"
           class="is-flex is-align-items-center b-group">
        <b-button :disabled="isRemoving" :loading="isFormating" :type="isFormating?'is-primary':''"
                  rounded size="is-small" @click="formatStorage(item.path,item.mount_point)">
          {{ $t('Format') }}
        </b-button>
        <b-button :disabled="isFormating" :loading="isRemoving" :type="isRemoving?'is-primary':''" class="ml-2"
                  rounded size="is-small" @click="removeStorage(item.disk)"> {{ $t('Remove') }}
        </b-button>
      </div>
    </div>
    <b-progress v-if="scence !== 'select installation location'" :type="item.usePercent | getProgressType"
                :value="item.usePercent"
                size="is-small"></b-progress>
  </div>
</template>

<script>
import {mixin} from '@/mixins/mixin';
import delay from 'lodash/delay';
import {ValidationProvider} from "vee-validate";

export default {
  name: "drive-item",
  components: {ValidationProvider,},
  mixins: [mixin],
  props: {
    item: {
      type: Object,
      default: null
    },
    scence: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      isFormating: false,
      isRemoving: false
    }
  },
  computed: {
    system() {
      if (this.item.isSystem) {
        return true
      }
      return false
    }
  },
  methods: {
    removeStorage(path) {
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
            password: value
          }
          this.$api.disks.umount(data).then((res) => {
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
