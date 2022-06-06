<!--
 * @Author: JerryK
 * @Date: 2022-03-11 13:36:11
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-31 18:49:46
 * @Description: 
 * @FilePath: \CasaOS-UI\src\views\CasaConnect.vue
-->
<template>
  <div class="acquaintance-share is-flex ">
    <multipane @paneResize="onPanerResize">
      <!-- Sidebar Start -->
      <div class="a-side-bar is-flex-shrink-0">
        <!-- Header Start -->
        <div class="header p-20-40 is-flex is-align-items-center">

          <b-dropdown aria-role="list" class="file-dropdown" animation="fade1" append-to-body>
            <template #trigger>
              <b-tooltip :label="$t('More info')" type="is-dark" position="is-right">
                <div id="v-step-0" class="avatar size-44 is-flex-shrink-0 is-clickable">
                  <avatar :username="myInfo.nick_name" :size="42"></avatar>
                </div>
              </b-tooltip>
            </template>

            <b-dropdown-item aria-role="menuitem" @click="showEditInfoModal">
              <b-icon icon="account" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Edit Info') }}
            </b-dropdown-item>
            <b-dropdown-item aria-role="menuitem" @click="copyMyId">
              <b-icon icon="content-copy" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Copy My Share ID') }}
            </b-dropdown-item>
          </b-dropdown>

          <div class="ml-4 is-flex-grow-1 has-text-left">
            <h1 class="title is-5 mb-0 one-line">{{myInfo.nick_name}}</h1>
            <h2 class="subtitle is-7 mt-0 mb-0 one-line has-text-grey">{{myInfo.description}}</h2>
          </div>

          <b-field class="ml-4 is-flex-grow-1 is-flex is-justify-content-flex-end">
            <!-- <b-input placeholder="Search..." type="search" icon="magnify" rounded expanded></b-input> -->

          </b-field>
        </div>
        <!-- Header End -->
        <!-- List Container Start -->
        <div class="a-user-container is-flex is-flex-direction-column">

          <!-- Top Section Start -->
          <div class="list-top is-flex is-flex-shrink-0 is-align-items-center p-20-40">
            <div class="title mb-0 is-size-4 is-flex-grow-1 has-text-left one-line has-text-weight-medium">
              {{ $t('Friends') }}
            </div>
            <div class=" is-flex-shrink-0 is-flex is-align-items-center">
              <b-tooltip type="is-dark" :label="$t('Add Friend')" key="dsa">
                <div id="v-step-1" class="add-btn grey-hover-btn is-flex is-align-items-center" @click="showAddFriendModal">
                  <b-icon icon="plus"></b-icon>
                </div>
              </b-tooltip>
            </div>
          </div>
          <!-- Top Section End -->
          <!-- Middle Section Start -->
          <ul class="is-flex-grow-1 user-list scrollbars-light-auto">
            <user-context-menu ref="userContextMenu" @reloadFriendList="getMyFriendList(true)"></user-context-menu>
            <li class="is-flex is-align-items-center p-40-10 user-list-item" v-for="user,index in myFriendsList" :key="`user${index}`" :class="(currentUser.token === user.token)?'active':''" @contextmenu.prevent="showContext($event,user)" @click="getUserFiles(user,rootPath,2)">
              <div class="avatar size-44 is-flex-shrink-0 badge " :class="[user.on_line ? 'success' : 'danger']">
                <avatar :username="user.nick_name==''?'casa':user.nick_name" :size="42"></avatar>
              </div>
              <div class="ml-4 is-flex-grow-1 has-text-left">
                <h1 class="title  mb-0 one-line">{{user.mark==""?user.nick_name:user.mark}}</h1>
                <h2 class="subtitle is-7 mt-0 one-line has-text-grey">{{user.profile}}</h2>
              </div>
            </li>
          </ul>
          <!-- Middle Section End -->

          <!-- Bottom Section Start -->
          <div class="list-bottom  is-flex-shrink-0  p-20-40 is-flex is-align-items-center">
            <div class=" is-flex has-text-left is-flex-grow-1 one-line is-align-items-center download-list-btn grey-hover-btn mr-2" @click="showDownloadList" id="v-step-2">
              <div class="is-flex is-align-items-center is-flex-grow-1 ">
                <b-icon icon="download-multiple" class="mr-1 is-flex-shrink-0" custom-size="mdi-18px"></b-icon>
                <div class="one-line">{{ $t('Downloads') }}</div>
              </div>
              <div>
                <b-tag type="is-primary" size="is-xxs" class="mr-3" rounded v-if="downloadListLen > 0">{{downloadListLen}}</b-tag>
              </div>

            </div>
            <div class=" is-flex-shrink-0">
              <b-tooltip type="is-dark" :label="$t('Settings')" key="config">
                <div class="add-btn grey-hover-btn is-flex is-align-items-center" @click="showSettingsModal" id="v-step-3">
                  <b-icon icon="cog-outline"></b-icon>
                </div>
              </b-tooltip>
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
      <div class="a-main-content is-flex-grow-1 is-flex is-flex-direction-column" id="drag-area">
        <div class="header p-20-40 is-flex is-flex-shrink-0 ">
          <div class="is-flex is-flex-grow-1 is-align-items-center h-44">
            <transition name="fade-transform" mode="out-in">
              <div class="is-flex is-flex-grow-1 is-align-items-center" v-if="currentUser.token != ''" :key="currentUser.token">
                <b-tooltip type="is-dark" :label="'ID : '+currentUser.token" position="is-right">
                  <div class="avatar size-44 is-flex-shrink-0 badge success">
                    <avatar :username="currentUser.nick_name==''?'test':currentUser.nick_name" :size="44"></avatar>
                  </div>
                </b-tooltip>
                <div class="ml-4 is-flex-grow-1 has-text-left">
                  <h1 class="title is-5 mb-0 one-line">{{currentUser.nick_name==''?'test':currentUser.nick_name}}</h1>
                  <h2 class="subtitle is-7 mt-0 mb-0 one-line has-text-grey">{{currentUser.mark}}</h2>
                </div>
              </div>
            </transition>

          </div>
          <div class=" is-flex-shrink-0 is-flex is-align-items-center ">
            <!-- <b-tooltip position="is-left" type="is-dark" :label="$t('Notification')">
              <div class="notify-btn grey-hover-btn is-flex is-align-items-center" @click="open = true">
                <b-icon icon="bell-outline"></b-icon>
                <span class="badge danger">
                  1
                </span>
              </div>
            </b-tooltip> -->
          </div>
        </div>

        <!-- Main Content Start -->
        <!-- Download List Page Start -->
        <download-list v-if="isDownloadShow" @updateListLen="updateListLen"></download-list>
        <!-- Download List Page End -->
        <!-- No Data Holder Start -->
        <div class="is-flex-grow-1 is-flex  is-align-items-center is-justify-content-center acc-content" v-if="!isDownloadShow && isNoneUserSelect">
          <!-- Drag and Drop Mask Start -->
          <div class="drag-mask is-flex is-align-items-center is-flex-direction-row" v-if="isDragIn">
            <div class="mb-6">
              <p class="has-text-primary">
                {{ $t('Upload not supported！') }}
              </p>
            </div>
          </div>
          <!-- Drag and Drop Mask End -->
          <div class="has-text-grey-light">{{ $t('Select a friend to view his share.') }}</div>
        </div>
        <!-- No Data Holder End -->

        <div class="is-flex-grow-1 is-flex-shrink-1 is-flex is-flex-direction-column is-relative  acc-content calc-height" v-if="!isDownloadShow && !isNoneUserSelect">
          <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
          <!-- Tool Bar Start -->
          <div class="tool-bar is-flex pt-4 pb-2">
            <div class="breadcrumb-container  flex1" id="bread-container">
              <history-button ref="historyBar" :user="currentUser"></history-button>
            </div>
            <div class="view-btns is-flex-shrink-0 is-flex is-align-items-center">
              <b-tooltip :label="$t('Change View')" position="is-left" type="is-dark">
                <p role="button" class="is-clickable is-flex" @click="changeView">
                  <b-icon :icon="viewIcon"></b-icon>
                </p>
              </b-tooltip>
            </div>
          </div>
          <!-- Tool Bar End -->
          <div id="dropTarget">

            <!-- Drag and Drop Mask Start -->
            <div class="drag-mask is-flex is-align-items-center is-flex-direction-row" v-if="isDragIn">
              <div class="mb-6">
                <p class="has-text-primary">
                  {{ $t('Upload not supported！') }}
                </p>
              </div>
            </div>
            <!-- Drag and Drop Mask End -->

            <component :is="listView" ref="views" v-model="listData" :user="currentUser" @gotoFolder="getUserFiles" @showDownloadModal="showDownloadModal">
              <div class="has-text-grey-light">{{ $t('There are no files in the current folder.') }}</div>
            </component>

          </div>

        </div>
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
              {{ $t('Notification') }}
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

    <!-- Vue Tour Start -->
    <v-tour name="myTour" :steps="steps">
      <template slot-scope="tour">
        <transition name="fade">
          <v-step v-if="tour.steps[tour.currentStep]" :key="tour.currentStep" :step="tour.steps[tour.currentStep]" :previous-step="tour.previousStep" :next-step="tour.nextStep" :stop="tour.stop" :skip="tour.skip" :is-first="tour.isFirst" :is-last="tour.isLast" :labels="tour.labels">
            <template>
              <div slot="content" class="v-step__content">
                {{$t(tour.steps[tour.currentStep].content)}}
              </div>
              <div slot="actions" class="buttons mb-0 columns is-gapless">
                <div class="column has-text-left">
                  <b-button size="is-small" class=" mb-0" @click="tour.previousStep" v-if="!tour.isFirst && !tour.isLast" rounded>{{ $t('Prev') }}</b-button>
                </div>
                <div class="column">

                  <b-button size="is-small" class=" mb-0" type="is-success" @click="tour.skip" v-if="!tour.isLast" rounded>{{ $t('Skip') }}</b-button>

                </div>
                <div class="column has-text-right">
                  <b-button size="is-small" class=" mb-0" @click="tour.nextStep" v-if="!tour.isLast" rounded>{{ $t('Next') }}</b-button>
                  <b-button size="is-small" class=" mb-0" type="is-success" @click="tour.skip" v-if="tour.isLast" rounded>{{ $t(`Let's Go`)}}</b-button>
                </div>
              </div>
            </template>
          </v-step>
        </transition>
      </template>
    </v-tour>
    <!-- Vue Tour End -->

  </div>
