<!--
 * @Author: zhanghengxin ezreal.ice@icloud.com
 * @Date: 2022-09-06 14:42:24
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-06 15:31:14
 * @FilePath: /CasaOS-UI/src/components/Storage/noticeBlock.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 *
-->

<template>
	<div class="common-card">
		<div class="blur-background"></div>
		<div class="content widget _card is-flex is-flex-direction-column">
			<!-- start of section head-->
			<div class="widget-header is-flex is-flex-shrink-0">
				<div class="image is-24x24 is-flex-shrink-0">
					<img v-if="noticeData.prelude.icon" :src="noticeData.prelude.icon" alt=""/>
					<img v-else :src="require('@/assets/img/logo/casa-white.svg')"/>
				</div>
				<div class="header-title pl-2 is-flex-grow-1">
					{{ $t(noticeData.prelude.title) }}
				</div>
				<div class="is-flex-shrink-0 _close-polymorphic" @click="close">
					<b-icon custom-size="casa-24px" icon="close-xs" pack="casa"></b-icon>
				</div>
			</div>
			<!-- end of section head-->

			<!-- start of section body-->
			<!--			list-->
			<div
					v-if="noticeData.contentType === 'list'"
					class="info is-flex is-flex-direction-column is-justify-content-space-around is-flex-grow-1">
				<div class="_widget-body is-flex mr-0">
					<div class="image is-24x24 is-flex-shrink-0">
						<img v-if="!noticeData.content[Object.keys(noticeData.content)[0]].icon"
						     :src="require(`@/assets/img/logo/casa-white.svg`)"/>
						<img v-else :src="require(`@/assets/img${noticeData.content[Object.keys(noticeData.content)[0]].icon}`)"/>
					</div>
					<div class="body-title is-flex-grow-1 _nowrap ml-2">
						{{ $t(noticeData.content[Object.keys(noticeData.content)[0]].title) }}
					</div>
					<div class="has-text-left is-size-14px _nowrap">
						<span class="op65">{{ noticeData.content[Object.keys(noticeData.content)[0]].value }}</span>
					</div>
				</div>
				<div v-if="Object.keys(noticeData.content).length > 1" class="line _ml-2rem"></div>
				<div v-if="Object.keys(noticeData.content).length > 1" class="_widget-body is-flex mr-0">
					<div class="image is-24x24 is-flex-shrink-0">
						<img v-if="!noticeData.content[Object.keys(noticeData.content)[1]].icon"
						     :src="require(`@/assets/img/logo/casa-white.svg`)"/>
						<img v-else :src="require(`@/assets/img${noticeData.content[Object.keys(noticeData.content)[1]].icon}`)"/>
					</div>
					<div class="body-title is-flex-grow-1 _nowrap ml-2">
						{{ $t(noticeData.content[Object.keys(noticeData.content)[1]].title) }}
					</div>
					<p class="has-text-left is-size-14px _nowrap">
						<span class="op65">{{ noticeData.content[Object.keys(noticeData.content)[1]].value }}</span>
					</p>
				</div>
			</div>
			<div v-else-if="noticeData.contentType === 'progress'"
			     class="info is-flex is-flex-direction-column is-justify-content-center is-flex-grow-1">
				<div class="has-text-white _is-normal mb-1">
					{{ noticeData.content }}
				</div>
				<b-progress size="c-is-small"></b-progress>
			</div>
			<!-- end of section body-->

			<!-- start of section footer-->
			<div class="is-flex is-flex-direction-row-reverse is-flex-shrink-0 is-align-items-end">
				<b-button v-if="!noticeData.operate" :disabled="false" class="width" rounded size="is-small" type="is-primary"
				          @click="close">
					{{ $t('Cancel') }}
				</b-button>
				<b-button v-else-if="noticeData.operate.type === 'casaUI:eventBus'" :disabled="false" class="width" rounded
				          size="is-small"
				          type="is-primary"
				          @click="$EventBus.$emit(noticeData.operate.event, noticeData.operate.path)">
					{{ $t(noticeData.operate.title) }}
				</b-button>
				<b-button v-else :disabled="false" class="width" rounded size="is-small"
				          type="is-primary" @click="$EventBus.$emit(noticeData.operate.event, noticeData.operate.path)">
					{{ $t(noticeData.operate.title) }}
				</b-button>
				<div v-if="Object.keys(noticeData.content).length > 1 && noticeData.contentType === 'list'"
				     class="is-flex-grow-1 footer-hint">
					{{ $t('{num} items', {num: Object.keys(noticeData.content).length}) }}
				</div>
			</div>
			<!-- end of section footer-->
		</div>
	</div>
