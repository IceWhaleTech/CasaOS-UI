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
				<b-icon
				:class="{'has-text-grey-800': !isEditing, 'has-text-green-default': isDifferentiation, 'has-text-grey-400': !isDifferentiation && isEditing}"
				:icon="icon" pack="casa"
				@click.native="toggle"></b-icon>
			</div>
		</section>
		<!-- Modal-Card Body End -->
	</div>
</template>

<script>
import YAML from "yaml";
import merge from "lodash/merge";

let tempTips = '';

export default {
	name: "TipEditorModal",
	data() {
		return {
			isEditing: false,
			tips: '',
			// tipObj: {},
		}
	},
	props: {
		composeData: {
			type: Object,
			required: true
		},
		id: {
			type: String,
			required: true
		}
	},
	computed: {
		icon() {
			return this.isEditing ? 'matching' : 'edit'
		},
		isDifferentiation() {
			return tempTips !== this.tips
		},
	},
	watch: {
		composeData(val) {
			console.log('watch tips', val)
			
			let getValueByPath = this.composeData['services'][this.id]
			if (getValueByPath['x-casaos'] && getValueByPath['x-casaos']['tips'] && getValueByPath['x-casaos']['tips']['before_install']) {
				let multiLine = getValueByPath['x-casaos']['tips']['before_install'].forEach(item => {
					let value = item.content['default'] && item.content['en_US']
					return `${item.value}:${value}\n`
				})
				console.log('multiLine', multiLine)
				// return multiLine
				this.tips = multiLine;
			} else {
				this.tips = '';
				// return ''
			}
			// init tempTips
			tempTips = this.tips;
		}
	},
	methods: {
		/*
		* 1、进入编辑状态
		* 2、保存
		* */
		toggle() {
			this.isEditing = !this.isEditing
			console.log('isDifferentiaation', this.isDifferentiation)
			if (this.isDifferentiation) {
				let realComposeData = this.getCompleteComposeData()
				this.$openAPI.appManagement.compose.applyComposeAppSettings(this.id, YAML.stringify(realComposeData)).then(res => {
					if (res.status === 200) {
						this.$buefy.toast.open({
							message: res.data.message,
							type: 'is-success',
							position: 'is-top',
							duration: 5000
						})
					}
				}).catch(e => {
					console.log('Error in saving tips:', e)
					this.$buefy.toast.open({
						message: e.response.data.data,
						type: 'is-danger',
						position: 'is-top',
						duration: 5000
					})
				}).finally(() => {
					this.$emit('close')
				})
			}
		},
		
		getCompleteComposeData() {
			let lines = this.tips.split('\n');
			let body = [];
			
			lines.forEach(line => {
				let splitArray = line.split(':');
				let value = splitArray.length > 1 ? splitArray[0] : 'user input';
				let content = splitArray.length > 1 ? splitArray[1] : splitArray[0];
				body.push({value, content: {default: content}});
			});
			let result = merge(this.composeData, {
				services: {
					[this.id]: {
						'x-casaos': {
							tips: {
								before_install: body
							}
						}
					}
				}
			})
			return result
		}
	},
}
</script>

<style lang="scss" scoped>
.modal-card {
	/* v0.4.3 */
	width: 26.5rem;
	
	.modal-card-head {
		padding-top: 1.25rem;
		border-bottom: 1px solid hsla(208, 16%, 94%, 1) !important;
		
		.close {
			height: 2rem;
			width: 2rem;
			border-radius: 0.375rem;
		}
	}
	
	.modal-card-body {
		padding: 1.5rem;
		
		textarea {
			resize: none;
			height: 5.25rem;
		}
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