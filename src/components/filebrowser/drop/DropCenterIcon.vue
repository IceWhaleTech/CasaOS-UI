<template>
    <div class="container">
        <div class="has-text-centered">
            <b-image :src="require('@/assets/img/drop/drop_icon.svg')" class="is-80x80 ml-auto mr-auto mb-2"></b-image>
            <p class="has-text-emphasis-02 has-text-grey-800 mb-2">{{ $t("FileDorp") }}</p>
            <p class="has-text-full-04 has-text-grey-600">{{ $t("Drop files to another device anytime,anywhere")
            }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "drop-center-icon",
}
</script>

<style lang="scss" scoped>
.container {
    position: absolute;
    width: 100%;
    height: 11.5rem;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    z-index: 5;
    display: flex;
    justify-content: center;
    pointer-events: none;
}
</style>