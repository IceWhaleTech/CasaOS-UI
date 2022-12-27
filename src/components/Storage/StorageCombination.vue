<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2022/12/19 下午12:50
  * @FilePath: /CasaOS-UI/src/components/Storage/StorageCombination.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
	<div v-show="showCombination" class="mb-5 mt-2 pt-5 pb-5 border-1">
		<div class="is-relative is-flex is-justify-content-center top--2rem">
			<div class="pr-4 pl-4 has-background-white">CasaOS HD</div>
		</div>
		<div class="is-flex ">
			<div class="is-flex-grow-1">
				<div v-for="(item,index) in storageData" :key="'mergeStorage' + index" class="ml-5 is-flex mb-3">
					<div class="header-icon">
						<b-icon v-show="!item.name" class="warn is-16x16" icon="danger" pack="casa"></b-icon>
						<b-image :src="require('@/assets/img/storage/storage.png')" class="is-64x64"></b-image>
					</div>
					<div class="ml-3 is-flex-grow-1 is-flex is-align-items-center">
						<div>
							<h4 class="title is-size-14px mb-0 has-text-left one-line">{{ item.name || $t('undefined') }}
								<b-tag v-if="item.isSystem" class="ml-2">CasaOS</b-tag>
							</h4>

							<p class="has-text-left is-size-7 has-text-grey-light	">{{ $t('Single Drive Storage') }}, <span
									class="is-uppercase">{{ item.fsType || $t('undefined') }}</span>
								<b-tooltip :label="$t('CasaOS reserves 1% of file space when creating storage in EXT4 format.')"
								           append-to-body>
									<b-icon class="mr-2 " icon="help-circle-outline" size="is-small"></b-icon>
								</b-tooltip>
							</p>
							<p class="has-text-left is-size-7 ">{{
									$t("Available Total", {
										name: item.diskName || $t('undefined'),
										avl: renderSize(item.availSize),
										total: renderSize(item.size)
									})
								}}</p>
						</div>

					</div>
				</div>
			</div>
			<div class="mr-5 is-flex is-flex-direction-column is-justify-content-space-between">
				<div class="is-flex is-flex-direction-row-reverse">
					<b-button :type="type" class="width" rounded size="is-small"
					          @click="showStorageSettingsModal">{{ $t('Merge Storages') }}
					</b-button>
					<cToolTip isBlock modal="is-success"></cToolTip>
				</div>

				<div class="is-size-6 has-text-weight-medium mb-1">{{ renderSize(usage) }}/{{ renderSize(totleSize) }}</div>
			</div>
		</div>
		<b-progress :type="usePercent | getProgressType" :value="usePercent" class="ml-5 mr-5"
		            size="is-small"></b-progress>
	</div>
</template>

<script>
import {mixin} from '@/mixins/mixin';
import MergeStorages from "@/components/Storage/MergeStorages.vue";
import cToolTip from "@/components/basicComponents/tooltip/tooltip.vue";

export default {
	name: "drive-combination",
	mixins: [mixin],
	components: {
		cToolTip,
	},
	props: {
		storageData: {
			type: Array,
			default: null
		},
		type: {
			type: String,
			default: "is-link"
		},
	},
	data() {
		return {
			isFormating: false,
			isRemoving: false
		}
	},
	computed: {
		showCombination() {
			return this.storageData.length > 0
		},

		usage() {
			let usage = 0;
			this.storageData.forEach(item => {
				usage += item.size - item.availSize;
			});
			return usage;
		},

		totleSize() {
			let totleSize = 0;
			this.storageData.forEach(item => {
				totleSize += Number(item.size);
			});
			return totleSize
		},

		usePercent() {
			return this.usage / this.totleSize * 100;
		},
	},
	methods: {
		// show storage settings modal
		showStorageSettingsModal() {
			// src/components/Storage/StorageManagerPanel.vue:406
			this.$buefy.modal.open({
				parent: this,
				component: MergeStorages,
				hasModalCard: true,
				trapFocus: true,
				onCancel: () => {
				},
				events: {
					close: () => {
						this.$emit("reload");
					}
				},
			})
		},

	},
}
</script>
<style lang="scss" scoped>
.border-1 {
	border: 1px solid #e6e6e6;
	border-radius: 4px;
}

.warn {
	position: absolute;
	z-index: 10;
	color: hsla(348, 86%, 61%, 1);
}

.top--2rem {
	top: -1.4rem;
	margin-top: -1rem;
	width: 100%
}
</style>
