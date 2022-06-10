<!--
 * @Author: JerryK
 * @Date: 2022-02-23 17:08:21
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-09 15:29:59
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\ContextMenu.vue
-->
<template>
  <div>

    <div class="action-btn context-menu" :style="{top:y + 'px',left:x+'px'}">
      <b-dropdown aria-role="list" :close-on-click="false" ref="dropDown" id="dr1" class="file-dropdown" :position="'is-'+verticalPos+'-'+horizontalPos" :animation="ani" :mobile-modal="false" @active-change="dorpActiveChange($event,'dr1')">
        <!-- Blank Start -->
        <template v-if="!showDetial">
          <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="system-context11" @click="$refs.dropDown.toggle();filePanel.showNewFileModal()">
            <b-icon icon="file-plus-outline" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('New File') }}
          </b-dropdown-item>
          <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="system-context1" @click="$refs.dropDown.toggle();filePanel.showNewFolderModal()">
            <b-icon icon="folder-plus-outline" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('New Folder') }}
          </b-dropdown-item>

          <hr class="dropdown-divider">
          <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center " key="system-context2" id="upfileBtn" @click="$refs.dropDown.toggle();">
            <b-icon icon="file-upload-outline" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Upload Files') }}
          </b-dropdown-item>
          <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center " key="system-context3" id="upfolderBtn" @click="$refs.dropDown.toggle();">
            <b-icon icon="folder-upload-outline" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Upload Folder') }}
          </b-dropdown-item>
          <template v-if="hasPasteData">
            <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="system-context4" @click="paste('overwrite')">
              <b-icon icon="content-paste" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Paste - Overwrite') }}
            </b-dropdown-item>
            <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="system-context4-1" @click="paste('skip')">
              <b-icon icon="content-paste" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Paste - Skip') }}
            </b-dropdown-item>
          </template>

          <hr class="dropdown-divider">
          <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="system-context5" @click="$refs.dropDown.toggle();filePanel.reload()">
            <b-icon icon="refresh" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Refresh') }}
          </b-dropdown-item>
        </template>
        <!-- Blank End -->

        <!-- Item Start -->
        <template v-else>
          <b-dropdown-item aria-role="menuitem" key="file-context1" @click="download">
            {{ $t('Download') }}
          </b-dropdown-item>
          <b-dropdown-item aria-role="menuitem" key="file-context2" v-if="showSingleEdit" @click="copyPath">
            {{ $t('Copy Path') }}
          </b-dropdown-item>
          <hr class="dropdown-divider">
          <b-dropdown-item aria-role="menuitem" key="file-context3" v-if="showSingleEdit" @click="rename">
            {{ $t('Rename') }}
          </b-dropdown-item>
          <b-dropdown-item aria-role="menuitem" key="file-context4" @click="operate('move',items)">
            {{ $t('Cut') }}
          </b-dropdown-item>
          <b-dropdown-item aria-role="menuitem" key="file-context5" @click="operate('copy',items)">
            {{ $t('Copy') }}
          </b-dropdown-item>
          <hr class="dropdown-divider">
          <b-dropdown-item aria-role="menuitem" class="has-text-danger" @click="isConfirmed = true" v-if="!isConfirmed">
            {{ $t('Delete') }}
          </b-dropdown-item>
          <b-dropdown-item aria-role="menuitem" class="has-text-danger" @click="deleteItem(items)" v-else>
            {{ $t('Are you sure?') }}
          </b-dropdown-item>
        </template>
        <!-- Item End -->
      </b-dropdown>

    </div>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],
  inject: ['filePanel'],
  data() {
    return {
      verticalPos: "bottom",
      horizontalPos: "right",
      isConfirmed: false,
      x: Number,
      y: Number,
      showDetial: false,
      showSingleEdit: true,
      ani: "fade1",
      item: {},
      items: [],
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
    showDetial(val) {
      if (!val) {
        this.assignBtn();
      }
    }
  },
  mounted() {
    this.assignBtn();
  },
  methods: {
    open(event, item) {
      let bounced = event.target.getAttribute('class').includes('dropdown-menu')
      if (!bounced) {
        this.showDetial = (item != undefined)
        const isInSelected = this.filePanel.selectedArray.some(obj => {
          return item.path == obj.path
        })
        if (this.filePanel.selectedArray.length > 1 && isInSelected) {
          this.items = this.filePanel.selectedArray
          this.showSingleEdit = false
        } else {
          this.items = [item]
          this.item = item
          this.showSingleEdit = true
        }
        this.$refs.dropDown.isActive = false
        this.$nextTick(() => {
          this.x = event.clientX
          this.y = event.clientY
          const rightOffset = window.innerWidth - event.clientX - 184
          this.horizontalPos = rightOffset > 0 ? "right" : "left"
          this.$refs.dropDown.isActive = true;
        })
      }
    },
    assignBtn() {
      this.$nextTick(() => {
        this.filePanel.uploaderInstance.assignBrowse(document.getElementById('upfileBtn'))
        this.filePanel.uploaderInstance.assignBrowse(document.getElementById('upfolderBtn'), true)
      });
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
      this.filePanel.showRenameModal(this.item)
    },

    // Paste File
    paste(style = "overwrite") {
      this.$refs.dropDown.toggle()
      this.filePanel.paste(style)
    },
    download() {
      this.$refs.dropDown.toggle()
      const downItem = (this.items.length == 1) ? this.items[0] : this.items
      this.downloadFile(downItem);
    }

  },
}
</script>

<style>
</style>