<template>
	<div class="modal-card">
		<!-- Modal-Card Header Start -->
		<header class="modal-card-head">
			<div class="is-flex-grow-1">
				<h3 class="title is-header">{{ $t('Tips') }}</h3>
			</div>
			<div>
				<div class="is-flex is-align-items-center">
					<b-icon class="close-button" icon="close-outline" pack="casa" @click.native="$emit('close');" />
				</div>
			</div>
		</header>
		<!-- Modal-Card Header End -->

		<!-- Modal-Card Body Start -->
		<section class="modal-card-body">
			<VMdEditor v-model="tips" :mode="controlEditorState" :placeholder="$t('Something to remember eg. password')"
				left-toolbar right-toolbar>
			</VMdEditor>
			<div v-if="name" class="is-flex is-flex-direction-row-reverse mt-2">
				<b-icon class="is-clickable"
					:class="{ 'has-text-grey-800': !isEditing, 'has-text-green-default': isDifferentiation, 'has-text-grey-400': !isDifferentiation && isEditing }"
					:icon="icon" pack="casa" @click.native="toggle"></b-icon>
			</div>
		</section>
		<!-- Modal-Card Body End -->

		<!-- Modal-Card Footer Start-->
		<footer v-if="!name" class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1"></div>
			<div class="is-flex is-flex-direction-row-reverse">
				<b-button rounded size="is-small" type="is-primary" @click="$emit('submit') && $emit('close')">{{ $t('Next Steps') }}
				</b-button>
			</div>
		</footer>
		<!-- Modal-Card Footer End-->
	</div>
</template>

<script>
import YAML from "yaml";
import merge from "lodash/merge";
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';
import { ice_i18n } from "@/mixins/base/common-i18n";

VMdEditor.use(githubTheme, {
	Hljs: hljs,
	// extend(md) {},
});

export default {
	name: "TipEditorModal",
	components: {
		VMdEditor
	},
	data() {
		return {
			isEditing: false,
			tips: '',
			tempTips: '',
			controlEditorState: 'preview',
			icon: 'edit-outline'
		}
	},
	props: {
		composeData: {
			type: Object,
			required: true
		},
		name: {
			type: String,
			// required: true
		}
	},
	computed: {
		isDifferentiation() {
			return this.tempTips !== this.tips
		},
	},
	watch: {
		isEditing(val) {
			if (val) {
				// editor is editable
				this.controlEditorState = 'edit'
				this.icon = 'check-outline'
			} else {
				// editor is not editable
				this.controlEditorState = 'preview'
				this.icon = 'edit-outline'
			}
			return this.isEditing
		},
		composeData: {
			handler() {
				//Get tips in compose.
				let getValueByPath = this.composeData['x-casaos']
				if (getValueByPath?.['tips']?.['custom'] || getValueByPath?.['tips']?.['before_install']) {
					this.tips = getValueByPath['tips']['custom'] || ice_i18n(getValueByPath['tips']['before_install'])
				} else {
					this.tips = '';
				}
				// init tempTips
				this.tempTips = this.tips;
			},
			immediate: true
		}
	},
	mounted() {
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
				this.save();
			}
		},

		save() {
			// 更新
			// TODO 因为异步，不清楚是否保存成功
			this.tempTips = this.tips
			let realComposeData = this.getCompleteComposeData()
			this.$openAPI.appManagement.compose.applyComposeAppSettings(this.name, YAML.stringify(realComposeData)).then(res => {
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
			})
		},
		getCompleteComposeData() {
			/*let lines = this.tips.split('\n');
			let body = [];

			lines.forEach(line => {
				let splitArray = line.split(':');
				let value = splitArray.length > 1 ? splitArray[0] : 'user input';
				let content = splitArray.length > 1 ? splitArray[1] : splitArray[0];
				body.push({value, content: {default: content}});
			});*/

			let result = merge(this.composeData, {
				'x-casaos': {
					tips: {
						custom: this.tips
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

		::v-deep .v-md-editor {
			box-shadow: none;
			border: 1px solid hsla(208, 16%, 94%, 1);
			border-radius: 0.375rem;

			overflow: hidden;
			resize: vertical;
			max-height: 20.25rem;
			min-height: 5.25rem;

			&.v-md-editor--edit {
				/* 覆盖上层 */
				border: 0;

				.scrollbar__wrap {
					border: 1px solid hsla(208, 100%, 53%, 1);
					border-radius: 0.625rem;
				}
			}

			.v-md-editor__right-area {
				.v-md-editor__toolbar {
					display: none;
					padding: 0;
					border: 0;
				}

				.v-md-editor__main {
					.v-md-textarea-editor textarea {
						padding: 0.75rem 1rem;
						/* Text 400Regular/Text03 */

						font-family: $family-sans-serif;
						font-style: normal;
						font-weight: 400;
						font-size: 14px;
						line-height: 20px;
						/* identical to box height, or 143% */

						font-feature-settings: 'pnum' on, 'lnum' on;

					}
				}
			}
		}

		/*textarea {
				resize: none;
				height: 5.25rem;
		}*/
	}
}
</style>