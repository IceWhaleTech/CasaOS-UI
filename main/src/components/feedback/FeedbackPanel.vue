<template>
	<div class="modal-card">

		<!-- Modal-Card Body Start -->
		<section class="modal-card-body ">

			<h3 class="title is-3">{{ $t('Feedback / Issue Report') }}</h3>
			<div class="close-container">
				<button class="delete" type="button" @click="$emit('close')"/>
			</div>

			<div class="is-flex-grow-1 is-relative">
				<b-field :label="$t('Title')">
					<b-input v-model="postTitle" :placeholder="$t('Start with [Issue], [App Request], or [Feature Request]...')"
							 maxlength="100"></b-input>
				</b-field>
				<b-field :label="$t('Description')">
					<b-input v-model="postBody" :placeholder="$t('The more details provided, the easier this feedback or issue gets addressed.')" maxlength="500"
							 type="textarea"></b-input>
				</b-field>
				<b-field :label="$t('System infomation')">
					<div class="feedback-info-container is-size-14px" v-dompurify-html="markdownToHtml"></div>
				</b-field>
			</div>
		</section>

		<!-- Modal-Card Body End -->
		<!-- Modal-Card Footer Start-->
		<footer class="modal-card-foot is-flex is-align-items-center ">
			<div class="is-flex-grow-1">
				<a class="is-size-14px" rel="noopener"
				   href="https://github.com/IceWhaleTech/CasaOS/issues/new/choose"
				   target="_blank">{{ $t('For more feedback options, visit CasaOS project on GitHub...') }}</a>
			</div>
			<div>
				<b-button :label="$t('Submit')" rounded type="is-primary" @click="submitIssue"/>
			</div>
		</footer>
		<!-- Modal-Card Footer End -->
		<b-loading v-model="isLoading" :can-cancel="false" :is-full-page="false"></b-loading>
	</div>
</template>

<script>

import browserInfo from 'browser-info'
import {marked}    from 'marked'

export default {
	name: "feedback-panel",
	components: {},
	data() {
		return {
			isLoading: false,
			feedBody: "",
			postTitle: "",
			postBody: "",
		}
	},

	computed: {
		markdownToHtml() {
			return marked.parse(this.feedBody);
		}
	},

	mounted() {
		this.$api.sys.getDebugInfo().then(res => {
			const browserInfos = browserInfo();
			this.feedBody = res.data.data.replace("$Browser$", browserInfos.name).replace("$Version$", browserInfos.fullVersion);
		})
	},
	methods: {
		submitIssue() {
			const option = {
				labels: "feedback",
				template: "feedback.yml",
				title: "[Feedback]" + this.postTitle,
				description: this.postBody,
				additional: this.feedBody,
			}
			let repoUrl = new URL(`https://github.com/IceWhaleTech/CasaOS/issues/new`);
			for (const optionElement in option) {
				repoUrl.searchParams.set(optionElement, option[optionElement]);
			}
			window.open(repoUrl, '_blank');
			this.$emit('close');
		}
	},
}
</script>

<style lang="scss" scoped>
.feedback-info-container {
	border-radius: 4px;
	overflow: hidden;

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-weight: bold;
		margin-bottom: 0.4rem;
	}

	h1 {
		font-size: 2em;
	}

	h2 {
		font-size: 1.5em;
	}

	h3 {
		font-size: 1.17em;
	}

	h4 {
		font-size: 1em;
	}

	h5 {
		font-size: 0.83em;
	}

	h6 {
		font-size: 0.67em;
	}

	ul {
		margin-bottom: 0.5em;

		li {
			list-style: disc;
			margin-left: 1rem;
		}
	}
}

.feedback-modal {
	.modal-card-body {
		overflow-y: hidden;
		transition: height 0.3s;
		padding: 2rem 2rem 2rem 2rem;
		position: relative;
	}

	.modal-card-foot {
		padding-top: 0;
	}

	.close-container {
		position: absolute;
		right: 2rem;
		top: 2rem;
	}
}
</style>
