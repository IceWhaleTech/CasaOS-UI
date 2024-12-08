<template>
	<div v-show="showCombination" class="mb-5 mt-2 pt-5 pb-5 border-1 combination-box">
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
							<h4 class="title is-size-14px mb-0 has-text-left one-line">{{
									item.name || $t('undefined')
								}}
								<b-tag v-if="item.isSystem" class="ml-2">CasaOS</b-tag>
							</h4>

							<p class="has-text-left is-size-7 has-text-grey-light	">{{ $t('Single Drive Storage') }},
								<span
								class="is-uppercase">{{ item.fsType || $t('undefined') }}</span>
								<b-tooltip
								:label="$t('CasaOS reserves 1% of file space when creating storage in EXT4 format.')"
								append-to-body>
									<b-icon class="mr-2 " icon="question-outline" pack="casa" size="is-small"></b-icon>
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
			<div class="mr-5 is-flex is-flex-direction-column-reverse is-justify-content-space-between">
				<div class="has-text-emphasis-01 has-text-weight-medium mb-1">{{
						renderSize(usage)
					}}/{{ renderSize(totleSize) }}
				</div>
				<p v-if="usePercent >= 80"
				   class="has-text-right is-flex is-flex-direction-row-reverse">
					<a rel="noopener" href="https://wiki.casaos.io/zh/guides" target="_blank">{{ $t("Free up storage") }}</a>
				</p>
				<div class="is-flex is-flex-direction-row-reverse">
					<b-button :type="type" class="width" rounded size="is-small"
							  @click="showStorageSettingsModal">{{ $t('Merge Storages') }}
					</b-button>
					<cToolTip isBlock modal="is-success"></cToolTip>
				</div>
			</div>
		</div>
		<b-progress :type="usePercent | getProgressType" :value="usePercent" class="ml-5 mr-5"
					size="is-small"></b-progress>
	</div>
</template>

<script>
import {mixin}       from '@/mixins/mixin';
import MergeStorages from "@/components/Storage/MergeStorages.vue";
import cToolTip      from "@/components/basicComponents/tooltip/tooltip.vue";

export default {
	name: "storage-combination",
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
		async showStorageSettingsModal() {
			// src/components/Storage/StorageManagerPanel.vue:406
			// TODO: the part is repetition
			//  with APPs Installation Location requirement document
			// 获取merge信息
			let mergeStorageList
			try {
				mergeStorageList = await this.$api.local_storage.getMergerfsInfo().then((res) => res.data.data[0]['source_volume_uuids'])
			} catch (e) {
				mergeStorageList = []
				console.log(e)
			}

			this.$buefy.modal.open({
				parent: this,
				component: MergeStorages,
				hasModalCard: true,
				trapFocus: true,
				canCancel: ['escape'],
				onCancel: () => {
				},
				events: {
					close: () => {
						this.$emit("reload");
					}
				},
				props: {
					mergeStorageList
				}
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

.combination-box {
	background-color: hsla(208, 16%, 98%, 1);
	border: 1px solid hsla(208, 16%, 91%, 1);
	border-radius: 12px;

	.combination-title {
		background-color: hsla(208, 16%, 98%, 1);
		border: 1px solid hsla(208, 16%, 91%, 1);
		border-radius: 4px;
	}

	.tag {
		background-color: hsla(208, 16%, 98%, 1);
		border: 1px solid hsla(208, 100%, 45%, 1);
		color: hsla(208, 100%, 45%, 1);
		padding: 2px 6px;
		height: 1.25rem;
	}
}
</style>
