<!--
 * @Author: zhanghengxin ezreal.ice@icloud.com
 * @Date: 2022-09-06 14:42:24
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-12 18:31:45
 * @FilePath: \CasaOS-UI-0.4.2\src\components\noticBlock\noticeBlock.vue
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
					<img v-if="noticeData?.icon" :src="noticeData.icon" alt=""/>
					<img v-else :src="require('@/assets/img/logo/casa-white.svg')" alt=""/>
				</div>
				<div class="header-title pl-2 is-flex-grow-1">
					{{ $t(noticeData.title) }}
				</div>
				<div class="is-flex-shrink-0 _close-polymorphic" style="height: 1.5rem" @click="close">
					<b-icon custom-size="casa-24px" icon="close-xs-outline" pack="casa"></b-icon>
				</div>
			</div>
			<!-- end of section head-->

			<!-- start of section body-->
			<!-- list-->
			<listDetail :noticeData="noticeData">

			</listDetail>


			<!-- progress-->
			<progressDetail :noticeData="noticeData">

			</progressDetail>

			<infoDetail :noticeData="noticeData">

			</infoDetail>
			<!-- end of section body-->


			<!-- start of section footer-->
			<div :style="{height: '24px'}"
				 class="is-flex is-flex-direction-row-reverse is-flex-shrink-0 is-align-items-end">
				<template v-if="noticeData.contentType !== 'progress'">
					<b-button v-if="!noticeData.operate" :disabled="false" class="width" rounded size="is-small"
							  type="is-primary"
							  @click="close">
						{{ $t('Cancel') }}
					</b-button>
					<b-button
					v-else-if="noticeData.operate.type === 'casaUI:eventBus'"
					:disabled="false" class="width" rounded size="is-small"
					type="is-primary" @click="eventBus">
						{{ $t(noticeData.operate.title) }}
					</b-button>
				</template>
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
import listDetail     from './ViewType/listDetail.vue'
import progressDetail from './ViewType/progressDetail.vue'
import InfoDetail     from "./ViewType/infoDetail.vue";

export default {
	name: "notice-block",
	components: {
		InfoDetail,
		listDetail,
		progressDetail
	},
	props: {
		noticeData: {
			type: Object,
			// default: () => {
			// 	return {
			// 			title: 'Found a New USB Drive',
			// 			icon: '',
			// 		content: {
			// 			123: {
			// 				title: 'Found a new drive',
			// 				icon: 'mdi-usb',
			// 				color: 'is-primary',
			// 				path: '/storage',
			// 				uuid: '123',
			// 				value: '100G/1000G'
			// 			},
			// 			345: {
			// 				title: 'Found a new drive',
			// 				icon: 'mdi-usb',
			// 				color: 'is-primary',
			// 				path: '/storage',
			// 				uuid: '456',
			// 				value: '100G/1001G'
			// 			},
			// 		},
			// 		contentType: 'list',
			// 		operate: {
			// 			type: 'casaUI:eventBus',
			// 			event: 'openFile',
			// 			title: 'More',
			// 			path: '/storage',
			// 			icon: 'mdi-arrow-right',
			// 		},
			// 	};
			// },
		},
		noticeType: {
			type: String,
			default: 'usb',
		},
	},
	data() {
		return {}
	},
	// inject: ['homeShowFiles'],
	created() {

	},
	beforeDestroy() {
	},
	computed: {},

	methods: {
		close() {
			this.$messageBus('youshouldknow_cardclose');

			if (this.noticeData.contentType !== 'list') {
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
		eventBus() {
			this.$messageBus('youshouldknow_cardaction');
			if (this.noticeData.operate.event.includes("casaUI:")) {
				this.$EventBus.$emit(this.noticeData.operate.event, this.noticeData.operate.path);
			} else {
				this.$messageBus(this.noticeData.operate.event, {...this.noticeData.payload})
			}
			this.close();
		}
	}
}
</script>

<style lang="scss" scoped>
._card {
	height: 10rem;

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
	padding-top: 1.125rem;
	padding-bottom: 1rem;
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

._close-polymorphic:hover {
	cursor: pointer;
}
</style>
