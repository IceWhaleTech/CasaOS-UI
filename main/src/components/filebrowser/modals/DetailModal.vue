<template>
	<div class="modal-card">
		<!-- Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1 is-flex ">
			</div>
			<b-icon class="close-button" icon="close-outline" pack="casa" @click.native="$emit('close');" />
		</header>
		<!-- Header End -->
		<!-- Modal-Card Body Start -->
		<section class="modal-card-body is-flex is-justify-content-center is-align-items-center mb-5">
			<div class="node-card ">
				<div class="cover is-unselectable is-flex is-justify-content-center is-align-items-center">
					<div :class="item | coverType">
						<img :class="item | iconType" :src="getIconFile(item)" alt="folder"/>
					</div>
				</div>
				<div class="info mt-3 is-flex is-flex-direction-column is-justify-content-center">
					<p class="title">{{ item.name }}</p>
					<div class="buttons is-justify-content-center">
						<b-button type="is-primary" @click="download">{{ $t('Download') }}
							{{ item.size | renderSize }}
						</b-button>
					</div>
				</div>
			</div>
		</section>
		<!-- Modal-Card Body End -->
	</div>
</template>

<script>
import {mixin} from '@/mixins/mixin';

export default {
	mixins: [mixin],
	props: {
		item: Object
	},
	data() {
		return {}
	},
	methods: {
		download() {
			this.downloadFile(this.item);
			this.$emit('close')
			// this.$parent.fullScreen = true
			// console.log(this.$parent);
		}
	},
}
</script>