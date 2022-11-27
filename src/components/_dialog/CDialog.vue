<!--
  - Copyright (c) 2022. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  - Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
  - Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
  - Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
  - Vestibulum commodo. Ut rhoncus gravida arcu.
  -->

<template>
  <b-modal v-model="show" width="20rem" scroll="clip">
    <b-message>
      <template #header>
        <img alt="pending" :src="require('@/assets/img/widgets/swiper-right.svg')"/>
      </template>
    </b-message>
  </b-modal>
</template>

<script>
export default {
  name: "CDialog.vue"
}
</script>

<style scoped>

</style>