</template>

<script>
import Avatar from 'vue-avatar'
import { Multipane, MultipaneResizer } from 'vue-multipane';
import orderBy from 'lodash/orderBy'
import isEqual from 'lodash/isEqual'
import find from 'lodash/find'
import DownloadList from '../components/AcquaintanceShare/components/DownloadList.vue';
import GirdView from '../components/AcquaintanceShare/components/GirdView.vue';
import ListView from '../components/AcquaintanceShare/components/ListView.vue';
import AddFriendModal from '../components/AcquaintanceShare/modals/AddFriendModal.vue'
import DownloadModal from '../components/AcquaintanceShare/modals/DownloadModal.vue'
import ProfileModal from '../components/AcquaintanceShare/modals/ProfileModal.vue'
import SettingsModal from '../components/AcquaintanceShare/modals/SettingsModal.vue'

import HistoryButton from '../components/AcquaintanceShare/components/HistoryButton.vue'
import MyInfoModal from '../components/AcquaintanceShare/modals/MyInfoModal.vue'
import InitModal from '../components/AcquaintanceShare/modals/InitModal.vue'
import UserContextMenu from '../components/AcquaintanceShare/components/UserContextMenu.vue';
import copy from 'clipboard-copy'

export default {
  name: "casa-connect",
  provide() {
    return {
      filePanel: this
    }
  },
  components: {
    Multipane,
    MultipaneResizer,
    DownloadList,
    GirdView,
    ListView,
    HistoryButton,
    Avatar,
    UserContextMenu,

  },
  data() {
    return {
      isSelfLoading: false,
      open: false,
      timer: 0,
      timeGap: 3,
      isViewGird: true,
      isLoading: false,
      isDownloadShow: false,
      isDragIn: false,
      timeout: null,

      rootPath: "/",
      currentPath: "",
      currentPathName: "",
      listData: [],
      myId: "",
      myInfo: {
        user_name: "",
        nick_name: "",
        description: ""
      },
      myFriendsList: [],
      currentUser: {
        token: "",
      },
      currentUserFileList: {},
      cancelRequest: null,
      downloadListLen: 0,
      wsUrl: `ws://${this.$baseURL}/v1/notify/ws?token=${this.$store.state.token}`,
      steps: [
        {
          target: '#v-step-0',
          content: 'Here is your avatar, where you can change your personal information and get your ID to share with your friends.'
        },
        {
          target: '#v-step-1',
          content: "Click \"+\" and enter your friend's ID to send a friend request."
        },
        {
          target: '#v-step-2',
          content: 'Browse your download progress and download history here.'
        },
        {
          target: '#v-step-3',
          content: 'Modify your shared folders, and default download path here.'
        }
      ]
    }
  },
  computed: {
    isInit() {
      return this.myInfo.nick_name != "" && this.myInfo.description != ""
    },
    viewIcon() {
      return this.$store.state.isShareViewGird ? "view-grid-outline" : "format-list-bulleted"
    },
    listView() {
      return this.$store.state.isShareViewGird ? "gird-view" : "list-view"
    },
    isNoneUserSelect() {
      return isEqual(this.currentUser, {
        token: ""
      })
    }
  },
  created() {

  },
  mounted() {
    this.getMyInfo()
    this.getMyShareId()
    // if (this.timer)
    //   clearInterval(this.timer)

    // this.timer = setInterval(() => {
    //   this.getMyFriendList()
    // }, this.timeGap * 1000)
    this.getDownloadListLen()
    // this.$tours['myTour'].start()

    // Handling drag-and-drop upload events
    var tranlatePath = document.getElementById("drag-area");
    tranlatePath.addEventListener("dragenter", this.onDrag, false);
    tranlatePath.addEventListener("dragover", this.onDrag, false);
    tranlatePath.addEventListener("drop", this.onDrop, false);

  },

  methods: {


    /*************************************************
     * PART 1  Self Logic
    **************************************************/
    // Get My Info
    getMyInfo() {
      this.$api.user.getUserInfo().then(res => {
        this.myInfo = res.data.data
        if (!this.isInit) {
          this.showInitModal()
        } else {
          this.getMyFriendList(true)
        }
      })

    },

    //   Get MyID
    getMyShareId() {
      this.$api.person.getMyShareId().then(res => {
        this.myId = res.data.data
      })
    },
    //   Copy MyID to clipboard
    copyMyId() {
      copy(this.myId)
      this.$buefy.toast.open({
        message: this.myId + " " + this.$t('has been copied to the clipboard'),
        type: 'is-success'
      })
    },


    /*************************************************
     * PART 2  Friends share 
    **************************************************/

    getMyFriendList(showFirst = false) {
      this.$api.person.getFriendsList().then(res => {
        this.myFriendsList = orderBy(res.data.data, ['on_line'], ['desc'])
        if (showFirst && this.myFriendsList.length > 0) {
          let user = find(this.myFriendsList, (o) => { return o.on_line; });
          this.getUserFiles(user, this.rootPath)
        }
      })
    },

    // Get user Files
    getUserFiles(user, path, type = 1) {

      if (!user.on_line) {
        this.$buefy.toast.open({
          message: user.nick_name + " " + this.$t('is offline'),
          type: 'is-danger'
        })
        return false
      }
      if (this.isDownloadShow) this.isDownloadShow = false
      this.currentUser = user
      this.isLoading = true;

      if (typeof this.cancelRequest === 'function') {
        this.cancelRequest()
      }
      this.$api.person.getDirectory(this.currentUser.token, path, this).then(res => {
        this.isLoading = false;
        if (res.data.success == 200) {

          this.currentPath = path
          this.currentPathName = path.split("/").pop()
          this.listData = orderBy(res.data.data, ['is_dir'], ['desc'])
          if (type == 2) {
            console.log(path);
            this.$refs.historyBar.clearHistory();
          } else if (type == 1) {
            this.$refs.historyBar.addHistory(path);
          }

        } else {
          this.listData = []
          console.log(res.data.message);
        }
        this.$store.commit('changeCurrentSharePath', path)

      }).catch(err => {
        console.log(err);
      })

    },

    /*************************************************
     * PART 2  UI Action
    **************************************************/
    // Show user side bar context
    showContext($event, user) {
      this.$refs.userContextMenu.open($event, user)
    },

    // Reload current folder
    reload() {
      this.getUserFiles(this.currentUser, this.currentPath);
    },

    // Show Download List
    showDownloadList() {
      this.isDownloadShow = true;
      this.listData = []
      this.currentUser = {
        token: "",
      }
    },

    // Get download list length
    getDownloadListLen() {
      this.$api.person.getDownloadList().then(res => {
        if (res.data.success == 200) {
          this.downloadListLen = res.data.data.filter(item => {
            return item.state != 5
          }).length
        }
      })
    },

    //Update download list length
    updateListLen(len) {
      this.downloadListLen = len
    },

    // Change View
    changeView() {
      this.isViewGird = !this.$store.state.isShareViewGird
      this.$store.commit('changeShareViewGird', this.isViewGird)
    },

    // Handle the multipane resize event
    onPanerResize() {
      if (this.isViewGird)
        this.$refs.views.onResize()
    },

    /******************************************
     * PART 3  Modals
    *******************************************/

    //  Show Init Modal
    showInitModal() {
      this.$buefy.modal.open({
        parent: this,
        component: InitModal,
        customClass: "init-modal",
        hasModalCard: true,
        trapFocus: true,
        canCancel: [],
        scroll: "keep",
        animation: "zoom-in",
        props: {
          myInfo: this.myInfo
        },
        events: {
          'close': () => {
            this.getMyInfo()
            this.$tours['myTour'].start()
            this.getMyFriendList(true)
          }
        }
      })
    },

    // Show Edit My Info Modal
    showEditInfoModal() {
      this.$buefy.modal.open({
        parent: this,
        component: ProfileModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        events: {
          'close': () => {
            this.getMyInfo()
          }

        }
      })
    },

    // Show  Settings Modal
    showSettingsModal() {
      this.$buefy.modal.open({
        parent: this,
        component: SettingsModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        events: {
          'after-enter': () => {
            console.log("enter");
          }
        }
      })
    },



    // Show my ID Modal
    showMyIdModal() {
      this.$buefy.modal.open({
        parent: this,
        component: MyInfoModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        props: {

        }
      })
    },

    // Show Add Friend Modal
    showAddFriendModal() {
      this.$buefy.modal.open({
        parent: this,
        component: AddFriendModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        events: {
          "reloadFriendList": () => {
            this.getMyFriendList()
          }
        }
      })
    },
    // Show Download Modal
    showDownloadModal(user, item) {
      this.$buefy.modal.open({
        parent: this,
        component: DownloadModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        props: {
          user: user,
          item: item
        },
        events: {
          "update": () => {
            this.getDownloadListLen()
          }
        }
      })
    },


    /*************************************************
     * PART 4  Drag and Drop
    **************************************************/
    onDrag: function (e) {
      this.isDragIn = true;
      if (this.timeout !== null) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.isDragIn = false;
        this.timeout = null;
      }, 100);

      e.stopPropagation();
      e.preventDefault();
    },
    onDrop: function (e) {
      e.stopPropagation();
      e.preventDefault();
    },


  },
  sockets: {
    person_status(data) {
      let isOnline = data.type == "OFFLINE" ? false : true
      this.myFriendsList.forEach(item => {
        if (item.token == data.share_id) {
          item.on_line = isOnline
        }
      })
    }
  }
}
</script>

