<template>
	<div>

		<div :class="{ 'active': active }" class="is-flex list-item new-list-item" @click.prevent="$emit('open')">

			<popper ref="tip" :options="{
				placement: 'top',
				modifiers: { offset: { offset: '0,10px' } }
			}" enter-active-class="fade-enter-active" transition='fade' trigger="click">
				<div class="popper  tooltip-content dark">
					<div class="is-flex ">
						{{ $t('Start sharing your files on the local network.') }}
						<div class="is-clickable ml-1 is-flex is-align-items-center" @click.stop="hideTip">
							<b-icon icon="close-xs" pack="casa"></b-icon>
						</div>
					</div>
				</div>
				<div slot="reference" class="cover mr-2 is-flex-shrink-0 is-flex is-align-items-center none-click" s>
					<b-icon icon="share" pack="casa"></b-icon>
				</div>
			</popper>
			<div><span>{{ $t('Shared') }}</span></div>

		</div>

	</div>
</template>

<script>

const sharedInitData = "shared_init_data";
import events from '@/events/events';
import Popper from 'vue-popperjs';

export default {
	props: {
		active: {
			type: Boolean,
			default: false
		},
	},
	components: {
		Popper,
	},
	data() {
		return {}
	},
	created() {

	},
	mounted() {
		this.checkInit()
		// this.showTip()
	},

	methods: {
		async checkInit() {
			try {
				const res = await this.$api.users.getCustomStorage(sharedInitData)
				const resData = res.data.data
				if (resData) {
					if (!resData.isInit) {
						this.showTip()
					}
				} else {
					this.showTip()

				}
			} catch (error) {
				console.log(error);
			}
		},
		selectShare() {
			this.$EventBus.$emit(events.SELECT_SHARE);
			// this.$tours['myTour'].skip()
		},
		showTip() {
			setTimeout(() => {
				this.$refs.tip.doShow()
			}, 500)
		},
		hideTip() {
			this.$refs.tip.doClose()
			this.$api.users.setCustomStorage(sharedInitData, {
				isInit: true
			})
		}
	},

}
</script>

<style lang="scss" scoped>
.popper {
	background-color: #505459;
	padding: 0.35rem 0.4rem 0.35rem 0.75rem;
	box-shadow: 0px 1px 2px 1px rgba(0, 1, 0, 0.2);
	border: none;
	color: #ffffff;
	border-radius: 6px;
	font-size: 0.85rem;
	font-weight: 400;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.none-click {
	pointer-events: none;
}
</style>

<style lang="scss">
.dark .popper__arrow {
	border-color: #505459 transparent transparent transparent !important;
}
</style>
