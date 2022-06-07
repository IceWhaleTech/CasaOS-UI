<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal" v-if="!isWelcomeShow">{{$t('Share Initialization Wizard')}}</h3>
      </div>

    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div v-if="isWelcomeShow">
        <h3 class="title is-3 has-text-centered mt-2 mb-5">{{ $t('Welcome to CasaConnect') }}</h3>
        <h4 class="is-size-5 has-text-centered mb-5">
          {{ $t('With this feature you can easily create peer-to-peer file sharing transfers between you and your friends.') }}<br>
          {{ $t('You need to do some simple setup.') }}
        </h4>
        <div class="buttons is-justify-content-center mb-0">
          <b-button rounded type="is-primary" @click="isWelcomeShow = false">
            {{ $t(`Let's Start`) }}
          </b-button>
        </div>
      </div>
      <b-steps v-model="activeStep" :animated="false" v-else>
        <b-step-item step="1" :label="$t('Share-Account')" icon="account">
          <div class="block">
            <ValidationObserver ref="accountValid">
              <ValidationProvider rules="required" name="nickname" v-slot="{ errors, valid }">
                <b-field class="mb-3 mt-5 has-text-light" :label="$t('Nickname')" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
                  <b-input v-model="nickname" :placeholder="$t('Please enter your nickname.')"></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider rules="required" name="description" v-slot="{ errors, valid }">
                <b-field class="mb-3 mt-5 has-text-light" :label="$t('Description')" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
                  <b-input v-model="description" :placeholder="$t('Please enter your description.')"></b-input>
                </b-field>
              </ValidationProvider>
            </ValidationObserver>
          </div>
        </b-step-item>

        <b-step-item step="2" :label="$t('Share-Setting')" icon="cog">
          <div class="block">
            <div class="is-flex is-align-items-center">
              <div class="is-flex-grow-1">
                <h4 class="title is-size-65">{{ $t('Shared folders') }}</h4>
              </div>
              <div>
                <b-button type="is-primary" size="is-small" :label="$t('Add')" @click="showFolderModal('add','/DATA')" rounded />
              </div>
            </div>
            <b-field class="mb-3 mt-3 has-text-light" expanded type="is-danger">
              <div class="folder-container scrollbars-light-auto">
                <div class="folder-item" v-for="(item,index) in shareFolders" :key="item+index">
                  <div class="cover is-flex-shrink-0">
                    <div class="folder-cover">
                      <img alt="folder" :src="require(`@/assets/img/filebrowser/folder-default.svg`)" class="folder-icon" />
                    </div>
                  </div>
                  <div class="one-line is-flex-grow-1">
                    {{item}}
                  </div>
                  <div class="action mr-2">
                    <div @click="showFolderModal('edit',item,index)">
                      <b-icon icon="pencil" size="is-small" class="is-clickable"></b-icon>
                    </div>

                  </div>
                  <div class="action mr-2">
                    <div @click="deleteShareFolderItem(item)">
                      <b-icon icon="close" size="is-small" class="is-clickable"></b-icon>
                    </div>

                  </div>
                </div>
              </div>

            </b-field>

            <b-field class="mb-3 mt-3 has-text-light" :label="$t('Default download path')" expanded>
              <b-input v-model="savePath" expanded readonly></b-input>
              <p class="control">
                <b-button type="is-primary" :label="$t('Change')" @click="showFileModal" />
              </p>
            </b-field>
          </div>
        </b-step-item>

        <!-- <b-step-item step="3" :label="$t('Share-Recommend')" icon="server-network" disabled>
          <h3 class="subtitle has-text-centered is-6 mt-2 mb-0">{{ $t('We have prepared some public servers.') }}</h3>
          <h3 class="subtitle has-text-centered is-6 mt-0 mb-5">{{ $t('You need to choose one of them to start with.') }}</h3>

          <div class="columns mb-0">
            <div class="column is-flex  is-justify-content-center" v-for="(item,index) in publicServer" :key="'server'+index">
              <div class="is-flex is-flex-direction-column is-align-items-center avator_selector" :class="{'active':choosePublicServer.indexOf(item.share_id) != -1}" @click="chooseServer(item.share_id)">
                <div class="avatar size-60 is-flex-shrink-0 mt-2">
                  <avatar :username="item.nick_name" :size="60"></avatar>
                  <div class="check">
                    <b-icon icon="check" custom-size="mdi-36px">
                    </b-icon>
                  </div>
                </div>
                <div class="is-size-65 mt-2 mb-2 one-line word has-text-weight-medium">
                  {{item.nick_name}}
                </div>
              </div>
            </div>
          </div>
        </b-step-item> -->

        <b-step-item step="4" :label="$t('Share-Finish')" icon="check" disabled>
          <h1 class="title has-text-centered is-3 mt-6">{{ $t('Share is ready!') }}</h1>
          <h3 class="subtitle has-text-centered is-5 mt-2 mb-0">{{ $t('You have completed the initial setup.') }}</h3>
          <h3 class="subtitle has-text-centered is-5 mt-0 mb-6">{{ $t('Next you can follow the use guide to learn how to use it.') }}</h3>
        </b-step-item>

        <template #navigation="{previous, next}">
          <div class="buttons is-justify-content-center mb-0">
            <b-button rounded type="is-primary" v-if="!previous.disabled && !next.disabled" @click.prevent="previous.action">
              {{ $t('Prev') }}
            </b-button>
            <b-button rounded type="is-primary" v-if="!next.disabled" @click.prevent="nextStep(next.action)" :loading="isLoading">
              {{ $t('Next') }}
            </b-button>
            <b-button rounded type="is-primary" v-if="next.disabled" @click.prevent="close">
              {{ $t('Share-Go') }}
            </b-button>
          </div>

        </template>
      </b-steps>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">

    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import "@/plugins/vee-validate";
