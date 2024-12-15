<script>
import { mixin } from '@/mixins/mixin'

export default {
  name: 'ListItem',
  mixins: [mixin],
  props: {
    item: {},
    name: String,
    path: String,
    state: Boolean,
    isDir: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isActive: this.state,
    }
  },
  computed: {
    icon() {
      if (this.isDir) {
        return 'folder'
      }
      else {
        return 'file'
      }
    },
  },
  methods: {
    activeSelf() {
      this.isActive = true
      this.$emit('active', this.path)
    },
    expandDir() {
      if (this.IsDir) {
        this.$emit('expand', this.path)
      }
    },
  },

}
</script>

<template>
  <div :class="[{ active: state }]" class="ficon is-flex is-align-items-center" @click="activeSelf" @dblclick="expandDir">
    <div class="cover">
      <div :class="item | coverType">
        <img :class="item | iconType" :src="getIconFile(item)" alt="folder">
      </div>
    </div>
    <div class="one-line">
      {{ name }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ficon {
  padding: 0.5rem 0.5rem 0.5rem 0.8rem;
  -webkit-touch-callout: none;
  user-select: none;
  font-size: 0.875rem;
  line-height: 1.5em;
  border-bottom: #e4e4e4 1px solid;
  border-radius: 4px;
  transition: background-color 0.2s;
  cursor: pointer;

  .cover {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
  }

  &:hover {
    background-color: #e0e0e0;
  }

  &.active {
    background-color: #b6e0ff;
  }
}
</style>
