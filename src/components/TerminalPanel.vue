<template>
  <div class="modal-card">

    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="close-container"><button type="button" class="delete" @click="$emit('close')" /></div>
      <div class="flex1">
        <!-- <b-tabs type="is-toggle">
          <b-tab-item label="Terminal" >
            <terminal-card :wsUrl="wsUrl"></terminal-card>
          </b-tab-item>
          <b-tab-item label="Logs" ></b-tab-item>
        </b-tabs> -->
        <terminal-card  ></terminal-card>
      </div>
      
      
    </section>
    <!-- Modal-Card Body End -->

    <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
  </div>
</template>

<script>
import TerminalCard from '@/components/TerminalCard.vue';
export default {
  name: 'terminal-panel',
  components: {
    TerminalCard
  },
  data() {
    return {
      isLoading: false,
      wsUrl: (process.env.NODE_ENV === "'dev'") ? `ws://${this.$store.state.devIp}:8089/v1/sys/wsssh?token=${this.$store.state.token}&user=root&password=zimaboard` : `ws://${document.location.host}/v1/sys/wsssh?token=${this.$store.state.token}`
    }
  },
  mounted: function () {

  }
}
</script>

<style>
</style>
