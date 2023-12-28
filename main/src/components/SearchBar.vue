<template>
	<b-field class="search-bar has-text-white mb-4" position="is-centered ">
		<b-input v-model="keyText" :class="['ovh', isFocus ? 'fo' : '']" :placeholder="$t('Search...')" expanded
			icon="search-outline" icon-pack="casa" icon-right="search-outline" icon-right-clickable size="is-medium"
			@blur="onBlur" @focus="onFocus" @icon-right-click="gotoSearch" @keyup.enter.native="gotoSearch">
		</b-input>
	</b-field>
</template>

<script>
export default {
	name: "search-bar",
	data() {
		return {
			isFocus: false,
			keyText: "",
			// searchEngine:this.$store.state.searchEngine
		}
	},
	computed: {
		searchEngine() {
			return this.$store.state.searchEngine === "" ? "https://duckduckgo.com/?q=" : this.$store.state.searchEngine
		}
	},
	methods: {
		/**
		 * @description: Handle Focus event
		 * @return {*} void
		 */
		onFocus() {
			this.isFocus = true;
		},

		/**
		 * @description: Handle Blur event
		 * @return {*} void
		 */
		onBlur() {
			if (this.keyText === "")
				this.isFocus = false;
		},

		/**
		 * @description: Pop up a new window and jump to google search
		 * @return {*} void
		 */
		gotoSearch() {
			window.open(this.searchEngine + this.keyText, '_blank')
		}
	},
}
</script>

<style lang="scss">
.search-bar {
	input {
		transition: all 0.2s;
		appearance: none;
		background: $backDropColor;
		backdrop-filter: $backDropBlur;
		border: $backDropBorder;
		box-shadow: $backDropShadow;
		border-radius: $backDropBorderRadius;
		outline: none;
		font-size: 0.875rem !important;
		color: rgba(255, 255, 255, 0.6);
		height: 3.5rem;

		&:focus {
			border: none;
			box-shadow: rgb(255 255 255 / 25%) 0.5px 1px 1px 0px inset;
		}

		&::placeholder {
			color: $grey-400;
		}
	}

	.icon {
		height: 3.5rem !important;
	}

	.ovh {
		overflow: hidden;

		.icon.is-left {
			transition: all 0.2s;
			left: 0;
			color: $grey-100 !important;
		}

		.icon.is-right {
			transition: all 0.2s;
			right: -3rem !important;
			color: $grey-100 !important;
		}

		input {
			padding-left: 3em !important;
			padding-right: 1em !important;
		}
	}

	.fo {
		.icon.is-left {
			left: -3rem !important;
		}

		.icon.is-right {
			transition: all 0.2s;
			right: 0 !important;
		}

		input {
			padding-right: 2.5em !important;
			padding-left: 1em !important;
		}
	}
}
</style>