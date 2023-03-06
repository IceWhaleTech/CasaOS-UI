<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2023-02-28 17:07:15
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-05 14:46:41
 * @FilePath: \CasaOS-UI-0.4.2\src\components\filebrowser\drop\DropContextMenu.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by IceWhale, All Rights Reserved. 
-->
<template>
    <div>
        <div class="drop-context-menu" :style="{ top: y + 'px', left: x + 'px' }">
            <b-dropdown aria-role="list" close-on-click ref="dropDown" id="dr1" class="file-dropdown"
                :position="'is-' + verticalPos + '-' + horizontalPos" :animation="ani" :mobile-modal="false">
                <!-- Blank Start -->
                <template>
                    <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="system-context11"
                        @click="showChangeWallpaperModal">
                        <b-icon pack="casa" icon="picture" class="mr-1"></b-icon> {{ $t('Sending files') }}
                    </b-dropdown-item>
                </template>
                <!-- Blank End -->
            </b-dropdown>
        </div>
    </div>
</template>
  
<script>
import { mixin } from '@/mixins/mixin';
import events from '@/events/events';
export default {
    name: "drop-context-menu",
    mixins: [mixin],
    data() {
        return {
            verticalPos: "bottom",
            horizontalPos: "right",
            x: Number,
            y: Number,
            ani: "fade1",
        }
    },

    computed: {
        close() {
            return this.item == undefined
        }
    },
    mounted() {
        console.log("init");
        this.$EventBus.$on(events.SHOW_DROP_CONTEXT_MENU, (data) => {
            console.log(data);
            this.open(data)
        });


    },
    methods: {
        open(event) {

            this.$refs.dropDown.isActive = false
            this.$nextTick(() => {
                this.x = event.clientX
                this.y = event.clientY
                const rightOffset = window.innerWidth - event.clientX - 184
                this.horizontalPos = rightOffset > 0 ? "right" : "left"
                this.$refs.dropDown.isActive = true;
            })

        },
        showChangeWallpaperModal() {
            this.$EventBus.$emit(events.SHOW_CHANGE_WALLPAPER_MODAL);
        }

    },
}
</script>
  
<style lang="scss" scoped>
.drop-context-menu {
    position: fixed;
    z-index: 800;
}
</style>