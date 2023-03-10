<template>
    <div class="drop-item contextmenu-canvas"
        :class="[{ 'is-floating': isFloat, 'disabled': isDisabled, 'can-upload': !uploadDisabled }, customClass]"
        :style="positionStyle" @dragenter="onDrag" @dragover="onDrag" @dragleave="onDrop" @dragend="onDrop" @drop="onDrop">

        <b-upload v-model="dropFiles" multiple drag-drop :disabled="isSelf || device.offline || uploadDisabled"
            @input="fileDroped">
            <b-tooltip :label="tipText" type="is-grey" :position="tipPosition" :always="tipActive" multilined
                size="is-small" :append-to-body="isFloat">
                <div ref="circleArea" class="circle-area" :class="{ 'drag-over': dragOver }"
                    @contextmenu.stop.prevent="showContextMenu">

                    <div class="up-layer" :class="{ 'is-online': !device.offline }">
                        <b-image :src="require(`@/assets/img/drop/${deviceIcon}.svg`)" :alt="device.name.displayName"
                            class="is-48x48 mr-0 ml-0 no-click" :class="stateClass"></b-image>
                    </div>
                    <vue-ellipse-progress :progress="progress" :size="80" :thickness="2" :emptyThickness="2" :legend="false"
                        emptyColor="#ffffff" lineMode="in-over" v-show="progress > 0"
                        animation="default 0 0"></vue-ellipse-progress>
                </div>
            </b-tooltip>
            <div ref="deviceName" class="device-name has-text-full-03">
                {{ device.name.displayName + index }}
            </div>
        </b-upload>

    </div>
</template>

<script>
import { VueEllipseProgress } from "vue-ellipse-progress";
import events from '@/events/events';
import { gsap } from 'gsap';
import CustomEase from "gsap/CustomEase";
import { Events } from "./Network.js"

export default {
    name: "drop-item",
    components: {
        VueEllipseProgress,
    },
    props: {
        isSelf: {
            type: Boolean,
            default: false
        },
        isFloat: {
            type: Boolean,
            default: true
        },
        device: {
            type: Object,
            default: () => ({

            })
        },
        customClass: {
            type: String,
            default: ''
        },
        radius: {
            type: Number,
            default: 0
        },
        center: {
            type: Object,
            default: () => ({
                x: 0,
                y: 0
            })
        },
        index: {
            type: Number,
            default: 0
        },
        showIndex: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            dropFiles: [],
            dragOver: false,
            tipActive: false,
            isDisabled: true,
            progress: 0,
            progressText: '',
            totalfiles: 0,
            receivedfiles: 0,
            uploadDisabled: false,
        }
    },
    computed: {
        positionStyle() {
            const ratio = 1.86;
            const angel = this.index < 5 ? 30 * (this.index + 1) : 45 * (this.index % 5);
            const realRadius = this.index < 5 ? this.radius : this.radius / ratio;
            return {
                left: this.center.x + realRadius / 2 * Math.cos(angel * Math.PI / 180) + 'px',
                top: this.center.y - realRadius / 2 * Math.sin(angel * Math.PI / 180) + 'px'
            }
        },
        tipPosition() {
            if (!this.isFloat) {
                return 'is-top';
            } else {
                if (this.index % 5 == 4) {
                    return "is-right";
                } else if (this.index % 5 == 0) {
                    return "is-left";
                } else {
                    return "is-right";
                }
            }
        },
        tipText() {
            if (this.isSelf) {
                return this.$t('You are using the device');
            } else {
                if (this.device.offline) {
                    return this.$t('The device is offline');
                } else {
                    if (this.progress > 0) {
                        return this.progressText;
                    } else {
                        return this.$t('Click to send the file to the device.');
                    }
                }
            }
        },
        stateClass() {
            if (this.device.offline) {
                return 'off-line';
            } else {
                if (this.isSelf) {
                    return '';
                } else {
                    return 'on-line';
                }
            }
        },
        deviceIcon() {
            if (this.isSelf) {
                return 'self';
            } else {
                const onlineStatus = this.device.offline ? '_offline' : '_online';
                return 'iPad' + onlineStatus;
            }
        }
    },
    beforeDestroy() {
        Events.off("file-progress", this.handleFileProgress);
        this.$EventBus.$off(events.ACTIVE_DROP_UPLOAD);
    },
    watch: {
        device: {
            handler: function (val) {
                this.isDisabled = val.offline;
            },
            deep: true
        }
    },

    mounted() {
        gsap.registerPlugin(CustomEase)
        const esaeFunction = CustomEase.create("custom", "M0,0 C0.237,0.368 0.128,1.112 0.498,1.112 0.714,1.112 0.813,1.005 1,1 ");

        gsap.to(this.$refs.circleArea, {
            duration: 0.66, ease: esaeFunction, scale: 1, delay: this.showIndex * 0.16, onComplete: () => {
                this.isDisabled = false;
                this.$emit('showed', this.index);
            }
        });
        gsap.from(this.$refs.deviceName, {
            duration: 0.16, ease: "none", autoAlpha: 0, delay: (this.showIndex + 1) * 0.16
        });

        Events.on("file-progress", this.handleFileProgress);


        Events.on("text-received", (e) => {
            const message = e.detail;
            const peerId = message.sender || message.recipient;
            if (this.device.id !== peerId) return;
            this.receivedfiles = message.text
        });

        Events.on("close-connection", (e) => {
            console.log(e);
            this.progress = 0;
            this.uploadDisabled = false;
        });

        this.$EventBus.$on(events.ACTIVE_DROP_UPLOAD, this.handleUpload);
    },
    methods: {
        handleUpload(e) {
            if (e.files.length == 0) return;
            if (e.deviceId == this.device.id) {
                this.fileDroped(e.files);
            }
        },
        handleFileProgress(e) {
            const progress = e.detail
            const peerId = progress.sender || progress.recipient;
            if (this.device.id !== peerId) return;
            this.totalfiles = progress.files.length;
            // this.receivedfiles = progress.filesQueue;
            this.progress = progress.progress * 100;
            this.uploadDisabled = true;
            if (this.totalfiles > 0) {
                this.receivedfiles = progress.filesQueue;
                this.progressText = this.$t("{num} files being sent", { num: this.receivedfiles });
            } else {
                this.progressText = this.$t("{num} files in transit", { num: this.receivedfiles });
            }
            if (progress.progress === 1) {
                this.progress = 0;
                this.uploadDisabled = false;
            }
        },
        showContextMenu(e) {
            if (this.device.offline || this.isSelf) return;
            e.isSending = this.uploadDisabled;
            e.deviceId = this.device.id;
            e.sender = localStorage.getItem('peerid');
            this.$EventBus.$emit(events.SHOW_DROP_CONTEXT_MENU, e);
        },
        onDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            this.dragOver = false;
            this.tipActive = false;
        },
        onDrag(e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.isSelf) {
                return;
            }
            this.dragOver = true;
        },
        fileDroped(files) {
            Events.fire('files-selected', {
                files: files,
                to: this.device.id
            });

            this.dropFiles = [];
        },
    },
}
</script>

