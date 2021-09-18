<template>
  <!-- <div id="app" class="is-flex is-flex-direction-column" :style="{'background-image': 'url(' + require('./assets/background/AbstractShapes.jpg') + ')'}"> -->
  <div id="app" class="is-flex is-flex-direction-column" :style="{'background-image': 'url(https://www.bing.com/th?id=OHR.Aldeyjarfoss_ZH-CN0106567013_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp)'}">
    <!-- NavBar Start -->
    <!-- <top-bar></top-bar> -->
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

    <!-- BrandBar Start -->
    <brand-bar></brand-bar>
    <!-- BrandBar End -->

    <!-- ContactBar Start -->
    <contact-bar></contact-bar>
    <!-- ContactBar End -->
  </div>
</template>

<script>
import Apps from './components/Apps.vue'
import BrandBar from './components/BrandBar.vue'
import ContactBar from './components/ContactBar.vue'
import SearchBar from './components/SearchBar.vue'
//import Shortcuts from './components/Shortcuts.vue'
import SideBar from './components/SideBar.vue'
import Suggestion from './components/Suggestion.vue'
//import TopBar from './components/TopBar.vue'
export default {
  components: {
    //TopBar,
    BrandBar,
    ContactBar,
    SideBar,
    SearchBar,
    Suggestion,
    Apps,
    //Shortcuts
  },
  created() {
    // Check if not login,login and get token
    if (!localStorage.getItem("user_token")) {
      this.login()
    }
  },
  methods: {
    login() {
      //Login Methods
      this.$api.user.login({
        username: "admin",
        pwd: "admin"
      }).then((res) => {
        if (res.data.success == 200) {
          localStorage.setItem("user_token", res.data.data)
        }else{
          console.log("dadasda");
        }
      })
    }
  },
}
</script>
