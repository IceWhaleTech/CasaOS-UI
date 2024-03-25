<template>
	<div class="common-card">
		<div class="blur-background"></div>
		<div class="content widget _card is-flex is-flex-direction-column">
			<!-- start of section head-->
			<div class="widget-header is-flex is-flex-shrink-0">
				<div class="image is-24x24 is-flex-shrink-0">
					<img v-if="noticeData.prelude.icon" :src="noticeData.prelude.icon" alt=""/>
					<img v-else :src="require('@/assets/img/logo/casa-white.svg')" alt=""/>
				</div>
				<div class="header-title pl-2 is-flex-grow-1">
					{{ $t(noticeData.prelude.title) }}
				</div>
				<div class="is-flex-shrink-0 _close-polymorphic" style="height: 1.5rem" @click="close">
					<b-icon custom-size="casa-24px" icon="close-outline" pack="casa"></b-icon>
				</div>
			</div>
			<!-- end of section head-->

			<!-- start of section body-->
			<!-- list-->
			<div
				v-if="noticeData.contentType === 'list'"
				class="info is-flex is-flex-direction-column is-justify-content-space-around is-flex-grow-1">
				<div class="_widget-body is-flex mr-0">
					<div class="image is-24x24 is-flex-shrink-0">
						<img v-if="!noticeData.content[Object.keys(noticeData.content)[0]].icon"
							 :src="require(`@/assets/img/logo/casa-white.svg`)" alt=""/>
						<img v-else
							 :src="require(`@/assets/img${noticeData.content[Object.keys(noticeData.content)[0]].icon}`)"
							 alt=""/>
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
							 :src="require(`@/assets/img/logo/casa-white.svg`)" alt=""/>
						<img v-else
							 :src="require(`@/assets/img${noticeData.content[Object.keys(noticeData.content)[1]].icon}`)"
							 alt=""/>
					</div>
					<div class="body-title is-flex-grow-1 _nowrap ml-2">
						{{ $t(noticeData.content[Object.keys(noticeData.content)[1]].title) }}
					</div>
					<p class="has-text-left is-size-14px _nowrap">
						<span class="op65">{{ noticeData.content[Object.keys(noticeData.content)[1]].value }}</span>
					</p>
				</div>
			</div>
			<!-- progress -->
			<div v-else-if="noticeData.contentType === 'progress'"
				 class="info is-flex is-flex-direction-column is-justify-content-center is-flex-grow-1">
				<div :title="noticeData.content.text"
					 class="has-text-grey-200 _is-normal mb-2 is-flex-wrap-nowrap _nowrap">
					{{ noticeData.content.text }}
				</div>
				<b-progress :value="noticeData.content.value" format="percent" size="c-is-small" type="is-primary"></b-progress>
			</div>
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
					<b-button v-else-if="noticeData.operate.type === 'casaUI:eventBus'" :disabled="false" class="width"
							  rounded
							  size="is-small"
							  type="is-primary"
							  @click="eventBus">
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
export default {
	name: "notice-block",
	props: {
		noticeData: {
			type: Object
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

	},
	beforeDestroy() {
	},
	computed: {},

	methods: {
		close() {
			this.$messageBus('youshouldknow_cardclose');

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
		eventBus() {
			this.$messageBus('youshouldknow_cardaction');
			this.$EventBus.$emit(this.noticeData.operate.event, this.noticeData.operate.path)
		}
	}
}
</script>

<style lang="scss" scoped>
._card {
	height: 10rem;

	.widget-header {
		.header-title {
			font-family: $family-sans-serif;
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
			font-family: $family-sans-serif;
			font-style: normal;
			font-weight: 500;
			font-size: 14px;
			line-height: 20px;
			color: hsla(208, 16%, 96%, 1);
		}
	}

	.footer-hint {
		height: 16px;
		font-family: $family-sans-serif;
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
		line-height: 1.5em;
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

._fixed-height {
	height: 1.25rem;
}

._close-polymorphic:hover {
	cursor: pointer;
}

::v-deep .progress.c-is-small {
	height: 0.75rem !important;
	border-radius: 0.5rem;
}
</style>
