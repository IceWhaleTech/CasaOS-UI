<!--
 * @Author: JerryK
 * @Date: 2021-10-09 18:41:15
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-11 18:12:41
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
        <div class="is-flex is-align-items-center item" v-for="(item,index) in apps" :key="`setting_${index}`">
          <div class="is-flex is-align-items-center flex1">
            <b-icon :icon="item.app.default.icon" class="mr-2"></b-icon> <b>{{item.app.default.title}}</b>
          </div>
          <b-field>
            <b-switch type="is-dark" size="is-small" class="is-flex-direction-row-reverse mr-0"></b-switch>
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
export default {
  name: "settings",
  data() {
    return {
      apps: []
    }
  },
  created() {
    widgetsComponents.keys().forEach(fileName => {
      const componentConfig = widgetsComponents(fileName)
      this.apps.push({ app: componentConfig })

    });
    // console.log(this.apps);
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