import smoothReflow from 'vue-smooth-reflow'
import FilePanel from '@/components/fileList/FilePanel.vue'
import remove from 'lodash/remove'
// import Avatar from 'vue-avatar'
export default {
  mixins: [smoothReflow],
  props: {
    myInfo: {
    },
  },
  data() {
    return {
      isWelcomeShow: true,
      isLoading: false,
      activeStep: 0,
      step2Message: "",
      step3Message: "",
      nickname: "",
      description: "",
      shareFolders: [],
      savePath: "/DATA/Downloads",
      publicServer: [],
      choosePublicServer: []
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    // Avatar
  },
  watch: {
    shareFolders(val) {
      if (val.length > 0) {
        this.step2Message = ""
      }
    }
  },
  created() {
    console.log(this.myInfo);
    this.nickname = this.myInfo.user_name
    this.description = this.myInfo.description
    this.getPublicServers()
  },

  mounted() {
    //Smooth 
    this.$smoothReflow({
      el: '.modal-card',
      property: ['height', 'width'],
      transition: 'height .25s ease, width .75s ease-out'
    });
  },
  methods: {
    /**
     * @description: Validate form async
     * @param {Object} ref ref of component
     * @return {Boolean} 
     */
    async checkValid(ref) {
      let isValid = await ref.validate()
      return isValid
    },

    getShareFolders() {

    },
    chooseServer(id) {
      if (this.choosePublicServer.indexOf(id) == -1) {
        this.choosePublicServer.push(id)
      } else {
        this.choosePublicServer = remove(this.choosePublicServer, (o) => {
          return o != id
        })
      }
    },

    getPublicServers() {
      this.$api.person.publicServer().then(res => {
        if (res.data.success == 200) {
          console.log(res.data.data);
          this.publicServer = res.data.data
        }
      })
    },

    deleteShareFolderItem(item) {
      this.shareFolders = remove(this.shareFolders, (o) => {
        return o != item
      })
    },

    close() {
      this.$emit("close");
      this.$emit("complete")
    },
    nextStep(next) {
      switch (this.activeStep) {
        case 0:
          this.checkValid(this.$refs.accountValid).then(val => {
            if (val) {
              this.isLoading = true
              this.$api.user.personInfo(this.nickname, this.description).then(res => {
                this.isLoading = false
                if (res.data.success == 200) {
                  next()
                }
              })
            }
          })
          break;
        case 1:
          if (this.shareFolders.length == 0) {
            this.$buefy.toast.open({
              message: this.$t('Need to add at least one directory'),
              type: "is-danger"
            })
          } else {
            this.isLoading = true
            this.$api.person.updateShareList(this.shareFolders).then(res => {
              if (res.data.success == 200) {
                this.$api.person.updateSavePath(this.savePath).then(res => {
                  this.isLoading = false
                  if (res.data.success == 200) {
                    next()
                  } else {

                    this.$buefy.toast.open({
                      message: res.data.message,
                      type: "is-danger"
                    })
                  }
                })
              } else {
                this.isLoading = false
                this.$buefy.toast.open({
                  message: res.data.message,
                  type: "is-danger"
                })
              }
            })
          }
          break;
        case 2:
          if (this.choosePublicServer.length == 0) {
            this.$buefy.toast.open({
              message: this.$t('At least one must be selected.'),
              type: "is-danger"
            })
          } else {
            let joinString = this.choosePublicServer.join(",")
            this.isLoading = true
            this.$api.person.addFriend(joinString).then(res => {
              let message = ""
              let type = ""
              this.isLoading = false
              if (res.data.success == 200) {
                next()
              } else {
                message = res.data.message
                type = "is-danger"
              }
              this.$buefy.toast.open({
                message: message,
                type: type
              })
            })
          }
          break;
        default:
          break;
      }
    },

    showFolderModal(action, initPath, itemIndex = 0) {
      this.$buefy.modal.open({
        parent: this,
        component: FilePanel,
        hasModalCard: true,
        customClass: 'fileModal',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        events: {
          'updatePath': (e) => {
            if (action == 'add') {
              if (this.shareFolders.indexOf(e) == -1) {
                this.shareFolders.push(e)
              }
            } else if (action == "edit") {
              this.shareFolders[itemIndex] = e
              this.$forceUpdate()
            }
          }
        },
        props: {
          initPath: initPath,
          rootPath: "/DATA",
          showFile: false
        }
      })
    },

    showFileModal() {
      this.$buefy.modal.open({
        parent: this,
        component: FilePanel,
        hasModalCard: true,
        customClass: 'fileModal',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        events: {
          'updatePath': (e) => {
            this.savePath = e
          }
        },
        props: {
          initPath: this.savePath,
          rootPath: this.rootPath,
          showFile: false
        }
      })
    },


  },
}
</script>

<style>
</style>