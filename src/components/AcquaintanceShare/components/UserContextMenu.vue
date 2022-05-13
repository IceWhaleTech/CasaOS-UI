<template>
  <div class="action-btn context-menu" :style="{top:y + 'px',left:x+'px'}">
    <b-dropdown aria-role="list" :close-on-click="false" ref="dropDown" id="dr1" class="file-dropdown" :position="'is-'+verticalPos+'-'+horizontalPos" :animation="ani" :mobile-modal="false" append-to-body>
      <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="user-context0" @click="$refs.dropDown.toggle();copyId()">
        <b-icon icon="content-copy" class="mr-1" custom-size="mdi-18px"></b-icon>{{ $t('Copy friend\'s ID') }}
      </b-dropdown-item>
      <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="user-context1" @click="$refs.dropDown.toggle();showEditFriendModal()">
        <b-icon icon="account-edit-outline" class="mr-1" custom-size="mdi-18px"></b-icon>{{ $t('Edit remark') }}
      </b-dropdown-item>
      <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="user-context2" @click="$refs.dropDown.toggle();blockFriend()">
        <b-icon icon="account-cancel-outline" class="mr-1" custom-size="mdi-18px"></b-icon>{{ editUser.block?$t('Unblock this friend'):$t('Block this friend') }}
      </b-dropdown-item>
      <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="user-context3" @click="$refs.dropDown.toggle();deleteFriend()">
        <b-icon icon="account-remove-outline" class="mr-1" custom-size="mdi-18px"></b-icon>{{ $t('Delete friend') }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import EditFriendModal from '../modals/EditFriendModal.vue'
import copy from 'clipboard-copy'
export default {
  data() {
    return {
      verticalPos: "bottom",
      horizontalPos: "right",
      isConfirmed: false,
      x: Number,
      y: Number,
      showDetial: false,
      ani: "fade1",
      editUser: {},

    }
  },

  methods: {
    //   Copy ID to clipboard
    copyId() {
      copy(this.editUser.token)
      this.$buefy.toast.open({
        message: this.editUser.token + ' ' + this.$t('has been copied to the clipboard'),
        type: 'is-success'
      })
    },

    open(event, user) {
      let targetClasses = event.target.getAttribute('class')
      let bounced = targetClasses === null ? false : targetClasses.includes('dropdown-menu')
      if (!bounced) {
        this.editUser = user
        this.$refs.dropDown.isActive = false
        this.$nextTick(() => {
          this.x = event.clientX
          this.y = event.clientY
          const rightOffset = window.innerWidth - event.clientX - 184
          this.horizontalPos = rightOffset > 0 ? "right" : "left"
          this.$refs.dropDown.isActive = true;
        })
      }
    },

    // Block Friend
    blockFriend() {
      let block = !this.editUser.block
      let shareId = this.editUser.token
      this.$api.person.blockFriend(shareId, block).then(res => {
        let message = ""
        let type = ""
        if (res.data.success == 200) {
          if (block) {
            message = this.$t('Blocked this friend')
          } else {
            message = this.$t('Unblocked this friend')
          }
          type = "is-success"
          this.editUser.block = block
        } else {
          message = this.$t('Blocked failed')
          type = "is-danger"
        }
        this.$buefy.toast.open({
          message: message,
          type: type
        })
      })
    },
    // Delete Friend
    deleteFriend() {

      let shareId = this.editUser.token
      this.$api.person.deleteFriend(shareId).then(res => {
        let message = ""
        let type = ""
        if (res.data.success == 200) {
          message = this.$t('Deleted this friend')
          type = "is-success"
          this.$emit("reloadFriendList")
          this.$refs.dropDown.isActive = false
        } else {
          message = this.$t('Delete failed')
          type = "is-danger"
        }
        this.$buefy.toast.open({
          message: message,
          type: type
        })
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
          user: this.editUser
        },
        events: {
          "reloadFriendList": () => {
            this.$emit("reloadFriendList")
          }
        }
      })
    }
  },
}
</script>

<style>
</style>