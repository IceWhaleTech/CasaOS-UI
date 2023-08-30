<!--
  * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
  * @LastEditTime: 2023/8/29 下午3:49
  * @FilePath: /CasaOS-UI/main/src/components/Storage/CreatingStoragePanel.vue
  * @Description:
  *
  * Copyright (c) 2023 by IceWhale, All Rights Reserved.

  -->
<script setup>
import LottieAnimation                                   from "lottie-web-vue";
import {ref, defineProps, onMounted, getCurrentInstance} from "vue";
import {renderSize}                                      from "@/composables/localstorage";
import {ValidationObserver, ValidationProvider}          from "vee-validate";
import "@/plugins/vee-validate";
// import storage                                                            from "@/service/storage";

// const comp = defineComponent({mixin: [mixin]})
const {proxy} = getCurrentInstance()
const ob1 = ref(null)
// 设定props isCreating
const {unDiskData, createStorageNameDefault} = defineProps({
	unDiskData: {
		type: Array,
		default: []
	},
	createStorageNameDefault: {
		type: String,
		default: ""
	}
})
const isLoading = ref(false)
const isValidity = ref(false)
const isCreating = ref(false)
let createStorageName = ref("")
createStorageName.value = createStorageNameDefault
let createStoragePath = ref("")
let createStorageSerial = ref("")
let createStorageType = ref("")
let activeDisk = ref(0)

const $emit = defineEmits(['refresh:DiskList', 'close:CreatingStoragePanel'])

/**
 * @description: Create a new storage
 * @return {void}
 * @param needFormat
 */
function createStorage(needFormat) {
	isValidity.value = true
	checkStep(ob1.value).then(val => {
		isValidity.value = false
		if (val) {
			submitCreate(needFormat)
		}
	}).catch(err => {
		isValidity.value = false
		proxy.$buefy.toast.open({
			duration: 3000,
			message: err.response.data.message,
			type: 'is-danger'
		})
		console.error(err)
	})
}

function submitCreate(format) {
	isCreating.value = true
	let data = {
		path: createStoragePath.value,
		name: createStorageName.value,
		format: format
	}
	proxy.$api.storage.create(data).then((res) => {
		if (res.status !== 200) {
			isCreating.value = false;
			proxy.$buefy.toast.open({
				duration: 3000,
				message: res.data.message,
				type: 'is-danger'
			})
			console.error(res.data.message)
		} else {
			$emit('refresh:DiskList', true)
		}
	}).catch(err => {
		isCreating.value = false
		proxy.$buefy.toast.open({
			duration: 3000,
			message: err.response.data.message,
			type: 'is-danger'
		})
		console.error(err)
	})
}

/**
 * @description: Validate form async
 * @param {Object} ref ref of component
 * @return {Boolean}
 */
function checkStep(ref) {
	return ref.validate()
}

/**
 * @description: Disk choose handle
 * @return {void}
 * @param index
 */
function onDiskChoose(index) {
	createStoragePath.value = unDiskData[index].path
	createStorageSerial.value = unDiskData[index].serial
	createStorageType.value = getDiskType(unDiskData[index])
}

function getDiskType(item) {
	return item.need_format ? "format" : "mountable"
}

onMounted(() => {
	onDiskChoose(0)
})
</script>

<template>
	<div>
		<template v-if="!isCreating">
			<header class="pl-5 mt-4 pt-1 b-line">
				<h3 class="title is-3 mb-3">{{ $t('Create Storage') }}</h3>
				<div class="close-container">
					<button class="delete" type="button" @click="$emit('close')"/>
				</div>
			</header>
			<section class="pr-5 pl-5 mt-4 pb-2">
				<!-- Create Storage Start -->
				<div class="is-flex-grow-1 is-relative">
					<ValidationObserver ref="ob1">
						<ValidationProvider v-slot="{ errors, valid }" name="StorageName" rules="required">
							<b-field :label="$t('Storage Name')" :message="$t(errors)"
									 :type="{ 'is-danger': errors[0], 'is-success': valid }">
								<b-input v-model="createStorageName"
										 @keyup.native="createStorageName = createStorageName.replace(/[^\w]/g, '')"
										 @paste.native="createStorageName = createStorageName.replace(/[^\w]/g, '')"></b-input>
							</b-field>
						</ValidationProvider>

						<b-field :label="$t('Choose Drive')">
							<b-select v-model="activeDisk" expanded @input="onDiskChoose">
								<option v-for="(option, index) in unDiskData" :key="option.path" :value="index">
									{{ option.name }} ({{ option.model }} - {{ renderSize(option.size) }})
								</option>
							</b-select>
						</b-field>

					</ValidationObserver>

					<article v-if="createStorageType === 'format'" class="message is-danger mt-5">
						<section class="message-body">
							<div class="media">
								<div class="media-left">
								<span class="icon is-large is-danger"><i
								class="mdi mdi-alert-circle mdi-48px"></i></span>
								</div>
								<div class="media-content">
									<h3 class="is-size-5">{{ $t('Warning') }}</h3>
									<p class="is-size-14px">
										{{ $t("The selected drive will be emptied.") }}<br>
										{{
											$t(`Please make sure again that there is no important data on the selected drive
										that needs to be
										backed up.`)
										}}
									</p>
								</div>
							</div>
						</section>
					</article>

					<article v-else class="message is-danger mt-5">
						<section class="message-body">
							<div class="media">
								<div class="media-left">
								<span class="icon is-large is-danger"><i
								class="mdi mdi-alert-circle mdi-48px"></i></span>
								</div>
								<div class="media-content">
									<h3 class="is-size-5">{{ $t('Attention') }}</h3>
									<p class="is-size-14px">
										{{ $t("The drive you select can be used directly as storage.") }}<br>
										{{
											$t(`You can also choose to create it after formatting. If formatted, the
										selected drive will be
										emptied.`)
										}}<br>
										{{
											$t(`Please make sure again that there is no important data on the selected drive
										that needs to be
										backed up.`)
										}}
									</p>
								</div>
							</div>
						</section>
					</article>

				</div>
				<b-loading v-model="isLoading" :can-cancel="false" :is-full-page="false"></b-loading>
			</section>
		</template>
		<!-- Create Storage End -->
		<section v-else class="modal-card-body ">
			<div class="installing-warpper mt-6 mb-6">
				<div class="is-flex is-align-items-center is-justify-content-center mb-5">
					<lottie-animation :animationData="require('@/assets/ani/creating.json')" :autoPlay="true"
									  :loop="true"
									  class="creating-animation"></lottie-animation>
				</div>
				<h3 class="title is-4 has-text-centered has-text-weight-light">{{ $t('Creation in progress') }}...</h3>
			</div>
		</section>
		<!-- Modal-Card Footer Start-->
		<footer v-if="!isCreating" class="modal-card-foot is-flex is-align-items-center">
			<div class="is-flex-grow-1"></div>
			<div>
				<b-button :label="$t('Cancel')" rounded @click="$emit('close:CreatingStoragePanel')"/>
				<b-button :label="$t('Format and Create')" :loading="isValidity"
						  :type="createStorageType === 'format' ? 'is-primary' : ''" rounded
						  @click="createStorage(true)"/>
				<b-button v-if="createStorageType === 'mountable'" :label="$t('Create')" :loading="isValidity"
						  rounded
						  type="is-primary" @click="createStorage(false)"/>
			</div>
		</footer>
		<!-- Modal-Card Footer End -->
	</div>
</template>

<style lang="scss" scoped>

</style>