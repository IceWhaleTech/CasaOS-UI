<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:34:15
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-20 16:39:51
 * @Description: 
 * @FilePath: /CasaOS-UI/src/views/Home.vue
-->
<template>
  <div>
    <!-- NavBar Start -->
    <top-bar></top-bar>
    <!-- NavBar End -->

    <!-- Content Start -->
    <div class="contents  pt-55 pb-6">
      <div class="container">
        <div class="is-flex">
          <!-- SideBar Start -->
          <side-bar></side-bar>
          <!-- SideBar End -->

          <!-- MainContent Start -->
          <div class="main-content">
            <!-- SearchBar Start -->
            <section>
              <search-bar></search-bar>
            </section>
            <!-- SearchBar End -->

            <!-- Suggestions For You Start -->
            <section>
              <suggestion></suggestion>
            </section>
            <!-- Suggestions For You End -->

            <!-- Apps Start -->
            <section>
              <apps></apps>
            </section>
            <!-- Apps End -->

            <!-- Shortcuts Start -->
            <!-- <section>
              <shortcuts></shortcuts>
            </section> -->
            <!-- Shortcuts End -->
          </div>
          <!-- MainContent End -->
        </div>
      </div>
    </div>
    <!-- Content End -->
  </div>
</template>

<script>
import Apps from '@/components/Apps.vue'

import SearchBar from '@/components/SearchBar.vue'
import SideBar from '@/components/SideBar.vue'
import Suggestion from '@/components/Suggestion.vue'
import TopBar from '@/components/TopBar.vue'
//import Shortcuts from '@/components/Shortcuts.vue'

export default {
  name: "home",
  components: {
    SideBar,
    SearchBar,
    Suggestion,
    Apps,
    TopBar,
    //Shortcuts
  },
}
</script>

<style>
</style>