<!--
 * @Author: JerryK
 * @Date: 2022-03-03 13:27:35
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-04 22:24:11
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\sidebar\TreeListItem.vue
-->
<template>

  <li>
    <div class="is-flex list-item new-list-item" :class="{'active':isActived}" @click="open(item.path)" v-if="item.visible">
      <div class="cover mr-2 is-flex-shrink-0 is-relative">
        <b-icon :pack="item.pack" :icon="item.icon" custom-size="casa-28px" :class="iconColor"></b-icon>
        <div class="overlay-layer" v-if="isShare">
          <b-icon :pack="item.pack" icon="share" custom-size="casa-10px" class="casa-color-green casa-shape-rounded casa-shape-12px"></b-icon>
        </div>
      </div>
      <div class=" is-flex-grow-1">{{item.name}}</div>
      <div class=" is-flex-shrink-0 is-flex" v-if="iconName != ''" @click.stop="rightIconClick">
        <b-icon :icon="iconName" custom-size="casa-24px" class="casa-color-gray"></b-icon>
      </div>
    </div>
  </li>

</template>

<script>

export default {
  inject: ['filePanel'],
  components: {

  },
  props: {
    item: {
      type: Object,
      default: null
    },
    iconColor: {
      type: String,
      default: ''
    },
    iconName: {
      type: String,
      default: ''
    },
    isShare: {
      type: Boolean,
      default: false
    },
    isShow: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
    }
  },
  computed: {
    isActived() {
      if (!this.isActive) {
        return false;
      }
      if (this.item.path == this.$store.state.currentPath) {
        return true
      } else if (this.item.path != this.$store.state.currentPath && this.item.path != "/" && this.item.path != "/DATA") {
        if (this.$store.state.currentPath.indexOf(this.item.path) != -1) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }

    },
  },

  methods: {
    open() {
      this.filePanel.getFileList(this.item.path);
    },

    rightIconClick() {
      this.$emit('rightIconClick', this.item);
    },
  },
}
</script>

<style lang="scss" scoped>
.overlay-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  .icon {
    position: absolute;
    right: -0.15rem;
    bottom: -0.1rem;
  }
}
</style>