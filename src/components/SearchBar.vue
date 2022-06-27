<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-27 09:23:40
 * @Description: Top Search bar
 * @FilePath: \CasaOS-UI\src\components\SearchBar.vue
-->

<template>
  <b-field position="is-centered " class="search-bar has-text-white">
    <b-input :placeholder="$t('Search...')" v-model="keyText" icon-pack="casa" icon="magnifier" icon-right="magnifier" icon-right-clickable @icon-right-click="gotoSearch" @keyup.enter.native="gotoSearch" size="is-medium" :class="['ovh',isFocus?'fo':'']" expanded @focus="onFocus" @blur="onBlur">
    </b-input>
  </b-field>
</template>

<script>
export default {
  name: "search-bar",
  data() {
    return {
      isFocus: false,
      keyText: "",
      // searchEngine:this.$store.state.searchEngine
    }
  },
  computed: {
    searchEngine() {
      return this.$store.state.searchEngine == "" ? "https://duckduckgo.com/?q=" : this.$store.state.searchEngine
    }
  },
  methods: {
    /**
     * @description: Handle Focus event
     * @return {*} void
     */
    onFocus() {
      this.isFocus = true;
    },

    /**
     * @description: Handle Blur event
     * @return {*} void
     */
    onBlur() {
      if (this.keyText == "")
        this.isFocus = false;
    },

    /**
     * @description: Pop up a new window and jump to google search
     * @return {*} void
     */
    gotoSearch() {
      window.open(this.searchEngine + this.keyText, '_blank')
    }
  },
}
</script>

<style lang="scss">
.search-bar {
  input {
    transition: all 0.2s;
    appearance: none;
    border-radius: $backDropBorderRadius;
    background: $backDropColor;
    backdrop-filter: $backDropBlur;
    border: none;
    outline: none;
    font-size: 0.875rem !important;
    color: rgba(255, 255, 255, 0.6);
    height: 3rem;
    &:focus {
      border: none;
      box-shadow: none;
    }
    &::placeholder {
      padding-left: 0.5625rem;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .ovh {
    overflow: hidden;
    .icon.is-left {
      transition: all 0.2s;
      left: 0;
    }
    .icon.is-right {
      transition: all 0.2s;
      right: -3rem !important;
      color: white !important;
    }
    input {
      padding-left: 2.5em !important;
      padding-right: 1em !important;
    }
  }
  .fo {
    .icon.is-left {
      left: -3rem !important;
    }
    .icon.is-right {
      transition: all 0.2s;
      right: 0 !important;
    }
    input {
      padding-right: 2.5em !important;
      padding-left: 1em !important;
    }
  }
}
</style>