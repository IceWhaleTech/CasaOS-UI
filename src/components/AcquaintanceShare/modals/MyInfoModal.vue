<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">{{$t('My Share ID')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <b-field class="mb-3 mt-5 has-text-light"  expanded>
          <b-input :value="myID" icon-right="content-copy" icon-right-clickable @icon-right-click="copyMyId"></b-input>
        </b-field>
      </div>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="flex1"></div>
      <div>
        <b-button :label="$t('Close')" type="is-primary" rounded expaned @click="$emit('close')" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import copy from 'clipboard-copy'
export default {
  data() {
      return {
          myID: ""
      }
  },
  mounted () {
      this.getMyShareId()
  },
  methods: {
    //   Get MyID
    getMyShareId(){
        this.$api.person.getMyShareId().then(res=>{
            this.myID = res.data.data
        })
    },
    //   Copy MyID to clipboard
    copyMyId() {
      copy(this.myID)
      this.$buefy.toast.open({
        message: this.$t('Copied to clipboard'),
        type: 'is-success'
      })
    }
  },
}
</script>

<style>
</style>