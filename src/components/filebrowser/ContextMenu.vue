<!--
 * @Author: JerryK
 * @Date: 2022-02-23 17:08:21
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-01 16:09:22
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/filebrowser/ContextMenu.vue
-->
<template>
  <div>

    <div class="action-btn context-menu" :style="{top:y + 'px',left:x+'px'}">
      <b-dropdown aria-role="list" :close-on-click="false" ref="dropDown" id="dr1" class="file-dropdown" :position="'is-'+verticalPos+'-'+horizontalPos" :animation="ani" :mobile-modal="false" @active-change="dorpActiveChange($event,'dr1')">
        <!-- Blank Start -->
        <template v-if="!showDetial">
          <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" @click="$refs.dropDown.toggle();$emit('newFolder')">
            <b-icon icon="folder-plus-outline" class="mr-1" custom-size="mdi-18px"></b-icon> New Folder
          </b-dropdown-item>
          <hr class="dropdown-divider">
          <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" @click="$refs.dropDown.toggle();$emit('upload')">
            <b-icon icon="upload" class="mr-1" custom-size="mdi-18px"></b-icon> Upload
          </b-dropdown-item>

          <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" @click="paste" v-if="hasPasteData">
            <b-icon icon="content-paste" class="mr-1" custom-size="mdi-18px"></b-icon> Paste
          </b-dropdown-item>

          <hr class="dropdown-divider">
          <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" @click="$refs.dropDown.toggle();$emit('reload')">
            <b-icon icon="refresh" class="mr-1" custom-size="mdi-18px"></b-icon> Refresh
          </b-dropdown-item>
        </template>
        <!-- Blank End -->

        <!-- Item Start -->
        <template v-else>
          <b-dropdown-item aria-role="menuitem" v-if="!item.is_dir" @click="download">
            Download
          </b-dropdown-item>
          <hr class="dropdown-divider" v-if="!item.is_dir">
          <b-dropdown-item aria-role="menuitem" @click="rename">
            Rename
          </b-dropdown-item>
          <b-dropdown-item aria-role="menuitem" @click="operate('move')">
            Cut
          </b-dropdown-item>
          <b-dropdown-item aria-role="menuitem" @click="operate('copy')">
            Copy
          </b-dropdown-item>
          <hr class="dropdown-divider">
          <b-dropdown-item aria-role="menuitem" class="has-text-danger" @click="isConfirmed = true" v-if="!isConfirmed">
            Delete
          </b-dropdown-item>
          <b-dropdown-item aria-role="menuitem" class="has-text-danger" @click="deleteItem" v-else>
            Are you sure?
          </b-dropdown-item>
        </template>
        <!-- Item End -->
      </b-dropdown>

    </div>
  </div>
</template>

<script>
import RenameModal from './RenameModal.vue';
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],

  data() {
    return {
      verticalPos: "bottom",
      horizontalPos: "right",
      isConfirmed: false,
      x: Number,
      y: Number,
      showDetial: false,
      ani: "fade1",
      item: {},
      hasPasteData: this.$store.state.operateObject != null
    }
  },
  computed: {
    close() {
      return this.item == undefined
    }
  },
  watch: {
    '$store.state.operateObject': {
      handler(val) {
        this.hasPasteData = (val != null)
      },
      deep: true
    },
  },
  methods: {
    open(event, item) {
      this.showDetial = !(item == undefined)
      this.item = item
      this.$refs.dropDown.isActive = false
      this.$nextTick(() => {
        this.x = event.clientX
        this.y = event.clientY
        const rightOffset = window.innerWidth - event.clientX - 150
        this.horizontalPos = rightOffset > 0 ? "right" : "left"
        this.$refs.dropDown.isActive = true;
      })

    },
    dorpActiveChange($event, el) {
      if ($event) {
        this.isConfirmed = false
      }
      const trigger = document.getElementById(el);
      const bottomOffset = window.innerHeight - trigger.getBoundingClientRect().y - 216
      this.verticalPos = bottomOffset > 0 ? "bottom" : "top"
    },
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
        events: {
          'reload': () => {
            this.$emit("reload")
          }
        },
        props: {
          item: this.item
        }
      })
    },

    // Paste File
    paste() {
      this.$refs.dropDown.toggle()
      this.$api.file.operate(
        this.$store.state.operateObject.from,
        this.$store.state.currentPath,
        this.$store.state.operateObject.type
      ).then(res => {
        if (res.data.success == 200) {
          this.$store.commit('changeOperateObject', null)
          this.$emit("reload")
        } else {
          this.$buefy.toast.open({
            message: res.data.message,
            type: 'is-danger'
          })
        }
      })
    }

  },
}
</script>

<style>
</style>