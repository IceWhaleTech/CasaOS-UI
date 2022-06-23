<!--
 * @Author: JerryK
 * @Date: 2022-02-23 17:08:21
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-22 22:36:51
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\background\ContextMenu.vue
-->
<template>
  <div>
    <div class="home-context-menu" :style="{top:y + 'px',left:x+'px'}">
      <b-dropdown aria-role="list" close-on-click ref="dropDown" id="dr1" class="file-dropdown" :position="'is-'+verticalPos+'-'+horizontalPos" :animation="ani" :mobile-modal="false">
        <!-- Blank Start -->
        <template>
          <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="system-context11" @click="showChangeWallpaperModal">
            <b-icon icon="wallpaper" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Change wallpaper') }}
          </b-dropdown-item>
        </template>
        <!-- Blank End -->
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],
  data() {
    return {
      verticalPos: "bottom",
      horizontalPos: "right",
      x: Number,
      y: Number,
      ani: "fade1",
    }
  },

  computed: {
    close() {
      return this.item == undefined
    }
  },
  mounted() {
    this.$EventBus.$on("showHomeContextMenu", (data) => {
      this.open(data)
    });


  },
  methods: {
    open(event) {
      const bounced = event.target.getAttribute('class').includes('contextmenu-canvas')
      if (bounced) {
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
    showChangeWallpaperModal() {
      this.$EventBus.$emit("showChangeWallpaperModal");
    }

  },
}
</script>

<style lang="scss" scoped>
.home-context-menu {
  position: fixed;
  z-index: 800;
}
</style>