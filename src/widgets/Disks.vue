<template>
	<div>
		<!-- Disk Info Start -->
		<div class="widget has-text-white disk is-relative">
			<div class="blur-background"></div>
			<div class="widget-content">
				<!-- Header Start -->
				<div class="widget-header is-flex">
					<div class="widget-title is-flex-grow-1">
						{{ $t('Storage') }}
					</div>
					<div class="widget-icon-button is-flex-shrink-0" @click="showDiskManagement">
						<b-icon icon="settings-outline" pack="casa" size="is-20"></b-icon>
					</div>
				</div>
				<!-- Header End -->
				<div class="columns is-mobile is-multiline pt-2 ">
					<div class="column is-full pb-0">
						<div class="is-flex is-align-items-center">
							<div class="header-icon">
								<b-image :src="require('@/assets/img/storage/storage.svg')" class="is-64x64"></b-image>
							</div>
							<div class="ml-2 is-flex-grow-1 ">
								<h4 class="title mb-1 mt-0 has-text-left one-line is-align-items-center is-flex">
									<b-tag v-if="health" type="is-success">{{ $t('Healthy') }}</b-tag>
									<b-tag v-else type="is-danger">{{ $t('Damage') }}</b-tag>
								</h4>
								<p class="has-text-left is-size-14px disk-info">
									{{ $t('Used') }}: {{ renderSize(totalUsed) }}<br>
									{{ $t('Total') }}: {{ renderSize(totalSize) }}
								</p>
							</div>
						</div>
						<b-progress :type="totalPercent | getProgressType" :value="totalPercent" class="mt-2"
							size="is-small"></b-progress>
					</div>
				</div>
			</div>
		</div>
		<!-- Disk Info End -->
		<!-- Usb Disk List Start -->
		<div v-if="usbDisks.length > 0" class="widget has-text-white disk is-relative">
			<div class="blur-background"></div>
			<div class="widget-content">
				<div class="columns is-mobile is-multiline pt-2 ">
					<div v-for="(item) in usbDisks" :key="'usb_' + item.name" class="column is-full pb-0">
						<div class="is-flex">
							<div class="header-icon is-flex-shrink-0">
								<b-image :src="require('@/assets/img/storage/USB.svg')" class="is-64x64"></b-image>
							</div>
							<div class="ml-2 is-flex-grow-1 ">
								<h4 class="title is-size-14px mb-1 mt-0 has-text-left has-text-white one-line ">
									{{ item.model }}
								</h4>
								<p class="has-text-left is-size-14px disk-info">
									{{ $t('Used') }}: {{ renderSize(item.size - item.avail) }}<br>
									{{ $t('Total') }}: {{ renderSize(item.size) }}
								</p>
							</div>
						</div>
						<b-progress :type="(Math.floor((item.size - item.avail) * 100 / item.size)) | getProgressType"
							:value="Math.floor((item.size - item.avail) * 100 / item.size)" class="mt-2"
							size="is-small"></b-progress>
					</div>
				</div>
			</div>
		</div>

		<!-- Usb Disk List End -->
	</div>
</template>

<script>
import StorageManagerPanel from '@/components/Storage/StorageManagerPanel.vue'
import { mixin } from '@/mixins/mixin';

export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'disks',
	icon: "storage-outline",
	title: "Storage Status",
	initShow: true,
	mixins: [mixin],

	data() {
		return {
			totalSize: 0,
			totalUsed: 0,
			totalPercent: 0,
			health: "Healthy",
			usbDisks: []
		}
	},

	mounted() {
		this.getDiskInfo(this.$store.state.hardwareInfo.sys_disk)
		this.usbDisks = this.$store.state.hardwareInfo.sys_usb
	},
	methods: {
		getDiskInfo(diskInfo) {
			this.totalSize = diskInfo.size
			this.totalUsed = diskInfo.used
			this.totalPercent = 100 - Math.floor(diskInfo.avail * 100 / this.totalSize)
			this.health = diskInfo.health
		},

		showDiskManagement() {
			this.$messageBus('widget_storagemanager');
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
		},
	},
	sockets: {
		"casaos:system:utilization"(res) {
			let data = res.Properties
			// DISK
			this.getDiskInfo(JSON.parse(data.sys_disk))
			// USB
			this.usbDisks = JSON.parse(data.sys_usb)
		}
	}
}
</script>

<style lang="scss">
.disk {
	.progress {
		border-radius: 6px;
		height: 12px;

		&::-webkit-progress-bar {
			background: rgba(172, 184, 195, 0.4);
		}

		&::-webkit-progress-value {
			opacity: 1;
			border-radius: 6px;
		}

	}

	.disk-info {
		font-size: 0.875rem;
		line-height: 1.25rem;
		font-weight: 400;
		color: $grey-400;
	}
}
</style>

<style lang="scss" scoped>
.tag {
	font-size: 0.75rem;
	line-height: 1rem;
	font-weight: 400;
	height: 1.25rem;
	border-radius: 4px;
	padding-left: 0.375rem;
	padding-right: 0.375rem;
	border-width: 1px;
	border-style: solid;

	&.is-success {
		background-color: transparent;
		color: $green;
		border-color: $green;
	}

	&.is-danger {
		background-color: transparent;
		color: $red;
		border-color: $red;
	}

}
</style>
