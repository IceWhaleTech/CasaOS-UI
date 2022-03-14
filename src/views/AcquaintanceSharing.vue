<!--
 * @Author: JerryK
 * @Date: 2022-03-11 13:36:11
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-13 15:39:11
 * @Description: 
 * @FilePath: \CasaOS-UI\src\views\AcquaintanceSharing.vue
-->
<template>
  <div class="acquaintance-share is-flex ">
    <multipane>
      <!-- Sidebar Start -->
      <div class="a-side-bar">
        <!-- Header Start -->
        <div class="header p-20-40 is-flex is-align-items-center">
          <div class="avatar size-44 is-flex-shrink-0 badge danger">
            <b-image :src="require('@/assets/img/avatars/13-small.png')" rounded></b-image>
          </div>
          <b-field class="ml-4 is-flex-grow-1">
            <b-input placeholder="Search..." type="search" icon="magnify" rounded expanded></b-input>
          </b-field>
        </div>
        <!-- Header End -->
        <!-- List Container Start -->
        <div class="a-user-container is-flex is-flex-direction-column">

          <!-- Top Section Start -->
          <div class="list-top is-flex is-flex-shrink-0 is-align-items-center p-20-40">
            <div class="title mb-0 is-size-4 is-flex-grow-1 has-text-left one-line has-text-weight-medium">
              Share friends list
            </div>
            <div class=" is-flex-shrink-0 is-flex is-align-items-center">
              <b-tooltip type="is-dark" label="Add a new friend" animation="c-zoom-in" key="dsa">
                <div class="add-btn grey-hover-btn is-flex is-align-items-center" @click="showAddFriendModal">
                  <b-icon icon="plus"></b-icon>
                </div>
              </b-tooltip>
            </div>
          </div>
          <!-- Top Section End -->
          <!-- Middle Section Start -->
          <ul class="is-flex-grow-1 user-list scrollbars-light-auto">

            <li class="is-flex is-align-items-center p-40-10 user-list-item" v-for="index in 20" :key="`user${index}`"
              :class="(index === 3)?'active':''" @click="showEditFriendModal">
              <div class="avatar size-44 is-flex-shrink-0 badge success">
                <b-image :src="require(`@/assets/img/avatars/${index%13+1}-small.png`)" rounded></b-image>
              </div>
              <div class="ml-4 is-flex-grow-1 has-text-left">
                <h1 class="title is-5 mb-0 one-line">Kristin Watson</h1>
                <h2 class="subtitle is-7 mt-0 one-line">1901 Thornridge Cir. Shiloh</h2>
              </div>
            </li>

          </ul>
          <!-- Middle Section End -->

          <!-- Bottom Section Start -->
          <div class="list-bottom  is-flex-shrink-0  p-20-40">
            <div class=" is-flex has-text-left one-line is-align-items-center download-list-btn grey-hover-btn">
              <b-icon icon="download-multiple" class="mr-1" custom-size="mdi-18px"></b-icon>
              Download list
            </div>

          </div>
          <!-- Bottom Section End -->
        </div>
        <!-- List Container End -->
      </div>
      <!-- Sidebar End -->

      <!-- Resizer Start -->
      <multipane-resizer></multipane-resizer>
      <!-- Resizer End -->

      <!-- Right Side Start -->
      <div class="a-main-content is-flex-grow-1 is-flex is-flex-direction-column">
        <div class="header p-20-40 is-flex is-flex-shrink-0 ">
          <div class="is-flex is-flex-grow-1 is-align-items-center">
            <div class="avatar size-44 is-flex-shrink-0 badge success">
              <b-image :src="require('@/assets/img/avatars/1-small.png')" rounded></b-image>
            </div>
            <div class="ml-4 is-flex-grow-1 has-text-left">
              <h1 class="title is-5 mb-0 one-line">Kristin Watson</h1>
              <h2 class="subtitle is-7 mt-0 one-line">4517 Washington Ave. Manchester, Kentucky 39495, 2715 Ash Dr. San
                Jose, South Dakota 83475</h2>
            </div>
          </div>
          <div class=" is-flex-shrink-0 is-flex is-align-items-center ">
            <b-tooltip position="is-left" type="is-dark" label="Notification">
              <div class="notify-btn grey-hover-btn is-flex is-align-items-center" @click="open = true">
                <b-icon icon="bell-outline"></b-icon>
                <span class="badge danger">
                  1
                </span>
              </div>
            </b-tooltip>

          </div>

        </div>

        <!-- Main Content Start -->
        <download-list></download-list>
        <!-- Main Content End -->

      </div>
      <!-- Right Side End -->
    </multipane>

    <!-- Notify Sidebar Start -->
    <b-sidebar type="is-white" v-model="open" overlay right fullheight>

      <div class="p-30-20 float-sidebar is-flex is-flex-direction-column">
        <div class="is-flex-shrink-0">
          <!-- Top Section Start -->
          <div class="list-top is-flex  is-align-items-center">
            <div class="title mb-0 is-size-4 is-flex-grow-1 has-text-left one-line has-text-weight-medium">
              Notification
            </div>
            <div class=" is-flex-shrink-0 is-flex is-align-items-center">

              <div class="add-btn grey-hover-btn is-flex is-align-items-center" @click="open =false">
                <b-icon icon="close"></b-icon>
              </div>
            </div>
          </div>
          <!-- Top Section End -->
        </div>

        <div class="is-flex-shrink-0">
          <!-- Info Section Start -->
          <div class="is-flex is-align-items-start info mt-5 mb-2">
            <div class="is-flex-shrink-0 mr-1">
              <b-icon icon="information" custom-size="mdi-18px"></b-icon>
            </div>
            <div class="is-flex-grow-1">After passing the application, you can modify the
              remarks for your friends in the friends list on the left.</div>
          </div>
          <!-- Info Section End -->
        </div>

        <!-- List Section Start -->
        <ul class="notification-container is-flex-grow-1 scrollbars-light-auto">
          <li class="notification-list" v-for="index in 8" :key="`n-item-${index}`">
            <!--  Notification Head Start-->
            <div class="user is-flex  is-align-items-center is-flex-grow-1">
              <div class="is-flex is-flex-grow-1 is-align-items-center">
                <div class="avatar size-32 is-flex-shrink-0">
                  <b-image :src="require('@/assets/img/avatars/1-small.png')" rounded></b-image>
                </div>
                <div class="ml-2 is-flex-grow-1 has-text-left">
                  <h1 class="is-size-65 mb-0 one-line has-text-weight-medium has-text-black">Kristin Watson</h1>
                </div>
              </div>
              <div class="is-flex is-flex-shrink-0 is-size-7 time">
                30s ago
              </div>

            </div>
            <!--  Notification Head End-->

            <!-- Notification Body Start -->
            <div class="body mt-2 mb-2">
              Simultaneously we had a problem with
              prisoner drunkenness that we couldn’t figure

            </div>
            <!-- Notification Body End -->

            <!-- Notification Action Start -->
            <div class="buttons is-justify-content-end">
              <b-button size="is-small" rounded>Refuse</b-button>
              <b-button size="is-small" type="is-primary" rounded>Accept</b-button>
            </div>
            <!-- Notification Action End -->
          </li>
        </ul>
        <!-- List Section End -->
      </div>

    </b-sidebar>
    <!-- Notify Sidebar End -->

  </div>
</template>

<script>
import { Multipane, MultipaneResizer } from 'vue-multipane';
import DownloadList from '../components/AcquaintanceShare/components/DownloadList.vue';

import AddFriendModal from '../components/AcquaintanceShare/modals/AddFriendModal.vue'
import EditFriendModal from '../components/AcquaintanceShare/modals/EditFriendModal.vue'

export default {
  components: {
    Multipane,
    MultipaneResizer,
    DownloadList,
  },
  data() {
    return {
      open: false
    }
  },
  methods: {
    // Show Add Friend Modal
    showAddFriendModal() {
      this.$buefy.modal.open({
        parent: this,
        component: AddFriendModal,
        hasModalCard: true,
        customClass: '',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        props: {

        }
      })
    },
    // Modify remarks
    showEditFriendModal() {
      this.$buefy.modal.open({
        parent: this,
        component: EditFriendModal,
        hasModalCard: true,
        customClass: '',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        props: {

        }
      })
    }
  },
}
</script>

