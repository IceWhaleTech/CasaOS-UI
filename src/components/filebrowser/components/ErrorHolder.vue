<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2023-02-06 19:02:31
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-06 19:33:18
 * @FilePath: /CasaOS-UI/src/components/filebrowser/components/ErrorHolder.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by IceWhale, All Rights Reserved. 
-->
<template>
    <div class="is-flex is-align-items-center is-justify-content-center is-flex-direction-column">
        <b-image :src="require('@/assets/img/sad.svg')" alt="pending" class="is-160x160 mb-2" />
        <div>{{ $t(error) }}</div>
    </div>
</template>

<script>
export default {
    name: "ErrorHolder",
    props: {
        error: {
            type: String,
            default: ""
        }
    }
}
</script>

<style lang="scss" scoped>

</style>