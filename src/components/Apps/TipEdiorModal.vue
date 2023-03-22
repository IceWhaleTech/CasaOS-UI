<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/3/22 上午11:17
  * @FilePath: /CasaOS-UI/src/components/Apps/TipEditorModal
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.
  
  -->
<template>
	<div class="modal-card">
		<!-- Modal-Card Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-3">{{ $t('Tips') }}</h3>
			</div>
			<div>
				<div class="is-flex is-align-items-center">
					<b-icon class="_polymorphic close" icon="close" pack="casa" @click.native="$emit('close')"/>
				</div>
			</div>
		</header>
		<!-- Modal-Card Header End -->
		
		<!-- Modal-Card Body Start -->
		<section class="modal-card-body">
			<b-input
			v-model="tips" :readonly="!isEditing" type="textarea">
			</b-input>
			<div class="is-flex is-flex-direction-row-reverse mt-2">
				<b-icon :class="isDifferentiation" :icon="icon" pack="casa" @click.native="toggle"></b-icon>
			</div>
		</section>
		<!-- Modal-Card Body End -->
	</div>
</template>

<script>
import YAML from "yaml";

export default {
	name: "TipEditorModal",
	tempTips: '',
	data() {
		return {
			isEditing: false,
		}
	},
	props: {
		composeData: {
			type: Object,
			default: () => {
			}
		},
		id: {
			type: String,
			default: ''
		}
	},
	computed: {
		tips: {
			get() {
				return this.composeData['services'][this.id]['tips']
			},
			set(val) {
				this.$emit("update:composeData", {
					...this.composeData,
					tips: val
				})
			}
		},
		icon() {
			return this.isEditing ? 'matching' : 'edit'
		},
		isDifferentiation() {
			debugger
			return this.tempTips !== this.tips
		},
	},
	beforeMount() {
		this.tempTips = this.tips
		console.log('tempTips', this.tempTips);
	},
	methods: {
		/*
		* 1、进入编辑状态
		* 2、保存
		* */
		toggle() {
			this.isEditing = !this.isEditing
			console.log('isDifferentiation', this.isDifferentiation)
			
			if (this.isDifferentiation) {
				this.$openAPI.appManagement.compose.updateComposeApp(this.id, YAML.stringify(this.composeData)).then(res => {
					if (res.status === 200) {
						this.$buefy.toast.open()
					}
				}).catch(e => {
					console.log('Error in saving tips:', e)
				})
			}
		}
	},
}
</script>

<style lang="scss" scoped>
.modal-card {
	/* v0.4.3 */
	
	.modal-card-head {
		padding-top: 1.25rem;
		border-bottom: 1px solid hsla(208, 16%, 94%, 1) !important;
		
	}
	
	.modal-card-body {
		padding: 1.5rem;
	}
}

._polymorphic:hover {
	cursor: pointer;
	background: hsla(208, 16%, 96%, 1);
}

._polymorphic:active {
	background: hsla(208, 16%, 94%, 1);
}
</style>