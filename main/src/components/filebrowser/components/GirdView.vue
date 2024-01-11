<template>
	<div
		id="select-container"
		:class="containerHeight"
		class="scroll-container scrollbars-light is-relative w-full"
		@contextmenu.prevent="openContextMenu"
		@mousedown.left.prevent="onDragSelectionStart"
	>
		<!-- Empty Content Slot Start -->
		<div
			v-if="listData.length == 0 && !isLoading"
			class="is-flex is-align-items-center is-justify-content-center empty-container"
		>
			<slot></slot>
		</div>
		<!-- Empty Content Slot End -->
		<div class="content-components select-parent">
			<div id="card-container" class="card-container">
				<div
					v-for="(item, index) in listData"
					:key="'list-' + index + item.name"
					:data-rel="index"
					:style="colStyle"
					class="grid-card rdata selectable"
				>
					<div class="file-card">
						<div :data-rel="index" class="file-card-item" @mousedown.stop="">
							<div class="node-card-container">
								<div :class="{ active: item.isSelected }" class="outer-wrapper">
									<div
										:class="{ isCutting: getCardState(item) }"
										class="node-card is-unselectable"
										@click.stop="onCardClick($event, item, index)"
										@contextmenu.prevent="openContextMenu($event, item)"
									>
										<div class="cover">
											<icon-container :item="item"></icon-container>
										</div>
										<div class="info">
											<p class="title" >{{ item.name }}</p>
											<p class="desc">{{ item.date | dateFmt }}</p>
										</div>
									</div>

									<!-- CheckBox Start -->
									<b-field
										:class="{ show: isMobile || item.isSelected }"
										class="checkbox-container is-flex"
									>
										<b-checkbox
											v-model="item.isSelected"
											size="is-small"
											@input="handleCheckboxInput($event, index)"
										></b-checkbox>
									</b-field>
									<!-- CheckBox End -->

									<!-- Action Button Start -->
									<action-button
										:class="{ show: isMobile }"
										:cols="cols"
										:index="index"
										:item="item"
										@reload="$emit('reload')"
										@showDetailModal="$emit('showDetailModal', item)"
									></action-button>
									<!-- Action Button End -->
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- SelectDivLayer Start -->
			<div v-show="isShowSeBox" id="selection"></div>
			<!-- SelectDivLayer End -->
		</div>

		<!-- Context Menu Start -->
		<context-menu ref="ctxMenu" @reload="$emit('reload')"></context-menu>
		<!-- Context Menu End -->
	</div>
</template>

<script>
import {mixin}       from "@/mixins/mixin";
import ListViewMixin from "@/mixins/ListViewMixin";
import ActionButton  from "./ActionButton.vue";
import ContextMenu   from "./ContextMenu.vue";
import IconContainer from "./IconContainer.vue";

export default {
	name: "gird-view",
	mixins: [mixin, ListViewMixin],
	components: {
		ActionButton,
		ContextMenu,
		IconContainer,
	},
	computed: {
		containerHeight() {
			return this.isMobile ? "mobile-height" : "";
		}
	},
	data() {
		return {
			cols: 1,
			colStyle: {
				width: "33.3333%",
			},
			isGird: true,
		};
	},
	created() {
		this.CARD_CONTAINER = "card-container";
		this.SELECT_BOX = "selection";
		this.PARENT_BOX = "select-container";
		this.SELECT_ITEM = ".file-card-item";
		this.CARD_WIDTH = 144;
		this.M_WIDTH = 768;
	},
};
</script>
