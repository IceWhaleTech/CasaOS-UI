<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2023-03-03 15:03:34
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-06 14:38:29
 * @FilePath: /CasaOS-UI/src/components/filebrowser/drop/DropAddButton.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by IceWhale, All Rights Reserved. 
-->
<template>
    <div class="drop-button" :style="positionStyle" :class="{ 'is-floating': isFloat }">
        <b-dropdown :position="tipPosition" class="drop-tips" :style="cssVariables" ref="drop" :mobile-modal="false">
            <template #trigger>
                <div ref="circleArea" class="circle-area is-clickable">
                    <div class="up-layer">
                        <b-image :src="require(`@/assets/img/drop/add_btn.svg`)" class="mr-0 ml-0 no-click is-unselectable"
                            :class="iconSize"></b-image>
                    </div>
                </div>
            </template>

            <b-dropdown-item aria-role="menu-item" custom paddingless>
                <div class="p-3">
                    <div class="close-button is-absolute" @click="closeDrop">
                        <b-icon pack="casa" icon="close" size="is-small"></b-icon>
                    </div>
                    <h6 class="has-text-title-06 mr-5 mb-3">{{ $t('Access the following address with another device') }}
                    </h6>
                    <div class="drop-grey-bg">
                        <p class="has-text-full-03">{{ $t('Local Area Network Access') }}<br>
                            <span class="has-text-primary has-text-emphasis-03">{{ $baseURL }}</span>
                        </p>
                    </div>

                </div>
            </b-dropdown-item>
        </b-dropdown>

    </div>
</template>

<script>
export default {
    name: "drop-add-button",
    props: {
        index: {
            type: Number,
            default: 0
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
        isFloat: {
            type: Boolean,
            default: true
        },
    },
    computed: {
        tipPosition() {
            if (this.index < 10) {
                if (this.index % 5 == 4) {
                    return "is-bottom-right";
                } else if (this.index % 5 == 0) {
                    return "is-bottom-left";
                } else {
                    return "is-bottom-right";
                }
            } else {
                return "is-top-left";
            }
        },
        positionStyle() {
            if (this.index < 10) {
                const ratio = 1.86;
                const angel = this.index < 5 ? 30 * (this.index + 1) : 45 * (this.index % 5);
                const realRadius = this.index < 5 ? this.radius : this.radius / ratio;
                return {
                    left: this.center.x + realRadius / 2 * Math.cos(angel * Math.PI / 180) + 'px',
                    top: this.center.y - realRadius / 2 * Math.sin(angel * Math.PI / 180) + 'px'
                }
            } else {
                return {
                    right: this.isFloat ? '-28px' : '32px',
                    bottom: '48px',
                    width: '48px',
                    height: '48px',
                    position: 'fixed',
                }
            }
        },
        iconSize() {
            return this.index < 10 ? "is-36x36" : "is-24x24";
        },
        cssVariables() {
            return {
                "--item-size": this.index < 10 ? "80px" : "48px",
            }
        },
    },

    created() {
        console.log(this.index);

    },
    mounted() {
        this.$refs.drop.isActive = true;
    },
    methods: {
        closeDrop() {
            console.log("close");
            this.$refs.drop.isActive = false;
        }
    },
}
</script>

<style lang="scss" >
.drop-button {
    position: absolute;
    z-index: 100;
    border-radius: 50%;
    box-shadow: 0px 16px 32px -8px rgba(28, 31, 34, 0.12);
    background-color: #FFFFFF;
    &.is-floating {
        .circle-area {
            border: 1px solid transparent;
        }
    }

    .close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 1rem;
        right: 1rem;
        top: 1rem;
        border-radius: 2px;
        cursor: pointer;

        &:hover {
            background-color: rgba(0, 0, 0, 0.04);

        }
    }

    .circle-area {
        position: relative;
        width: var(--item-size);
        height: var(--item-size);
        border-radius: 50%;
        transition: all 0.3s;
        border: 1px solid #E4E8EC;

        &:hover {
            background-color: #F3F5F6;
            border: 1px solid transparent;
            transform: scale(1.1);
        }

        .up-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: var(--item-size);
            height: var(--item-size);
            display: flex;
            justify-content: center;
            align-items: center;

            .no-click {
                pointer-events: none;
            }
        }
    }

    .drop-tips {
        &.is-top-left {
            .dropdown-menu {
                margin-bottom: 1rem;

                .dropdown-content {
                    &::before {
                        bottom: -9px;
                        right: calc(var(--item-size) / 2 - 5px);
                        border-bottom: 5px solid transparent;
                        border-top: 5px solid #FFFFFF;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                        z-index: 12;
                    }

                    &::after {
                        bottom: -12px;
                        right: calc(var(--item-size) / 2 - 6px);
                        border-bottom: 6px solid transparent;
                        border-top: 6px solid #E4E8EC;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        z-index: 10
                    }
                }
            }
        }

        &.is-top-right {
            .dropdown-menu {
                margin-bottom: 1rem;

                .dropdown-content {
                    &::before {
                        bottom: -9px;
                        left: calc(var(--item-size) / 2 - 5px);
                        border-bottom: 5px solid transparent;
                        border-top: 5px solid #FFFFFF;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                        z-index: 12;
                    }

                    &::after {
                        bottom: -12px;
                        left: calc(var(--item-size) / 2 - 6px);
                        border-bottom: 6px solid transparent;
                        border-top: 6px solid #E4E8EC;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        z-index: 10
                    }
                }
            }
        }

        &.is-bottom-left {
            .dropdown-menu {
                margin-top: 1rem;

                .dropdown-content {
                    &::before {
                        top: -5px;
                        right: calc(var(--item-size) / 2 - 5px);
                        border-bottom: 5px solid #FFFFFF;
                        border-top: 5px solid transparent;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                        z-index: 12;
                    }

                    &::after {
                        top: -8px;
                        right: calc(var(--item-size) / 2 - 6px);
                        border-bottom: 6px solid #E4E8EC;
                        border-top: 6px solid transparent;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        z-index: 10
                    }
                }
            }
        }

        &.is-bottom-right {
            .dropdown-menu {
                margin-top: 1rem;

                .dropdown-content {
                    &::before {
                        top: -5px;
                        left: calc(var(--item-size) / 2 - 5px);
                        border-bottom: 5px solid #FFFFFF;
                        border-top: 5px solid transparent;
                        border-left: 5px solid transparent;
                        border-right: 5px solid transparent;
                        z-index: 12;
                    }

                    &::after {
                        top: -8px;
                        left: calc(var(--item-size) / 2 - 6px);
                        border-bottom: 6px solid #E4E8EC;
                        border-top: 6px solid transparent;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        z-index: 10
                    }
                }
            }
        }

        .dropdown-menu {
            min-width: 17.5rem;

            .dropdown-content {
                border: 1px solid #E4E8EC;
                border-radius: 6px;
                padding-top: 0;
                padding-bottom: 0;

                &::before {
                    content: '';
                    display: block;
                    box-sizing: content-box;
                    width: 0px;
                    height: 0px;
                    position: absolute;
                    padding: 0;
                }


                &::after {
                    content: '';
                    display: block;
                    box-sizing: content-box;
                    width: 0px;
                    height: 0px;
                    position: absolute;
                    padding: 0;
                }
            }
        }

        .drop-grey-bg {
            background: #F9FAFB;
            border-radius: 4px;
            padding: 0.5rem 0.75rem;
        }
    }
}
</style>