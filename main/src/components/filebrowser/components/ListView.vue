<template>
	<div id="select-container" class="node-list fliebroswer is-flex is-flex-direction-column w-full scroll-container scrollbars-light ">


		<div class=" is-flex-grow-1 is-flex">
			<div  class="is-relative is-grow-1 w-full" :class="containerHeight"
				@contextmenu.prevent="openContextMenu" @mousedown.stop="onDragSelectionStart">
				<!-- Empty Content Slot Start -->
				<div v-if="listData.length == 0 && !isLoading"
					class="is-flex is-align-items-center is-justify-content-center empty-container">
					<slot></slot>
				</div>
				<!-- Empty Content Slot End -->
				<div class="select-parent"  >
					<!-- Table header Start -->
					<div class="table-thead is-unselectable" >
						<div class="tr-wrapper">
							<div class="tr">
								<div class="th"></div>
								<div v-for="header in headerList" class="th" v-if="isMobile ? header.showOnMobile : true"
									@click="onHeaderClick(header)">
									<div class="one-line">{{ $t(header.text) }}</div>
									<b-icon v-show="sort === header.sort" icon="expand-down" class="is-18 ml-1"
										custom-size="casa-18px" :class="{ asc: order === 'asc' }">
									</b-icon>
								</div>
							</div>
						</div>
					</div>
					<!-- Table header End -->
					<!-- Table body Start -->
					<div class="tbody card-container">
						<div v-for="(item, index) in listData" :key="'list-' + index + item.name" :data-rel="index"
							class="tr-wrapper rdata">
							<div :class="{
								isCutting: getCardState(item),
								active: item.isSelected,
							}" class="tr is-unselectable" @click="onCardClick($event, item, index)"
								@contextmenu.prevent="openContextMenu($event, item)" @mousedown.stop="">
								<div class="td is-flex is-flex-direction-column justify-content-center">
									<!-- CheckBox Start -->
									<b-field :class="{ show: isMobile || item.isSelected }"
										class="checkbox-container is-flex mr-0 mb-0 is-flex-grow-1">
										<b-checkbox v-model="item.isSelected" size="is-small" class="mr-0"
											@input="handleCheckboxInput($event, index)"></b-checkbox>
									</b-field>
									<!-- CheckBox End -->
								</div>
								<div class="td is-flex-grow-1 mr-2">
									<div class="cover is-flex-shrink-0">
										<list-icon-container :item="item"></list-icon-container>
									</div>
									<div class="text is-flex-grow-1">
										{{ item.name }}
										<span v-if="isMobile" class="is-size-7 is-block has-text-grey-light">{{ item.date |
											dateFmt }}</span>
									</div>
									<div class="action-wrapper is-flex-shrink-0">
										<!-- Action Button Start -->
										<action-button :class="{ show: isMobile }" :cols="cols" :index="index" :item="item"
											@reload="$emit('reload')"></action-button>
										<!-- Action Button End -->
									</div>
								</div>
								<div v-if="!isMobile" class="td">
									<div v-show="!item.is_dir" class="one-line is-size-7">{{ getFileExt(item) }}</div>
								</div>
								<div v-if="!isMobile" class="td">
									<div class="one-line is-size-7">{{ item.date | dateFmt }}</div>
								</div>
								<div v-if="!isMobile" class="td">
									<div v-if="!item.is_dir" class="one-line is-size-7">
										{{ item.size | renderSize }}
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- Table body End -->
					<!-- SelectDivLayer Start -->
					<div v-show="isShowSeBox" id="selection"></div>
					<!-- SelectDivLayer End -->
				</div>
			</div>
			<!-- Context Menu Start -->
			<context-menu ref="ctxMenu" @reload="$emit('reload')"></context-menu>
			<!-- Context Menu End -->
		</div>


	</div>
</template>
  
<script>
import { mixin } from "@/mixins/mixin";
import ListViewMixin from "@/mixins/ListViewMixin";
import BreakpointMixin from "vue-breakpoint-mixin";
import ActionButton from "./ActionButton.vue";
import ContextMenu from "./ContextMenu.vue";
import ListIconContainer from "./ListIconContainer.vue";

export default {
	name: "list-view",
	components: {
		ActionButton,
		ContextMenu,
		ListIconContainer,
	},
	mixins: [mixin, ListViewMixin, BreakpointMixin],
	data() {
		return {
			cols: 1000,
			colStyle: {
				width: "",
			},
			headerList: [
				{
					text: 'File name',
					sort: 'name',
					showOnMobile: true,
				},
				{
					text: 'Type',
					sort: 'format',
				},
				{
					text: 'Date Modified',
					sort: 'date',
				},
				{
					text: 'Size',
					sort: 'size',
				},
			],
		};
	},

	created() {
		this.SELECT_BOX = "selection";
		this.PARENT_BOX = "select-container";
		this.SELECT_ITEM = ".tr-wrapper";
		this.M_WIDTH = 768;
	},
	computed: {
		containerHeight() {
			return this.isMobile ? "mobile-list-height" : "";
		},
		sort() {
			return this.$store.state.sort;
		},
		order() {
			return this.$store.state.order;
		},
	},
	methods: {
		onHeaderClick(header) {
			if (this.sort === header.sort) {
				this.$emit('reorder', { sort: header.sort, order: this.order === 'asc' ? 'desc' : 'asc' });
			} else {
				this.$emit('reorder', { sort: header.sort, order: 'asc' });
			}
		}
	},
};
</script>
  