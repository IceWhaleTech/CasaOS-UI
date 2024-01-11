
<template>
	<div class="overlay">
		<header class="modal-card-head">
			<div class="is-flex-grow-1 is-flex ">
				<!-- Title Start -->
				<h3 class="title is-5 one-line mr-4">{{ $t('Code Editor') }}</h3>
				<!-- Title End -->
			</div>
			<div class="is-flex is-align-items-center">
				<!-- Save File Button Start -->
				<b-button :label="$t('Save')" class="mr-3" icon-left="content-save" rounded size="is-small" type="is-dark"
					@click="saveFile(false)" />
				<!-- Save File Button Start -->

				<!-- Download File Button Start -->
				<b-button :label="$t('Download')" class="mr-2" icon-left="download" rounded size="is-small"
					type="is-primary" @click="download" />
				<!-- Download File Button End -->

				<!-- Close Button Start -->
				<div class="close-button" @click="close">
					<b-icon icon="close-outline" pack="casa"></b-icon>
				</div>
				<!-- Close File Button End -->

			</div>
		</header>

		<!-- Editor Breadcrumb Start -->
		<div class="file-path-bread">
			<b-breadcrumb size="is-small">
				<b-breadcrumb-item v-for="(item, index) in pathArray" :key="'f-' + index" active>{{ item }}
				</b-breadcrumb-item>
			</b-breadcrumb>
		</div>
		<!-- Editor Breadcrumb End -->

		<!-- Editor Start -->
		<div class="is-flex is-justify-content-center is-align-items-center is-flex-grow-1 v-container pb-5">
			<codemirror ref="cmEditor" v-model="code" :options="cmOptions" @input="onCmCodeChange" @ready="onCmReady" />
		</div>
		<!-- Editor End -->
	</div>
</template>

<script>

import { mixin } from '@/mixins/mixin';

import mime from 'mime'
// Core
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
// theme css
import 'codemirror/theme/monokai.css'
// import 'codemirror/theme/elegant.css'
// require active-line.js
import 'codemirror/addon/selection/active-line.js'

// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

// hint
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/javascript-hint.js'

// lint
import 'codemirror/addon/lint/css-lint.js'
import 'codemirror/addon/lint/html-lint.js'
import 'codemirror/addon/lint/javascript-lint.js'
import 'codemirror/addon/lint/json-lint.js'
import 'codemirror/addon/lint/yaml-lint.js'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/lint.css'

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'

// keyMap
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/search.js'
import 'codemirror/keymap/sublime.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/xml-fold.js'

// Mode
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/go/go'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/htmlembedded/htmlembedded'
import 'codemirror/mode/http/http'
import 'codemirror/mode/php/php'
import 'codemirror/mode/python/python'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/mode/css/css'
import 'codemirror/mode/cmake/cmake'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/lua/lua'
import 'codemirror/mode/ruby/ruby'
import 'codemirror/mode/rust/rust'
import 'codemirror/mode/shell/shell'

// Lint libs
import { CSSLint } from "csslint";
import { JSHINT } from "jshint";
import jsonlint from "jsonlint-mod";
import jsyaml from "js-yaml";

window.CSSLint = CSSLint;
window.JSHINT = JSHINT;
window.jsonlint = jsonlint;
window.jsyaml = jsyaml;

export default {
	mixins: [mixin],
	components: {
		codemirror
	},
	props: {
		item: {
			type: Object,
			default: () => {
				return {
					path: '',
					name: ''
				}
			}
		},
	},
	data() {
		return {
			code: "",
			isChange: false,
			cmOptions: {
				tabSize: 4,
				styleActiveLine: true,
				lineNumbers: true,
				styleSelectedText: false,
				line: true,
				lint: true,
				foldGutter: true,
				gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
				highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
				mode: "text/javascript",
				// hint.js options
				hintOptions: {
					completeSingle: false
				},
				keyMap: "sublime",
				matchBrackets: true,
				showCursorWhenSelecting: true,
				theme: "monokai",
				extraKeys: {
					'Ctrl': "autocomplete",
					'Ctrl-S': () => {
						this.saveFile()
					},
					'Cmd-S': () => {
						this.saveFile()
					}
				},
				scrollbarStyle: "overlay",

			}
		}
	},

	computed: {
		codemirror() {
			return this.$refs.cmEditor.codemirror
		},
		pathArray() {
			return this.item.path.substr(1).split("/");
		}
	},
	mounted() {
		this.readFile();
	},


	methods: {
		onCmCodeChange() {
			this.isChange = true
		},
		onCmReady() {
			this.isChange = false
		},
		readFile() {
			let ext = this.getFileExt(this.item)
			let mode = mime.getType(ext) == null ? "text/javascript" : mime.getType(ext)
			if (ext.toLowerCase() == "makefile") {
				mode = 'text/x-cmake'
			} else if (ext.toLowerCase() == "py") {
				mode = 'text/x-python'
			} else if (ext.toLowerCase() == "go") {
				mode = 'text/x-go'
			} else if (ext.toLowerCase() == "vue") {
				mode = 'text/x-vue'
			}
			this.codemirror.setOption("mode", mode);
			this.$api.file.download(this.item.path).then(res => {
				this.code = typeof res.data === 'object'
					? JSON.stringify(res.data, null, 2)
					: res.data
				this.$nextTick(() => {
					this.isChange = false
				})
			})
		},
		saveFile(leave = false) {
			const content = this.codemirror.getValue()
			this.$api.file.update(this.item.path, content).then(res => {
				if (res.data.success == 200) {
					// this.readFile();
					this.isChange = false
					this.$buefy.toast.open({
						message: this.$t('Saved'),
						type: 'is-success'
					})
					if (leave) {
						this.$emit("close");
					}
				} else {
					this.$buefy.toast.open({
						message: res.data.message,
						type: 'is-danger'
					})
				}
			})
		},
		download() {
			this.downloadFile(this.item);
		},
		close() {
			if (this.isChange) {
				this.$buefy.dialog.confirm({
					title: this.$t('Want to save?'),
					message: this.$t('Your changes will be lost if you don’t save them.'),

					hasIcon: true,
					canCancel: ['button'],
					confirmText: this.$t('Save'),
					cancelText: this.$t('Don’t Save'),
					onConfirm: () => {
						this.saveFile(true);
					},
					onCancel: () => {
						this.$emit("close");
					}
				})
			} else {
				this.$emit("close");
			}
		}
	},

}
</script>

<style></style>