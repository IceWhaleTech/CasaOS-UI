<template>
  <div class="buttons mb-0">
    <b-button size="is-small" icon-left="home" class="mb-0" :disabled="currentIndex==0" rounded @click="goHome">{{ $t('Home') }}</b-button>
    <b-button size="is-small" icon-left="chevron-left" class="mb-0" rounded :disabled="disabledPrev" @click="back">{{ $t('Back') }}</b-button>
    <b-button size="is-small" icon-right="chevron-right" class="mb-0" rounded :disabled="disabledNext" @click="next">{{ $t('Forward') }}</b-button>
  </div>
</template>

<script>
import dropRight from 'lodash/dropRight'
export default {
  inject: ['filePanel'],
  data() {
    return {
      historyArray: [],
      currentIndex: 0,
      currentPath: ""
    }
  },
  props: {
    user: {},
  },
  computed: {
    disabledNext() {
      return this.currentIndex == this.historyArray.length - 1 || this.historyArray.length == 0
    },
    disabledPrev() {

      return (this.currentIndex < 1) || this.historyArray.length == 0
    }
  },

  methods: {
    clearHistory() {
      this.historyArray = ["/"];
      this.currentIndex = 0;
    },
    addHistory(path) {
      //cut array from current index
      let cutLen = this.historyArray.length - this.currentIndex - 1
      this.historyArray = dropRight(this.historyArray, cutLen)
      this.historyArray.push(path);
      this.currentIndex = this.historyArray.length - 1
    },
    back() {
      this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : 0;
      this.goto()
    },
    next() {
      this.currentIndex = this.currentIndex < this.historyArray.length ? this.currentIndex + 1 : this.historyArray.length - 1;
      this.goto()
    },
    goto() {
      this.currentPath = this.historyArray[this.currentIndex]
      this.filePanel.getUserFiles(this.user, this.currentPath, 3)
    },
    goHome() {
      this.clearHistory()
      this.goto()
    }
  },
}
</script>

<style>
</style>