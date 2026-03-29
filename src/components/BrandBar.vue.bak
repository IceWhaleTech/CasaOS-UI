<template>
	<div class="brand-bar is-flex is-align-items-flex-end has-text-white">
		<figure class="image _is-136x26 mb-3">
			<img alt="logo" srcset="../assets/img/logo/logo.svg 2x, ../assets/img/logo/logo.png 1x">
		</figure>
		<span v-if="!rssShow || rss.length === 0" class="intro-text ml-4">Made with ❤️ by IceWhale and YOU!</span>
		<span v-else class="window ml-4">
			<ul :style="{ '--time': 5 * line + 's', '--perc': perc, '--line': line }" class="scroll">
				<li v-for="(item, key) in rss" :key="key" class="has-text-left" @click="$messageBus('connect_news')">
					<a @click="gotoLink(item.link)" class="intro-text is-clickable" target="_blank"
						rel="noopener noreferrer">
						{{ item.title }}
					</a>
				</li>
			</ul>
		</span>

	</div>
</template>

<script>
import DOMPurify from 'dompurify';
import { parse} from 'rss-to-json'
export default {
	name: "brand-bar",
	components: {},
	computed: {
		rssShow() {
			let which = this.$store.state.rssSwitch
			if (which) {
				this.parseFeed()
			}
			return which
		},
		line() {
			return this.rss.length
		},
		perc() {
			return -(this.line - 1) / this.line * 100 + '%'
		},
		isShow() {
			return this.$route.path !== '/login' || this.$route.path !== '/welcome'
		},
	},
	watch: {
		isShow(val) {
			val && this.parseFeed()
		}
	},
	data() {
		return {
			rss: [],
		};
	},
	methods: {
		async parseFeed() {			
			let params = await this.$api.file.getContent('/var/lib/casaos/baseinfo.conf').then(res => {
				return JSON.parse(res.data.data)
			})
			this.$store.commit('SET_DEVICE_ID', params.i)
			params.l = localStorage.getItem('lang') ? localStorage.getItem('lang') : navigator.language.toLowerCase().replace("-", "_");
			let stringify = btoa(encodeURIComponent(JSON.stringify(params)))
			let feed = await parse('https://blog-casaos.zimaspace.com/feed/tag/dashboard/?key=' + stringify)
			const newFeed = feed.items.map(item => {
				return {
					title: item.title,
					link: DOMPurify.sanitize(item.link, { ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.1-9]+(?:[^a-z+.1-9]|$))/i })
				}
			})
			this.rss = newFeed
			
			
		},

		gotoLink(link) {
			window.open(link, '_blank')
		}
	}
}
</script>

<style lang="scss" scoped>
.brand-bar {
	position: fixed;
	left: 2rem;
	bottom: 0;
	//z-index: 10;

	span {
		//font-size: 1.125rem;
		margin-bottom: 7px;
	}

	.intro-text {
		font-weight: 400;
		font-size: 0.875rem;
		line-height: 1.25rem;
		color: rgba(255, 255, 255, 0.6);

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		vertical-align: text-bottom;
	}
}

@media screen and (max-width: 480px) {
	.brand-bar {
		left: 0;
		bottom: 3rem;
		display: flex;
		width: 100%;
		justify-content: center;
		font-size: 0.875rem;

		.image.is-32x32 {
			height: 24px;
			width: 24px;
		}

		.is-size-4 {
			font-size: 1.25rem !important;
		}
	}
}

._is-136x26 {
	width: 8.5rem;
	height: 1.625rem;
}

// -----------------scroll start-----------------
@keyframes scroll {
	0% {
		transform: translate(0, 0);
	}

	100% {
		transform: translate(0, -100%); // Jump upwards
	}
}

.window {
	height: 1.25rem;
	overflow: hidden;
}

.scroll {
	width: 100%;
	line-height: 1.25rem;
	text-align: center;
	animation-name: scroll;
	animation-duration: var(--time);
	animation-delay: 0s;
	animation-iteration-count: infinite;
	animation-timing-function: steps(var(--line), end);

	li {
		max-width: 15rem;
		height: 1rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	li:hover {
		text-decoration: underline;

	}
}

.scroll:hover {
	animation-play-state: paused;
}

// -----------------scroll end-----------------
</style>
