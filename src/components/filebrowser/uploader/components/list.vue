<script>
import { uploaderMixin } from '../common/mixins'
import UploaderFile from './file.vue'

const COMPONENT_NAME = 'uploader-list'

export default {
  name: COMPONENT_NAME,
  components: {
    UploaderFile,
  },
  mixins: [uploaderMixin],
  computed: {
    fileList() {
      return this.uploader.fileList
    },
  },
}
</script>

<template>
  <div class="uploader-list">
    <slot :file-list="fileList">
      <ul>
        <li v-for="file in fileList" :key="file.id">
          <UploaderFile :file="file" :list="true" />
        </li>
      </ul>
    </slot>
  </div>
</template>

<style>
.uploader-list {
  position: relative;
}

.uploader-list > ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
