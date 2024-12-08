<template>
	<div class="mb-5 mt-2 pri-border">
		<div :class="false" class="is-flex mb-4 mt-4 ml-6">
			<b-radio v-model="system" :native-value="item.mount_point" name="installationLocation" type="is-info"
				@input="$emit('selection', item.mount_point)">
				<span class="is-flex">
					<div class="header-icon">
						<b-image :src="require('@/assets/img/storage/storage.png')" class="is-64x64"></b-image>
					</div>
					<div class="ml-3 is-flex-grow-1 is-flex is-align-items-center">
						<div>
							<h4 class="title is-size-14px mb-0 has-text-left one-line">{{ item.name }}
								<b-tag v-if="item.isSystem" class="ml-2">CasaOS</b-tag>
							</h4>

							<p class="has-text-left is-size-7 has-text-grey-light	">{{ $t('Single Drive Storage') }}, <span
									class="is-uppercase">{{ item.fsType }}</span>
								<b-tooltip
									:label="$t('CasaOS reserves 1% of file space when creating storage in EXT4 format.')"
									append-to-body>
									<b-icon class="mr-2 " icon="question-outline" pack="casa" size="is-small"></b-icon>
								</b-tooltip>
							</p>
							<p class="has-text-left is-size-7 ">{{
								$t("Available Total", {
									name: item.diskName,
									avl: renderSize(item.availSize),
									total: renderSize(item.size)
								})
							}}</p>
						</div>

					</div>
				</span>
			</b-radio>
		</div>
	</div>
</template>

<script>
import { mixin } from "@/mixins/mixin";

export default {
	name: "AppsInstallationLocation",
	mixins: [mixin],
	props: {
		item: {
			type: Object,
			default: null
		},
	},
	data() {
		return {
			storageData: [{
				name: 12,
				isSystem: true,
				fsType: 'fsType',
				diskName: 'diakname',
				availSize: '1024',
				disk_type: 'type',
				path: 'path',
				mount_point: 'mount_point',
				usePercent: '20',
				model: 'model',
				size: 123,
				health: true,
				temperature: 100,
			}],
			diskData: [{
				name: 12,
				disk_type: 'type',
				model: 'model',
				size: 1234567,
				health: true,
				temperature: 100,
			}]
		}
	},
	computed: {
		system() {
			if (this.item.isSystem) {
				this.$emit('selection', this.item.mount_point)
				return this.item.mount_point
			}
			return ""
		}
	},
}
</script>

<style lang="scss">
.pri-border {
	border: 0.0625rem solid #0000001A;
	border-radius: 0.5rem;
}
</style>
