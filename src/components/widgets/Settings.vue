<template>
	<div class="widget has-text-white clock is-relative ">
		<div class="blur-background"></div>

		<div ref="wsettings" class="wsettings">
			<b-dropdown :mobile-modal="false" :position="position" animation="fade1" aria-role="list">
				<template #trigger>
					<div class="widget-content" @click="$messageBus('widget_widgetsetting')">
						<!-- Header Start -->
						<div class="widget-header is-flex is-clickable	">
							<div class="widget-title is-flex-grow-1">
								{{ $t('Widgets Settings') }}
							</div>
							<div class="widget-icon-button is-flex-shrink-0">
								<b-icon icon="right-outline" pack="casa" size="is-20"></b-icon>
							</div>
						</div>
						<!-- Header End -->
					</div>
				</template>
				<b-dropdown-item :focusable="false" aria-role="menu-item" class="has-text-white has-text-left" custom>
					<h2 class="title is-5 has-text-white">{{ $t('Widgets Settings') }}</h2>
					<div v-for="(item, index) in settingsData" :key="`setting_${index}`"
						class="is-flex is-align-items-center item">
						<div class="is-flex is-align-items-center is-flex-grow-1">
							<b-icon :icon="getIcon(item.name)" pack="casa" class="mr-2"></b-icon>
							<b>{{ $t(getTitle(item.name)) }}</b>
						</div>
						<b-field>
							<b-switch v-model="item.show" class="is-flex-direction-row-reverse mr-0" size="is-small"
								type="is-dark" @input="handleInput"></b-switch>
						</b-field>
					</div>
				</b-dropdown-item>
			</b-dropdown>
		</div>

	</div>
</template>

<script>
import find from 'lodash/find';

const widgetsComponents = require.context(
	'@/widgets',
	false,
	/.vue$/
)


export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: "settings",
	data() {
		return {
			apps: [],
			settingsData: [],
			position: "is-top-left"
		}
	},
	model: {
		prop: 'widgetsSettings',
		event: 'change'
	},
	props: {
		widgetsSettings: Array
	},

	watch: {
		settingsData: {
			handler() {
				let offsetTop = 0
				if (this.$refs.wsettings) {
					offsetTop = this.$refs.wsettings.getBoundingClientRect().top
				} else {
					offsetTop = 251
				}
				this.position = offsetTop > 250 ? "is-top-left" : "is-bottom-left"
			},
			deep: true
		}

	},
	created() {
		this.settingsData = JSON.parse(JSON.stringify(this.widgetsSettings))
		widgetsComponents.keys().forEach(fileName => {
			const componentConfig = widgetsComponents(fileName)
			this.apps.push({ app: componentConfig })
		});
	},
	mounted() {
		window.addEventListener('resize', this.onRezise);

	},
	methods: {
		getIcon(value) {
			let obj = find(this.apps, o => {
				return o.app.default.name === value
			});
			return obj.app.default.icon;
		},
		getTitle(value) {
			let obj = find(this.apps, o => {
				return o.app.default.name === value
			});
			return obj.app.default.title;
		},
		handleInput() {
			this.$emit('change', this.settingsData)
		},
		onRezise() {
			// let container = document.querySelector(".scroll-area")
			//console.log(container.offsetHeight);
		}
	},
	destroyed() {
		window.addEventListener('resize', this.onRezise);
	},
}
</script>
<style lang="scss">
.wsettings {
	width: 100%;

	.item {
		margin: 1.25rem 0;
	}

	.circle-btn {
		background: rgba(123, 123, 123, 0.16);
		backdrop-filter: blur(24px);
		color: #fff;
		font-size: 1rem;
		height: 2.25rem;
		width: 2.25rem;
		padding-left: 0 !important;
		padding-right: 0 !important;

		&:hover,
		&:active {
			outline: none;
			color: #fff;
			opacity: 0.8;
		}

		&:focus {
			color: #fff;
			border-color: #fff;
		}

		&:focus:not(:active) {
			box-shadow: none;
		}
	}

	.dropdown {
		display: block !important;

		.dropdown-content {
			background: rgba(0, 0, 0, 0.8);
			backdrop-filter: blur(1rem);
			width: 16rem;
			border-radius: 0.5rem;

			.dropdown-item {
				padding: 1rem 1.5rem 0 1.5rem;
			}

			.switch input[type="checkbox"]+.check {
				background: transparent;
				border: #fff 1px solid;
			}
		}
	}
}
</style>
