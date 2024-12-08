<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/4/24 上午11:20
  * @FilePath: /CasaOS-UI/src/components/filebrowser/components/FileBreadcrumb.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->

<!--
 * @Author: JerryK
 * @Date: 2022-03-01 15:40:34
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-26 23:13:48
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\FileBreadcrumb.vue
-->
<template>
	<div>
		<b-breadcrumb size="is-medium">
			<b-breadcrumb-item v-for="(item,index) in pathCollection" v-show="item.show || item == activeHide"
							   :key="item+index"
							   :active="checkActive(index)" @click="open(item)">
				<template v-if="item == activeHide">
					<b-dropdown ref="breadDrop" :triggers="['']" animation="fade1" append-to-body aria-role="list"
								class="file-dropdown">
						<template #trigger>
							<p role="button">
								<b-icon id="das" custom-size="mdi-18px" icon="dots-horizontal">
								</b-icon>
							</p>
						</template>
						<b-dropdown-item v-for="(sitem,index) in hideItems" :key="'ff'+index" aria-role="menuitem"
										 @click="subOpen(sitem)">
							{{ sitem.name }}
						</b-dropdown-item>

					</b-dropdown>
				</template>
				<template v-else>
					{{ item.name }}
				</template>
			</b-breadcrumb-item>
		</b-breadcrumb>
		<b-breadcrumb id="shadowBread" class="shadow" size="is-medium">
			<b-breadcrumb-item v-for="(item,index) in pathCollection" :key="'fake'+item+index">
				{{ item.name }}
			</b-breadcrumb-item>
		</b-breadcrumb>
	</div>

</template>

<script>
import slice    from 'lodash/slice'
import map      from 'lodash/map'
import sum      from 'lodash/sum'
import remove   from 'lodash/remove'
import findLast from 'lodash/findLast'

export default {
	inject: ['filePanel'],
	data() {
		return {
			pathCollection: [],
			hideItems: [],
			activeHide: {}
		}
	},
	watch: {
		'$store.state.currentPath': {
			handler(val) {
				this.pathCollection = this.buildPathArray(val)
				this.onResize()
			},
			deep: true
		},
	},
	computed: {
		dropMenu() {
			return this.$refs.breadDrop[0]
		}
	},
	created() {
		this.pathCollection = this.buildPathArray(this.$store.state.currentPath)
	},
	mounted() {

	},
	methods: {
		open(item) {
			if (item == this.activeHide) {
				this.$refs.breadDrop[0].isActive = !this.$refs.breadDrop[0].isActive
				return false
			}
			this.filePanel.getFileList(item.path);
		},
		subOpen(item) {
			this.filePanel.getFileList(item.path);
			// this.onResize(this.pathArray)
		},
		checkActive(index) {
			return index == this.pathCollection.length - 1
		},
		onResize() {
			let shadowBread = document.getElementById("shadowBread")
			let containerWidth = document.getElementById("bread-container").clientWidth
			this.$nextTick(() => {
				this.hideItems = []
				let shadowBreadWidth = shadowBread.clientWidth
				if (shadowBreadWidth > containerWidth) {
					let shadowBreadList = shadowBread.getElementsByTagName("li")
					let shadowBreadListWidth = map(shadowBreadList, item => {
						return item.clientWidth
					})
					this.pathCollection.forEach((item, index) => {
						if (index > 0 && sum(shadowBreadListWidth) + 50 > containerWidth && index < this.pathCollection.length - 1) {
							remove(shadowBreadListWidth, (item, index) => {
								return index == 1
							})
							item.show = false
							this.hideItems.push(item)
						}
					})
					this.activeHide = findLast(this.pathCollection, (item) => {
						return !item.show
					})
				}
			})
		},

		buildPathArray(path) {
			if (path == "/") {
				path = path.substr(1);
			}
			let arr = path.split("/")
			let collection = arr.map((item, index) => {
				return {
					name: item == "" ? "Root" : item,
					show: true,
					path: item == "" ? "/" : slice(arr, 0, index + 1).join("/")
				}
			})
			return collection
		}
	}
}
</script>

<style>
</style>