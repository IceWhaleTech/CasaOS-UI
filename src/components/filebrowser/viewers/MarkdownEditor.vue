<template>
	<div class="overlay">
		<header class="modal-card-head">
			<div class="is-flex-grow-1 is-flex">
				<!-- Title Start -->
				<h3 class="title is-5 one-line mr-4">{{ $t("Richtext Editor") }}</h3>
				<!-- Title End -->
			</div>
			<div class="is-flex is-align-items-center">
				<!-- Save File Button Start -->
				<b-button
					:label="$t('Save')"
					class="mr-3"
					icon-left="content-save"
					rounded
					size="is-small"
					type="is-dark"
					@click="saveFile(false)"
				/>
				<!-- Save File Button Start -->

				<!-- Download File Button Start -->
				<b-button
					:label="$t('Download')"
					class="mr-2"
					icon-left="download"
					rounded
					size="is-small"
					type="is-primary"
					@click="download"
				/>
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
				<b-breadcrumb-item
					v-for="(item, index) in pathArray"
					:key="'f-' + index"
					active
				>{{ item }}
				</b-breadcrumb-item
				>
			</b-breadcrumb>
		</div>
		<!-- Editor Breadcrumb End -->

		<!-- Editor Start -->
		<div
			class="is-flex is-justify-content-center is-align-items-center is-flex-grow-1 v-container code"
		>
			<editor-content :editor="editor" class="mark-container"/>
			<!-- <codemirror v-model="code" ref="cmEditor" :options="cmOptions" @input="onCmCodeChange" @ready="onCmReady" /> -->
		</div>
		<!-- Editor End -->
	</div>
</template>

<script>
import {mixin} from "@/mixins/mixin";

// import mime from 'mime'
import {Editor, EditorContent} from "@tiptap/vue-2";
import StarterKit              from "@tiptap/starter-kit";
import Highlight               from "@tiptap/extension-highlight";
import Typography              from "@tiptap/extension-typography";

export default {
	mixins: [mixin],
	components: {
		EditorContent,
	},
	props: {
		item: {
			type: Object,
			default: () => {
				return {
					path: "",
					name: "",
				};
			},
		},
	},
	data() {
		return {
			editor: null,
			code: "",
		};
	},
	computed: {
		pathArray() {
			return this.item.path.substr(1).split("/");
		},
	},
	mounted() {
		this.readFile();
		this.editor = new Editor({
			extensions: [StarterKit, Highlight, Typography],
			content: `
        <p>
          Markdown shortcuts make it easy to format the text while typing.
        </p>
        <p>
          To test that, start a new line and type <code>#</code> followed by a space to get a heading. Try <code>#</code>, <code>##</code>, <code>###</code>, <code>####</code>, <code>#####</code>, <code>######</code> for different levels.
        </p>
        <p>
          Those conventions are called input rules in tiptap. Some of them are enabled by default. Try <code>></code> for blockquotes, <code>*</code>, <code>-</code> or <code>+</code> for bullet lists, or <code>\`foobar\`</code> to highlight code, <code>~~tildes~~</code> to strike text, or <code>==equal signs==</code> to highlight text.
        </p>
        <p>
          You can overwrite existing input rules or add your own to nodes, marks and extensions.
        </p>
        <p>
          For example, we added the <code>Typography</code> extension here. Try typing <code>(c)</code> to see how it’s converted to a proper © character. You can also try <code>-></code>, <code>>></code>, <code>1/2</code>, <code>!=</code>, or <code>--</code>.
        </p>
      `,
		});
	},
	methods: {
		readFile() {
			this.$api.file.download(this.item.path).then((res) => {
				this.code = String(res.data);
				this.$nextTick(() => {
					this.isChange = false;
				});
			});
		},
		close() {
			if (this.isChange) {
				this.$buefy.dialog.confirm({
					title: this.$t("Want to save?"),
					message: this.$t("Your changes will be lost if you don’t save them."),

					hasIcon: true,
					canCancel: ["button"],
					confirmText: this.$t("Save"),
					cancelText: this.$t("Don’t Save"),
					onConfirm: () => {
						this.saveFile(true);
					},
					onCancel: () => {
						this.$emit("close");
					},
				});
			} else {
				this.$emit("close");
			}
		},
	},
};
</script>

<style lang="scss">
/* Basic editor styles */
.mark-container {
	padding: 0 1.5rem;
	width: 100%;
	height: 100%;
	position: relative;
}

.ProseMirror {
	width: 100%;
	height: 100%;

	> * + * {
		margin-top: 0.75em;
	}

	ul,
	ol {
		padding: 0 1rem;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		line-height: 1.1;
	}

	code {
		background-color: rgba(#616161, 0.1);
		color: #616161;
	}

	pre {
		background: #0d0d0d;
		color: #fff;
		font-family: "JetBrainsMono", monospace;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;

		code {
			color: inherit;
			padding: 0;
			background: none;
			font-size: 0.8rem;
		}
	}

	img {
		max-width: 100%;
		height: auto;
	}

	hr {
		margin: 1rem 0;
	}

	blockquote {
		padding-left: 1rem;
		border-left: 2px solid rgba(#0d0d0d, 0.1);
	}
}
</style>