<style lang="scss">
.no-click {
    pointer-events: none;
}

.is-floating {
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    z-index: 10;
    transform-origin: center;
}

.can-upload {
    &:hover {
        .up-layer {
            transform: scale(1.1);
        }
    }
}

.drop-item {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;

    &.disabled {
        pointer-events: none;
    }

    // transition: all 0.3s ease-in-out;
    .upload {
        .upload-draggable {
            padding: 0;
            border-width: 0;
            border-radius: 50%;
            width: 80px;
            height: 80px;

            &:hover {
                border-width: 0;
            }

            &.is-disabled {
                opacity: 1 !important;
                cursor: pointer;
            }
        }

    }

    .circle-area {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        // transition: all 0.2s ease-in-out;
        transform-origin: center;
        transform: scaleX(0) scaleY(0);




        .ep-container {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 4;
            pointer-events: none;
        }

        .up-layer {
            position: absolute;
            width: 80px;
            height: 80px;
            z-index: 2;
            left: 0;
            top: 0;
            background-color: #ffffff;
            border-radius: 50%;
            box-shadow: 0px 32px 64px -16px rgba(28, 31, 34, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.2s ease-in-out;
            border: 2px solid #ffffff;

            &.is-online {
                background-color: #ffffff !important;
            }

            .b-image-wrapper {
                &::after {
                    content: "";
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0);
                    z-index: 1;
                    right: -4px;
                    top: -4px;
                    pointer-events: none;
                }
            }

            .on-line {
                &::after {
                    background-color: rgba(40, 195, 34, 1);
                }
            }

            .off-line {
                &::after {
                    background-color: transparent;
                }
            }
        }

        &.drag-over {
            transform: scale(1.25);

            .up-layer {
                border: 2px solid #E4E8EC;
            }
        }

        &.is-self {
            .up-layer {
                border: 2px solid #E4E8EC;
            }
        }

    }



    .device-name {
        position: absolute;
        bottom: -1.75rem;
        left: 50%;
        transform: translateX(-50%);
        width: 10rem;
        text-align: center;
        // one line
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-break: break-all;
        -webkit-line-clamp: 1; //行数
        -webkit-box-orient: vertical;
    }

    input[type="file"] {
        width: 80px;
        height: 80px;
    }

    &.tablet {
        margin-bottom: 5.8125rem;
        display: flex;
        flex: 20%;
        justify-content: center;

        .device-name {
            width: 6rem;
        }
    }

    &.mobile {
        margin-bottom: 5.8125rem;
        display: flex;
        flex: 25%;
        justify-content: center;

        .device-name {
            width: 6rem;
            bottom: -3rem;
            // two line
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            word-break: normal;
            -webkit-line-clamp: 2; //行数
            -webkit-box-orient: vertical;
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>