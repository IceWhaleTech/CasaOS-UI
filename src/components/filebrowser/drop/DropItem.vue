<template>
    <div class="drop-item contextmenu-canvas" :class="[{ 'is-floating': isFloat }, customClass]"
        :style="'left:' + position.x + 'px; top:' + position.y + 'px'" @dragenter="onDrag" @dragover="onDrag"
        @dragleave="onDrop" @dragend="onDrop" @drop="onDrop">

        <b-upload v-model="dropFiles" multiple drag-drop :disabled="isSelf">
            <b-tooltip :label="tipText" type="is-grey" :position="tipPosition" :always="tipActive" multilined
                size="is-small">
                <div @contextmenu.stop.prevent="showContextMenu" class="circle-area animate__animated animate__bounceIn"
                    :class="{ 'drag-over': dragOver, 'is-self': isSelf }">

                    <div class="up-layer">
                        <b-image :src="require('@/assets/img/drop/iPad.svg')" :alt="device.name.displayName"
                            class="is-48x48 mr-0 ml-0 no-click" :class="stateClass"></b-image>
                    </div>
                    <vue-ellipse-progress :progress="progress" :size="80" :thickness="2" :emptyThickness="2" :legend="false"
                        emptyColor="#ffffff" lineMode="in-over" v-show="progress > 0"></vue-ellipse-progress>
                </div>
            </b-tooltip>
            <div class="device-name has-text-full-03 animate__animated animate__fadeIn">
                {{ device.name.displayName }}
            </div>
        </b-upload>

    </div>
</template>

<script>
import { VueEllipseProgress } from "vue-ellipse-progress";
import events from '@/events/events';
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
        progress: {
            type: Number,
            default: 0
        },
        position: {
            type: Object,
            default: () => ({
                x: 0,
                y: 0,
                first: false,
                last: false
            })
        },
        device: {
            type: Object,
            default: () => ({

            })
        },
        customClass: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dropFiles: [],
            dragOver: false,
            tipActive: false
        }
    },
    computed: {
        tipPosition() {
            if (this.position.first) {
                return "is-right";
            } else if (this.position.last) {
                return "is-left";
            } else {
                return "is-right";
            }
        },
        tipText() {
            if (this.isSelf) {
                return this.$t('You are using the device');
            } else {
                return this.$t('Click to send the file to the device.');
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
        }
    },
    methods: {
        showContextMenu(e) {
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

.drop-item {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;


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
        transition: all 0.2s ease-in-out;
        transform-origin: center;
        animation-duration: 1s;

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
                    background-color: rgba(172, 184, 195, 1);
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
        animation-delay: 0.3s;
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