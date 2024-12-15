<script>
import { uploaderMixin } from '../common/mixins'
import UploaderFile from './file.vue'

const COMPONENT_NAME = 'uploader-files'

export default {
  name: COMPONENT_NAME,
  components: {
    UploaderFile,
  },
  mixins: [uploaderMixin],
  computed: {
    files() {
      return this.uploader.files
    },
  },
}
</script>

<template>
  <div class="uploader-files">
    <slot :files="files">
      <ul>
        <li v-for="file in files" :key="file.id">
          <UploaderFile :file="file" />
        </li>
      </ul>
    </slot>
  </div>
</template>

<style>
.uploader-files {
  position: relative;
}

.uploader-files > ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
