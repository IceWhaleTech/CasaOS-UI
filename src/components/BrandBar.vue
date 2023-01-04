<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2022/12/1 下午5:01
  * @FilePath: /CasaOS-UI/src/components/BrandBar.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
	<div class="brand-bar is-flex is-align-items-flex-end has-text-white">
		<figure class="image _is-125x24">
			<img :src="require('@/assets/img/logo/logo.svg')">
		</figure>
		<span v-if="!rssShow || rss.length === 0" class="intro-text ml-4">Made with ❤️ by IceWhale and YOU!</span>
		<span v-else class="window ml-4">
      <ul :style="{'--time': 5*line+'s', '--perc': perc, '--line': line}" class="scroll">
        <li v-for="(item,key) in rss" :key="key" @click="$messageBus('connect_news')">
	        <a :href="item.link" class="intro-text" target="_blank">{{ item.title }}</a>
        </li>
      </ul>
    </span>

	</div>
</template>

<script>
import Parser from "rss-parser";

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
	},
	data() {
		return {
			rss: [],
		};
	},
	created() {
		this.parseFeed()
	},
	methods: {
		messageBus() {
			return messageBus
		},
		async parseFeed() {
			let parser = new Parser();
			let params = await this.$api.file.getContent('/var/lib/casaos/baseinfo.conf').then(res => {
				return JSON.parse(res.data.data)
			})
			params.l = localStorage.getItem('lang') ? localStorage.getItem('lang') : navigator.language.toLowerCase().replace("-", "_");
			let stringify = btoa(encodeURIComponent(JSON.stringify(params)))
			let feed = await parser.parseURL('https://blog.casaos.io/feed/tag/dashboard/?key=' + stringify);
			this.rss = feed.items
		}
	}
}
</script>

<style lang="scss" scoped>
.brand-bar {
	position: fixed;
	left: 2rem;
	bottom: 1.125rem;
	z-index: 30;

	.logo-text {
		font-size: 1.125rem;
	}

	.intro-text {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.6);

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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

._is-125x24 {
	width: 7.8125rem;
	height: 1.5rem;
}

// -----------------scroll start-----------------
@keyframes scroll {
	0% {
		transform: translate(0, 0);
	}
	100% {
		//transform: translate(0, var(--perc)); // slide
		transform: translate(0, -100%); // Jump upwards
	}
}

.window {
	height: 1rem;
	overflow: hidden;
}

.scroll {
	width: 100%;
	line-height: 1rem;
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
		no-wrap: true;
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
