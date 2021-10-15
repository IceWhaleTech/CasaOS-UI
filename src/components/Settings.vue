<!--
 * @Author: JerryK
 * @Date: 2021-10-09 18:41:15
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-13 15:33:30
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/Settings.vue
-->
<template>
  <div class="wsettings">
    <b-dropdown aria-role="list" class="navbar-item" :mobile-modal="false">
      <template #trigger>
        <b-button icon-left="menu" class="circle-btn" rounded></b-button>
      </template>
      <b-dropdown-item aria-role="menu-item" :focusable="false" custom class="has-text-white has-text-left">
        <h2 class="title is-5 has-text-white">Widgets Settings</h2>
        <div class="is-flex is-align-items-center item" v-for="(item,index) in settingsData" :key="`setting_${index}`">
          <div class="is-flex is-align-items-center flex1">
            <b-icon :icon="getIcon(item.name)" class="mr-2"></b-icon> <b>{{getTitle(item.name)}}</b>
          </div>
          <b-field>
            <b-switch type="is-dark" v-model="item.show" size="is-small" class="is-flex-direction-row-reverse mr-0" @input="handleInput"></b-switch>
          </b-field>
        </div>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
const widgetsComponents = require.context(
  '@/widgets',
  false,
  /.vue$/
)
const _ = require('lodash')

export default {
  name: "settings",
  data() {
    return {
      apps: [],
      settingsData: []
    }
  },
  model: {
    prop: 'widgetsSettings',
    event: 'change'
  },
  props: {
    widgetsSettings: Array
  },
  created() {
    this.settingsData = JSON.parse(JSON.stringify(this.widgetsSettings))
    widgetsComponents.keys().forEach(fileName => {
      const componentConfig = widgetsComponents(fileName)
      this.apps.push({ app: componentConfig })
    });
  },
  mounted () {
    window.addEventListener('resize', this.onRezise);
  },
  methods: {
    getIcon(value) {
      let obj = _.find(this.apps, o => {
        return o.app.default.name === value
      });
      return obj.app.default.icon;
    },
    getTitle(value) {
      let obj = _.find(this.apps, o => {
        return o.app.default.name === value
      });
      return obj.app.default.title;
    },
    handleInput() {
      this.$emit('change', this.settingsData)
    },
    onRezise(){
      // let container = document.querySelector(".scroll-area")
      //console.log(container.offsetHeight);
    }
  },
  destroyed () {
    window.addEventListener('resize', this.onRezise);
  },
}
</script>
<style lang="scss" >
.wsettings {
  .item {
    margin: 1.25rem 0;
  }
  .circle-btn {
    background: rgba(123, 123, 123, 0.16);
    backdrop-filter: blur(24px);
    color: #fff;
    font-size: 1rem;
    height: 2.25rem;
    width: 2.25rem;
    padding-left: 0 !important;
    padding-right: 0 !important;
    &:hover,
    &:active {
      outline: none;
      color: #fff;
      opacity: 0.8;
    }
    &:focus {
      color: #fff;
      border-color: #fff;
    }
    &:focus:not(:active) {
      box-shadow: none;
    }
  }
  .dropdown-content {
    background: rgba(0, 0, 0, 0.48);
    backdrop-filter: blur(1rem);
    width: 16rem;
    border-radius: 0.5rem;
    .dropdown-item {
      padding: 1rem 1.5rem 0 1.5rem;
    }

    .switch input[type="checkbox"] + .check {
      background: transparent;
      border: #fff 1px solid;
    }
  }
}
</style>