</template>

<script>

import StorageManagerPanel from "@/components/Storage/StorageManagerPanel.vue";
import DiskLearnMore from "@/components/Storage/DiskLearnMore.vue";

export default {
	name: "notice-block",
	props: {
		noticeData: {
			type: Object,
			default: () => {
				return {
					prelude: {
						title: 'Found a New USB Drive',
						icon: '',
					},
					content: {
						123: {
							title: 'Found a new drive',
							icon: 'mdi-usb',
							color: 'is-primary',
							path: '/storage',
							uuid: '123',
							value: '100G/1000G'
						},
						345: {
							title: 'Found a new drive',
							icon: 'mdi-usb',
							color: 'is-primary',
							path: '/storage',
							uuid: '456',
							value: '100G/1001G'
						},
					},
					contentType: 'list',
					operate: {
						type: 'casaUI:eventBus',
						event: 'openFile',
						title: 'More',
						path: '/storage',
						icon: 'mdi-arrow-right',
					},
				};
			},
		},
		noticeType: {
			type: String,
			default: 'usb',
		},
	},
	data() {
		return {}
	},
	inject: ['homeShowFiles'],
	created() {
		this.$EventBus.$on('casaUI:openInFiles', (path) => {
			this.homeShowFiles(path);
		});
		this.$EventBus.$on('casaUI:openInStorageManager', () => {
			this.$buefy.modal.open({
				parent: this,
				component: StorageManagerPanel,
				hasModalCard: true,
				customClass: 'storage-modal',
				trapFocus: true,
				canCancel: [],
				scroll: "keep",
				animation: "zoom-in",
			})
		});
		this.$EventBus.$on('casaUI:openDiskLearnMore', () => {
			this.$buefy.modal.open({
				parent: this,
				component: DiskLearnMore,
				hasModalCard: true,
				customClass: 'storage-modal',
				trapFocus: true,
				canCancel: [],
				scroll: "keep",
				animation: "zoom-in",
			})
		});
	},
	beforeDestroy() {
	},
	computed: {},

	methods: {
		close() {
			if (this.noticeData.contentType === 'progress') {
				this.$emit('deleteNotice', this.noticeData, this.noticeType);
				return
			}
			let promises = [];
			for (const contentKey in this.noticeData.content) {
				promises.push(this.$api.users.delLetter(this.noticeData.content[contentKey].messageUUID));
			}
			Promise.all(promises).then(() => {
				this.$emit('deleteNotice', this.noticeData, this.noticeType);
			});
		},
		TODO() {
			// this.$refs.mySwiper.$swiper.slideNext()
		},
	}
}
</script>

<style lang="scss" scoped>
._card {
	height: 11.5rem;

	.widget-header {
		.header-title {
			font-family: 'Roboto';
			font-style: normal;
			font-weight: 500;
			font-size: 1.125rem;
			line-height: 1.75rem;
			color: hsla(208, 16%, 96%, 1);
		}
	}

	._widget-body {
		align-items: center;
		position: relative;

		.body-title {
			font-family: 'Roboto';
			font-style: normal;
			font-weight: 500;
			font-size: 14px;
			line-height: 20px;
			color: hsla(208, 16%, 96%, 1);
		}
	}

	.footer-hint {
		height: 16px;
		font-family: 'Roboto';
		font-style: normal;
		font-weight: 400;
		font-size: 0.75rem;
		line-height: 1.125rem;
	}
}

.content {
	z-index: 10;
	padding: 1rem;
	padding-left: 1.25rem;
	padding-right: 1.25rem;

	.info {
		margin: 1.5rem 2rem;

		._ml-2rem {
			margin-left: 2rem;
		}

		.line {
			width: auto;
			border-top: 1px solid rgba(255, 255, 255, 0.1);
		}
	}
}

._nowrap {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

._close-polymorphic:hover {
	cursor: pointer;
}

::v-deep .progress.c-is-small {
	height: 0.5rem !important;
	background-image: linear-gradient(to right, hsla(215, 100%, 60%, 1) 30%, hsla(0, 0%, 100%, 0.4) 30%);
	border-radius: 0.5rem;
}
</style>
