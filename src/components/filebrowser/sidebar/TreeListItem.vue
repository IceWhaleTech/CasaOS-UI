<!--
 * @Author: JerryK
 * @Date: 2022-03-03 13:27:35
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-06 17:54:51
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/filebrowser/sidebar/TreeListItem.vue
-->
<template>

  <li>
    <div class="is-flex list-item new-list-item" :class="{ 'active': isActived }" @click="open(item.path)"
      v-if="item.visible">
      <div class="cover mr-2 is-flex-shrink-0 is-relative is-flex is-align-items-center">
        <template v-if="item.icon !== 'danger'">
          <b-icon :pack="item.pack" :icon="item.icon" custom-size="casa-28px" :class="iconColor"
            v-if="isIconFont"></b-icon>
          <div class="img-container" v-else>
            <b-image :src="item.icon" class="is-24x24"></b-image>
          </div>
        </template>
        <b-icon icon="danger" pack="casa" class="warn" v-else custom-size="casa-16px"></b-icon>
        <div class="overlay-layer" v-if="isShare">
          <b-icon :pack="item.pack" icon="share" custom-size="casa-10px"
            class="casa-color-green casa-shape-rounded casa-shape-12px"></b-icon>
        </div>
      </div>
      <div class=" is-flex-grow-1 one-line">{{ item.name }}</div>
      <div class=" is-flex-shrink-0 is-flex" v-if="iconName != ''" @click.stop="rightIconClick">
        <b-icon :icon="iconName" :pack="item.pack" custom-size="casa-24px" class="casa-color-gray"></b-icon>
      </div>
    </div>
  </li>

</template>

<script>

export default {
  inject: ['filePanel'],
  components: {},
  props: {
    item: {
      type: Object,
      default: null
    },
    iconColor: {
      type: String,
      default: ''
    },
    iconType: {
      type: String,
      default: 'font'
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
    return {}
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
    isIconFont() {
      return this.iconType == 'font'
    }
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

.img-container {
  width: 24px;
  height: 24px;
}
</style>