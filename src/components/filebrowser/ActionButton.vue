<!--
 * @Author: JerryK
 * @Date: 2022-02-23 17:08:21
 * @LastEditors: JerryK
 * @LastEditTime: 2022-02-25 14:58:20
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/filebrowser/ActionButton.vue
-->
<template>
  <div class="action-btn">
    <b-dropdown aria-role="list" append-to-body :close-on-click="false" :triggers="['contextmenu','click']" ref="dropDown" :id="'dr-'+index" class="file-dropdown" :position="'is-'+verticalPos+'-'+horizontalPos" animation="fade1" :mobile-modal="false" @active-change="dorpActiveChange($event,'dr-'+index)">
      <template #trigger>
        <p role="button">
          <b-icon icon="dots-horizontal" custom-size="mdi-18px" id="das">
          </b-icon>
        </p>
      </template>
      <b-dropdown-item aria-role="menuitem" v-if="!item.is_dir" @click="download">
        Download
      </b-dropdown-item>
      <hr class="dropdown-divider" v-if="!item.is_dir">
      <b-dropdown-item aria-role="menuitem" @click="rename">
        Rename
      </b-dropdown-item>
      <b-dropdown-item aria-role="menuitem">
        Move
      </b-dropdown-item>
      <b-dropdown-item aria-role="menuitem">
        Copy
      </b-dropdown-item>
      <hr class="dropdown-divider">
      <b-dropdown-item aria-role="menuitem" class="has-text-danger" @click="isConfirmed = true" v-if="!isConfirmed">
        Delete
      </b-dropdown-item>
      <b-dropdown-item aria-role="menuitem" class="has-text-danger" @click="deleteItem" v-else>
        Are you sure?
      </b-dropdown-item>
    </b-dropdown>

  </div>
</template>

<script>
import RenameModal from './RenameModal.vue';
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],
  props: {
    cols: Number,
    index: Number,
    item: Object
  },
  data() {
    return {
      verticalPos: "bottom",
      isConfirmed: false
    }
  },
  computed: {
    horizontalPos() {
      return (this.index + 1) % this.cols == 0 ? "left" : "right"
    }
  },
  methods: {
    dorpActiveChange($event, el) {
      if ($event) {
        this.isConfirmed = false
      }
      const trigger = document.getElementById(el);
      const bottomOffset = window.innerHeight - trigger.getBoundingClientRect().y - 216
      this.verticalPos = bottomOffset > 0 ? "bottom" : "top"
    },
    // Download Button Action
    download() {
      this.$refs.dropDown.toggle()
      this.downloadFile(this.item)
    },
    // Rename Button Action
    rename() {
      this.$refs.dropDown.toggle()
      this.$buefy.modal.open({
        parent: this,
        component: RenameModal,
        hasModalCard: true,
        customClass: 'rename-panel file-modal',
        trapFocus: true,
        canCancel: [''],
        scroll: "keep",
        animation: "zoom-out",
        props: {
          item: this.item
        }
      })
    },
    // Delete File
    deleteItem() {
      this.$api.file.delete(this.item.path).then(res => {
        if (res.data.success == 200) {
          this.$refs.dropDown.toggle()
          this.$emit("reload")
        }
      })
    }

  },
}
</script>

<style>
</style>