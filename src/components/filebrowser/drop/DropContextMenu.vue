<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2023-02-28 17:07:15
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-15 10:22:20
 * @FilePath: /CasaOS-UI/src/components/filebrowser/drop/DropContextMenu.vue
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
                    <!-- <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center has-text-danger"
                        key="drop-context2" @click="cancel" v-if="showCancel">
                        <b-icon pack="casa" icon="close" class="mr-1 is-16x16" custom-size="casa-16px" /> {{ $t(cancelText)
                        }}
                    </b-dropdown-item> -->
                    <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="drop-context1">
                        <b-upload v-model="files" multiple
                            class="is-clickable has-text-full-03 is-flex is-align-items-center" @input="activeDropUpload">
                            <b-icon pack="casa" icon="sending-files" class="mr-1 is-16x16" custom-size="casa-16px" /> {{ $t('Sending files') }}
                        </b-upload>
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
import { Events } from "./Network.js"
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
            showCancel: false,
            files: [],
            deviceId: undefined,
            sender: undefined
        }
    },

    computed: {
        close() {
            return this.item == undefined
        },
        cancelText() {
            return this.deviceId == this.sender ? 'Cancel sending' : 'Ignore'
        },
    },
    beforeDestroy() {
        this.$EventBus.$off(events.SHOW_DROP_CONTEXT_MENU);
        Events.off("peer-left", this.handlePeerleft);
    },
    mounted() {
        this.$EventBus.$on(events.SHOW_DROP_CONTEXT_MENU, this.open);
        Events.on("peer-left", this.handlePeerleft);
    },
    methods: {
        open(event) {
            this.showCancel = event.isSending
            this.deviceId = event.deviceId
            this.sender = event.sender
            this.$refs.dropDown.isActive = false
            console.log("我", this.deviceId, this.sender);
            this.$nextTick(() => {
                this.x = event.clientX
                this.y = event.clientY
                const rightOffset = window.innerWidth - event.clientX - 184
                this.horizontalPos = rightOffset > 0 ? "right" : "left"
                this.$refs.dropDown.isActive = true;
            })
        },
        cancel() {
            this.$refs.dropDown.isActive = false;
            // console.log("cancel");
            // Events.fire('send-text', {
            //     to: this.deviceId,
            //     text: 'cancel'
            // });
            console.log("我是发送者", this.deviceId == this.sender);
        },
        activeDropUpload() {
            const event = {
                deviceId: this.deviceId,
                files: this.files
            }
            this.$EventBus.$emit(events.ACTIVE_DROP_UPLOAD, event);
            this.files = []
        },
        handlePeerleft(peerId) {
            if (this.deviceId == peerId.detail) {
                this.$refs.dropDown.isActive = false
            }
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