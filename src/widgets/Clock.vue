<template>
  <div class="widget has-text-white clock">
    <div class="time">{{timeText}}</div>
    <div class="data">{{dateText}}</div>
  </div>
</template>

<script>
import dateFormat from "dateformat";

export default {
  name: "clock",
  icon: "clock-outline",
  title: "Time",
  initShow: true,
  data() {
    return {
      timer: 0,
      timeText: "",
      dateText: ""
    }
  },
  mounted() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.updateClock()
    this.timer = setInterval(() => {
      this.updateClock()
    }, 1000)
  },
  methods: {
    updateClock() {
      var today = new Date();
      this.timeText = dateFormat(today,"HH:MM");
      this.dateText = dateFormat(today,"fullDate");
    }
  },
}
</script>

<style lang="scss">
.clock {
  font-family: Roboto;
  font-style: normal;
  font-weight: 300;
  text-align: left;
  .time {
    font-size: 2.75rem;
    line-height: 4.25rem;
    opacity: 0.9;
  }
  .data {
    line-height: 1.5rem;
    opacity: 0.9;
  }
}
</style>