<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-03-01 21:10:57
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-08-27 17:19:20
 * @FilePath: /CasaOS-UI/src/components/Apps/AppPanel.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.

-->


<template>
  <div :class="{'narrow': currentSlide > 0}" class="modal-card app-card">
    <!--    first setting！！ apps installation location-->
    <!--    TODO v-if-->
    <template v-if="true">
      <!--      <apps-installation-location></apps-installation-location>-->
      <header class="modal-card-head b-line">
        <div class="is-flex-grow-1">
          <h3 class="is-flex-grow-1 title is-3">apps installation location</h3>
        </div>
        <button class="delete" type="button" @click="$emit('close')"/>
      </header>
      <section class="modal-card-body">
        <ValidationObserver>
          <storage-item v-for="(item,index) in storageData" :key="'storage'+index" :item="item"
                        :scence="storage_item_scence"
                        @getDiskList="getDiskList" @selection="getSelection"></storage-item>
        </ValidationObserver>

      </section>
    </template>
    <!--    first setting have done!!-->
    <template v-else>
      <!-- Sidebar Start -->
      <app-side-bar v-model="sidebarOpen" :overlay="true" :right="true" position="absolute">
        <template slot-scope="{close}">
          <div class="modal-card app-detial">
            <!-- Header Start -->
            <header class="modal-card-head" style="background:#ff000">
              <div class="is-flex-grow-1">
                <div class="button is-ghost auto-height pl-0 pt-0 pb-0" @click="close">
                  <b-icon class="mr-1" icon="chevron-left" size="is-medium"></b-icon>
                  {{ $t('Back') }}
                </div>
              </div>
            </header>
            <!-- Header End -->
            <section id="ss-content" class="modal-card-body">
              <!-- App Info Header Start -->
              <div class="app-header is-flex pb-4 b-line">
                <div class="header-icon mr-5">
                  <b-image :key="appDetailData.icon" :src="appDetailData.icon"
                           :src-fallback="require('@/assets/img/app/default.png')" class="is-128x128 icon-shadow"
                           webp-fallback=".jpg"></b-image>
                </div>
                <div class="is-flex-grow-1 is-flex is-align-items-center">
                  <div>
                    <h4 class="title store-title is-4 ">{{ appDetailData.title }}</h4>
                    <p class="subtitle is-size-14px two-line">{{ appDetailData.tagline }}</p>
                    <p class="description">
                      <b-button :loading="appDetailData.id == currentInstallId" rounded size="is-normal"
                                type="is-primary" @click="qucikInstall(appDetailData.id)">{{ $t('Install') }}
                      </b-button>
                    </p>
                  </div>
                </div>
              </div>
              <!-- App Info Header End -->
              <!-- App Info Table Start -->
              <nav class="level is-mobile mt-4">
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">{{ $t('CATEGORY') }}</p>
                    <p class="title">
                      <b-icon :icon="appDetailData.category_font" custom-size="mdi-36px"></b-icon>
                    </p>
                    <p class="footing is-size-14px">{{ appDetailData.category }}</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">{{ $t('DEVELOPER') }}</p>
                    <p class="title">
                      <b-icon custom-size="mdi-36px" icon="account-circle-outline"></b-icon>
                    </p>
                    <p class="footing is-size-14px">{{ appDetailData.developer }}</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading "><span class="is-hidden-mobile">{{ $t('REQUIRE') }} </span>{{ $t('MEMORY') }}</p>
                    <p class="title has-text-weight-normal">{{ appDetailData.min_memory }}</p>
                    <p class="footing is-size-14px">MB</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading"><span class="is-hidden-mobile">{{ $t('REQUIRE') }} </span>{{ $t('DISK') }}</p>
                    <p class="title has-text-weight-normal">{{ appDetailData.min_disk }}</p>
                    <p class="footing is-size-14px">MB</p>
                  </div>
                </div>
              </nav>
              <!-- App Info Table End -->

              <!-- App Info Slider Start -->
              <div v-if="showDetailSwiper" class="is-relative">
                <swiper ref="infoSwiper" :options="swiperOptions" class="swiper swiper-responsive-breakpoints">
                  <swiper-slide v-for="item in appDetailData.screenshot_link" :key="'sc'+item">
                    <div class="gap">
                      <b-image :src="item" :src-fallback="require('@/assets/img/app/swiper_placeholder.png')"
                               class="border-8" placeholder ratio="16by9"></b-image>
                    </div>
                  </swiper-slide>

                </swiper>
                <div :class="{'swiper-button-disabled':disPrev}" class="swiper-button-prev"
                     @click="$refs.infoSwiper.$swiper.slidePrev()"></div>
                <div :class="{'swiper-button-disabled':disNext}" class="swiper-button-next"
                     @click="$refs.infoSwiper.$swiper.slideNext()"></div>
              </div>

              <!-- App Info Slider End -->

              <!-- App Info  Start -->
              <div class="app-desc mt-4 mb-6">
                <p class="is-size-14px mb-2 un-break-word">{{ appDetailData.tagline }}</p>
                <p class="is-size-14px un-break-word">{{ appDetailData.description }}</p>
                <!-- <p class="is-size-14px " v-html="appDetailData.tip"></p> -->
              </div>
              <!-- App Info  End -->

            </section>
          </div>

        </template>
      </app-side-bar>
      <!-- Sidebar End -->

      <!-- Modal-Card Header Start -->
      <header class="modal-card-head">
        <div class="is-flex-grow-1">
          <h3 class="title is-3">{{ panelTitle }}</h3>
        </div>
        <div class="is-flex is-align-items-center">
          <b-button v-if="currentSlide == 0" :label="$t('Custom Install')" class="mr-2" icon-left="view-grid-plus"
                    rounded size="is-small" type="is-primary" @click="currentSlide = 1"/>

          <b-tooltip v-if="showImportButton" :label="$t('Import')" position="is-bottom" type="is-dark">
            <button class="icon-button mdi mdi-import" type="button" @click="showImportPanel"/>
          </b-tooltip>

          <b-tooltip v-if="showTerminalButton" :label="$t('Terminal & Logs')" position="is-bottom" type="is-dark">
            <button class="icon-button mdi mdi-console" type="button" @click="showTerminalPanel"/>
          </b-tooltip>

          <b-tooltip v-if="showExportButton" :label="$t('Export AppFile')" position="is-bottom" type="is-dark">
            <button class="icon-button mdi mdi-export-variant" type="button" @click="exportJSON"/>
          </b-tooltip>
          <div v-if="currentSlide < 2"
               class="is-flex is-align-items-center modal-close-container modal-close-container-line">
            <button class="delete" type="button" @click="$emit('close')"/>
          </div>

        </div>

      </header>
      <!-- Modal-Card Header End -->
      <!-- Modal-Card Body Start -->
      <section class="modal-card-body">
        <!-- App Store List Start -->
        <section v-if="currentSlide == 0 ">

          <template v-if="!isLoadError">

            <template v-if="recommendList.length > 0">
              <h3 class="title is-5 has-text-weight-normal">{{ $t('Featured Apps') }}</h3>
              <!-- Featured Slider Start -->
              <div class="is-relative featured-app b-line">
                <swiper ref="featureSwiper" :options="featureSwiperOptions" class="swiper ">
                  <swiper-slide v-for="(item,index) in recommendList " :key="index+item.title+item.id" class="pb-5">
                    <div class="gap" @click="showAppDetial(item.id)">
                      <b-image :placeholder="require('@/assets/img/app/swiper_placeholder.png')" :src="item.thumbnail"
                               :src-fallback="require('@/assets/img/app/swiper_placeholder.png')"
                               class="border-8 is-clickable"
                               ratio="16by9"></b-image>
                    </div>
                    <div class="is-flex pt-5 is-align-items-center">
                      <div class=" mr-3" @click="showAppDetial(item.id)">
                        <b-image :placeholder="require('@/assets/img/app/default.png')" :src="item.icon"
                                 :src-fallback="require('@/assets/img/app/default.png')"
                                 class="is-64x64 is-clickable icon-shadow"></b-image>
                      </div>
                      <div class="is-flex-grow-1 mr-4 is-clickable" @click="showAppDetial(item.id)">
                        <h6 class="title is-6 mb-2 ">{{ item.title }}</h6>
                        <p class="is-size-7 two-line">{{ item.tagline }}</p>
                      </div>
                      <div>
                        <b-button :loading="item.id == currentInstallId" rounded size="is-small"
                                  type="is-primary is-light"
                                  @click="qucikInstall(item.id)">{{ $t('Install') }}
                        </b-button>
                      </div>
                    </div>
                  </swiper-slide>

                </swiper>
                <div :class="{'swiper-button-disabled':disFeaturedPrev}" class="swiper-button-prev"
                     @click="$refs.featureSwiper.$swiper.slidePrev()"></div>
                <div :class="{'swiper-button-disabled':disFeaturedNext}" class="swiper-button-next"
                     @click="$refs.featureSwiper.$swiper.slideNext()"></div>
              </div>
            </template>
            <!-- Featured Slider End -->

            <!-- List condition Start -->
            <div class="is-flex mt-5 mb-5">
              <!-- Cate Start -->
              <div class="is-flex-grow-1">
                <b-dropdown v-model="currentCate" :mobile-modal="false" animation="fade1"
                            aria-role="list" class="app-select file-dropdown" position="is-bottom-right" scrollable>
                  <template #trigger="{ active }">
                    <div class="button is-text auto-height pl-0 pt-0 pb-0 ">
                      <b-icon :icon="currentCate.font" class="mr-1 ml-0" size="is-small"></b-icon>
                      {{ currentCate.name }}
                      <b-icon :icon="active ? 'chevron-up' : 'chevron-down'" class="ml-1" size="is-normal"></b-icon>
                    </div>
                  </template>
                  <b-dropdown-item v-for="menu in cateMenu" :key="menu.id"
                                   :class="menu.id == currentCate.id?'is-active':''" :data-title="menu.count"
                                   :value="menu" aria-role="listitem">
                    <div class="media is-align-items-center is-flex">
                      <b-icon :icon="menu.font" class="mr-1" size="is-small"></b-icon>
                      <div class="media-content">
                        <h3>{{ menu.name }}</h3>
                      </div>
                    </div>
                  </b-dropdown-item>
                </b-dropdown>

              </div>
              <!-- Cate End -->

              <!-- Sort Start -->
              <div>
                {{ $t('Sort by') }}:
                <b-dropdown v-model="currentSort" :mobile-modal="false" animation="fade1"
                            aria-role="list" class="app-select file-dropdown" position="is-bottom-right">
                  <template #trigger="{ active }">
                    <div class="button is-text auto-height pl-0 pt-0 pb-0 is-size-14px">
                      {{ currentSort.name }}
                      <b-icon :icon="active ? 'chevron-up' : 'chevron-down'" class="ml-1" size="is-normal"></b-icon>
                    </div>

                  </template>
                  <b-dropdown-item v-for="(menu,index) in sortMenu" :key="'sort_'+index"
                                   :class="menu.slash == currentSort.slash?'is-active':''"
                                   :value="menu" aria-role="listitem">
                    <div class="media align-items-center is-flex">
                      <div class="media-content">
                        <h3>{{ menu.name }}</h3>
                      </div>
                    </div>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <!-- Sort End -->
            </div>

            <!-- List condition End -->
            <!-- App list Start-->
            <div class="columns f-list is-multiline is-mobile pb-3 mb-5">
              <div v-for="(item,index) in pageList" :key="index+item.title+item.id"
                   class="column app-item is-one-quarter">
                <div class="is-flex  is-align-items-center">
                  <div class="list-icon mr-4 is-clickable" @click="showAppDetial(item.id)">
                    <b-image :src="item.icon" :src-fallback="require('@/assets/img/app/default.png')"
                             class="is-64x64 icon-shadow" webp-fallback=".jpg"></b-image>
                  </div>
                  <div class="is-flex-grow-1 mr-4 is-clickable" @click="showAppDetial(item.id)">
                    <h6 class="title is-6 mb-2">{{ item.title }}</h6>
                    <p class="is-size-7 two-line">{{ item.tagline }}</p>
                  </div>

                </div>
                <div class="mt-1 ml-7 is-flex is-align-items-center">
                  <div class="is-flex-grow-1 is-size-7 has-text-grey-light	">{{ item.category }}</div>
                  <b-button :loading="item.id == currentInstallId" rounded size="is-small" type="is-primary is-light"
                            @click="qucikInstall(item.id)">{{ $t('Install') }}
                  </b-button>
                </div>
              </div>
            </div>

            <!-- App list End-->

            <!-- Community App List Start -->
            <template v-if="communityList.length > 0">
              <h3 class="title is-5 has-text-weight-normal">{{ $t('Community Apps') }}</h3>
              <h3 class="subtitle is-7 has-text-grey-light">
                {{
                  $t('From community contributors, not optimized for CasaOS, but provides a basic App experience.')
                }}</h3>

              <div class="columns f-list is-multiline is-mobile  pb-3 mb-5">
                <div v-for="(item,index) in communityList " :key="index+item.title+item.id"
                     class="column is-one-quarter">
                  <div class="is-flex  is-align-items-center">
                    <div class="list-icon mr-4 is-clickable" @click="showAppDetial(item.id)">
                      <b-image :src="item.icon" :src-fallback="require('@/assets/img/app/default.png')"
                               class="is-64x64 icon-shadow" webp-fallback=".jpg"></b-image>
                    </div>
                    <div class="is-flex-grow-1 mr-4 is-clickable" @click="showAppDetial(item.id)">
                      <h6 class="title is-6 mb-2">{{ item.title }}</h6>
                      <p class="is-size-7 two-line">{{ item.tagline }}</p>
                    </div>

                  </div>
                  <div class="mt-1 ml-7 is-flex is-align-items-center">
                    <div class="is-flex-grow-1 is-size-7 has-text-grey-light	">{{ item.category }}</div>
                    <b-button :loading="item.id == currentInstallId" rounded size="is-small" type="is-primary is-light"
                              @click="qucikInstall(item.id)">{{ $t('Install') }}
                    </b-button>
                  </div>
                </div>
              </div>
            </template>

            <!-- Community App List End -->
          </template>
          <template v-else>
            <div class="is-flex is-align-items-center is-justify-content-center mt-6 mb-6">
              <div class=" has-text-centered mt-6 mb-6">
                <div class="is-flex is-align-items-center mb-5">
                  <b-icon class="mr-2" icon="alert-circle" type="is-danger"></b-icon>
                  {{ $t('There was an error loading the data, please try again!') }}
                </div>

                <b-button rounded type="is-primary" @click="retry()">Retry</b-button>

              </div>

            </div>
          </template>

        </section>
        <!-- App Store List End -->

        <!-- App Install Form Start -->
        <section v-if="currentSlide == 1">
          <ValidationObserver ref="ob1">

            <ValidationProvider v-slot="{ errors, valid }" name="Image" rules="required">
              <b-field :label="$t('Docker Image')+' *'" :message="$t(errors)"
                       :type="{ 'is-danger': errors[0], 'is-success': valid }">
                <b-input v-model="initData.image" :placeholder="$t('e.g.,hello-world:latest')"
                         :readonly="state == 'update'" @input="changeIcon"></b-input>
                <!-- <b-autocomplete :data="data" placeholder="e.g. hello-world:latest" field="image" :loading="isFetching" @typing="getAsyncData" @select="option => portSelected = option" v-model="initData.image" :readonly="state == 'update'"></b-autocomplete> -->
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, valid }" name="Name" rules="required">
              <b-field :label="$t('App name')+' *'" :message="errors"
                       :type="{ 'is-danger': errors[0], 'is-success': valid }">
                <b-input v-model="initData.label" :placeholder="$t('Your custom App Name')" maxlength="40"></b-input>
              </b-field>
            </ValidationProvider>
            <b-field :label="$t('Icon URL')">
              <p class="control">
              <span class="button is-static container-icon">
                <b-image :key="appIcon" :src="appIcon" :src-fallback="require('@/assets/img/app/default.png')"
                         class="is-32x32" ratio="1by1"></b-image>
              </span>
              </p>
              <b-input v-model="initData.icon" :placeholder="$t('Your custom icon URL')" expanded></b-input>
            </b-field>

            <b-field label="Web UI">
              <!-- <p class="control">
                <span class="button is-static">{{baseUrl}}</span>
              </p> -->
              <b-select v-model="initData.protocol">
                <option value="http">http://</option>
                <option value="https">https://</option>
              </b-select>
              <b-input v-model="initData.host" :placeholder="baseUrl" expanded></b-input>
              <b-autocomplete v-model="initData.port_map" :data="bridgePorts" :open-on-focus="true"
                              :placeholder="$t('Port')" class="has-colon" field="host"
                              @select="option => (portSelected = option)"></b-autocomplete>
              <b-input v-model="initData.index" :placeholder="'/index.html '+ $t('[Optional]')" expanded></b-input>
            </b-field>
            <template v-if="isCasa">

              <b-field :label="$t('Network')">
                <b-select v-model="initData.network_model" expanded placeholder="Select">
                  <optgroup v-for="net in networks" :key="net.driver" :label="net.driver">
                    <option v-for="(option,index) in net.networks" :key="option.name+index" :value="option.name">
                      {{ option.name }}
                    </option>
                  </optgroup>
                </b-select>
              </b-field>

              <ports v-if="showPorts" v-model="initData.ports" :showHostPost="showHostPort"></ports>
              <input-group v-model="initData.volumes" :label="$t('Volumes')"
                           :message="$t('No volumes now, click “+” to add one.')"
                           type="volume"></input-group>
              <env-input-group v-model="initData.envs" :label="$t('Environment Variables')"
                               :message="$t('No environment variables now, click “+” to add one.')"></env-input-group>
              <input-group v-model="initData.devices" :label="$t('Devices')"
                           :message="$t('No devices now, click “+” to add one.')"
                           type="device"></input-group>
              <commands-input v-model="initData.cmd" :label="$t('Container Command')"
                              :message="$t('No commands now, click “+” to add one.')"></commands-input>

              <b-field :label="$t('Privileged')">
                <b-switch v-model="initData.privileged"></b-switch>
              </b-field>

              <b-field :label="$t('Memory Limit')">
                <vue-slider v-model="initData.memory" :max="totalMemory" :min="256"></vue-slider>
              </b-field>

              <b-field :label="$t('CPU Shares')">
                <b-select v-model="initData.cpu_shares" :placeholder="$t('Select')" expanded>
                  <option value="10">{{ $t('Low') }}</option>
                  <option value="50">{{ $t('Medium') }}</option>
                  <option value="90">{{ $t('High') }}</option>
                </b-select>
              </b-field>

              <b-field :label="$t('Restart Policy')">
                <b-select v-model="initData.restart" :placeholder="$t('Select')" expanded>
                  <option value="on-failure">on-failure</option>
                  <option value="always">always</option>
                  <option value="unless-stopped">unless-stopped</option>
                </b-select>
              </b-field>

              <b-field :label="$t('Container Capabilities (cap-add)')">
                <b-taginput ref="taginput" v-model="initData.cap_add" :allow-new="false" :data="capArray"
                            :open-on-focus="false"
                            autocomplete @typing="getFilteredTags">
                  <template slot-scope="props">
                    {{ props.option }}
                  </template>
                  <template #empty>
                    There are no items
                  </template>
                  <template #portSelected="props">
                    <b-tag v-for="(tag, index) in props.tags" :key="index" :tabstop="false" closable
                           @close="$refs.taginput.removeTag(index, $event)">
                      {{ tag }}
                    </b-tag>
                  </template>
                </b-taginput>
              </b-field>

              <ValidationProvider v-slot="{ errors, valid }" name="Name" rules="rfc1123">
                <b-field :label="$t('Container Hostname')" :message="$t(errors)"
                         :type="{ 'is-danger': errors[0], 'is-success': valid }">
                  <b-input v-model="initData.host_name" :placeholder="$t('Hostname of app container')"
                           value=""></b-input>
                </b-field>
              </ValidationProvider>

              <b-field :label="$t('App Description')">
                <b-input v-model="initData.description"></b-input>
              </b-field>
            </template>

          </ValidationObserver>
        </section>
        <!-- App Install Form End -->

        <!-- App Install Process Start -->
        <section v-if="currentSlide == 2">
          <div class="installing-warpper">
            <div class="is-flex is-align-items-center is-justify-content-center">
              <lottie-animation :animationData="require('@/assets/ani/rocket-launching.json')" :autoPlay="true"
                                :loop="true" class="install-animation"></lottie-animation>
            </div>
            <h3 :class="currentInstallAppTextClass" class="title is-6 has-text-centered"
                v-html="currentInstallAppText"></h3>
          </div>
        </section>
        <!-- App Install Process End -->
        <b-loading v-model="isLoading" :can-cancel="false" :is-full-page="false"></b-loading>
      </section>
      <!-- Modal-Card Body End -->

      <!-- Modal-Card Footer Start-->
      <footer :class="{'is-justify-content-center':currentSlide == 0}"
              class="modal-card-foot is-flex is-align-items-center ">
        <template>
          <div class="is-flex-grow-1">
            <!-- <div v-if="currentSlide == 0">
              <b-pagination v-if="listTotal > pageSize" :total="listTotal" v-model="pageIndex" range-before=1 range-after=1 order="is-centered" size="is-small" :simple="false" :rounded="true" :per-page="pageSize" icon-prev="chevron-left" icon-next="chevron-right" aria-next-label="Next page" aria-previous-label="Previous page" aria-page-label="Page" aria-current-label="Current page">
              </b-pagination>
            </div> -->
          </div>
          <div>
            <b-button v-if="currentSlide == 2 && currentInstallAppError " :label="$t('Back')" rounded
                      @click="prevStep"/>
            <b-button v-if="currentSlide == 1 && state == 'install'" :label="$t('Install')" :loading="isLoading"
                      rounded type="is-primary" @click="installApp()"/>
            <b-button v-if="currentSlide == 1 && state == 'update'" :label="$t('Save')" :loading="isLoading"
                      rounded type="is-primary" @click="updateApp()"/>
            <b-button v-if="currentSlide == 2 && !currentInstallAppError" :label="$t(cancelButtonText)"
                      rounded type="is-primary" @click="$emit('close')"/>
          </div>
        </template>

      </footer>
      <!-- Modal-Card Footer End -->
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import InputGroup from '../forms/InputGroup.vue';
import EnvInputGroup from '../forms/EnvInputGroup.vue';
import CommandsInput from '../forms/CommandsInput.vue';
import Ports from '../forms/Ports.vue'
import AppSideBar from './AppSideBar.vue'
import ImportPanel from '../forms/ImportPanel.vue'
import AppTerminalPanel from './AppTerminalPanel.vue'
import LottieAnimation from "lottie-web-vue";
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import {ValidationObserver, ValidationProvider} from "vee-validate";
import "@/plugins/vee-validate";
import debounce from 'lodash/debounce'
import find from 'lodash/find';
import uniq from 'lodash/uniq';
import isNull from 'lodash/isNull'
import orderBy from 'lodash/orderBy';
import cloneDeep from 'lodash/cloneDeep';
import last from 'lodash/last';
import FileSaver from 'file-saver';
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
// import AppsInstallationLocation from "@/components/Apps/AppsInstallationLocation";
import storageItem from "@/components/Storage/StorageItem";


const data = [
  "AUDIT_CONTROL",
  "AUDIT_READ",
  "BLOCK_SUSPEND",
  "BPF",
  "CHECKPOINT_RESTORE",
  "DAC_READ_SEARCH",
  "IPC_LOCK",
  "IPC_OWNER",
  "LEASE",
  "LINUX_IMMUTABLE",
  "MAC_ADMIN",
  "MAC_OVERRIDE",
  "NET_ADMIN",
  "NET_BROADCAST",
  "PERFMON",
  "SYS_ADMIN",
  "SYS_BOOT",
  "SYS_MODULE",
  "SYS_NICE",
  "SYS_PACCT",
  "SYS_PTRACE",
  "SYS_RAWIO",
  "SYS_RESOURCE",
  "SYS_TIME",
  "SYS_TTY_CONFIG",
  "SYSLOG",
  "WAKE_ALARM"
]

export default {
  components: {
    Ports,
    InputGroup,
    EnvInputGroup,
    CommandsInput,
    ValidationObserver,
    ValidationProvider,
    AppSideBar,
    LottieAnimation,
    VueSlider,
    Swiper,
    SwiperSlide,
    // AppsInstallationLocation,
    storageItem,
  },
  props: {
    id: String,
    state: String,
    storeId: {
      type: Number,
      default: 0
    },
    isCasa: {
      type: Boolean,
      default: true
    },
    runningStatus: String,
    configData: Object,
    settingData: {
      type: Object
    }
  },

  data() {
    return {
      timer: 0,
      data: [],
      isLoading: true,
      isFetching: false,
      isLoadError: false,
      loadErrorStep: 0,
      isFirst: true,
      errorType: 1,
      currentInstallAppName: null,
      currentInstallAppError: false,
      currentInstallAppType: null,
      currentInstallAppText: "",

      appIcon: "",
      sidebarOpen: false,
      cancelButtonText: "Cancel",
      baseUrl: "",
      totalMemory: 0,
      networks: [],
      tempNetworks: [],
      networkModes: [],
      initData: {
        host: "",
        protocol: "http",
        port_map: null,
        cpu_shares: 10,
        memory: 300,
        restart: "always",
        label: "",
        position: true,
        index: "",
        icon: "",
        network_model: "",
        image: "",
        description: "",
        origin: "custom",
        ports: [],
        volumes: [],
        envs: [],
        devices: [],
        cap_add: [],
        cmd: [],
        privileged: false,
        host_name: "",
        container_name: "",
      },
      portSelected: null,
      capArray: data,
      pageIndex: 1,
      pageSize: 5,
      listTotal: 0,
      pageList: {},
      communityList: {},
      recommendList: {},
      currentSlide: 0,
      currentInstallId: 0,

      //Image List Swiper
      disPrev: true,
      disNext: false,
      swiperOptions: {
        loop: false,
        autoplay: true,
        spaceBetween: 24,
        breakpoints: {
          640: {
            slidesPerView: 1
          },
          768: {
            slidesPerView: 2
          },
          1366: {
            slidesPerView: 3
          }
        },
        on: {
          slideChangeTransitionStart: this.handleInfoSlide
        },
      },
      // Featured Swiper
      disFeaturedPrev: true,
      disFeaturedNext: false,
      featureSwiperOptions: {
        loop: false,
        autoplay: true,
        spaceBetween: 24,
        breakpoints: {
          640: {
            slidesPerView: 1
          },
          768: {
            slidesPerView: 2
          },
          1366: {
            slidesPerView: 3
          }
        },
        on: {
          slideChangeTransitionStart: this.handleFeaturedSlide
        },
      },
      searchKey: "",
      currentCate: {},
      currentSort: {},
      cateMenu: [],
      sortMenu: [
        {icon: "", slash: "rank", name: "Popular"},
        {icon: "", slash: "new", name: "New"},
        {icon: "", slash: "name", name: "Name"},
      ],
      storeQueryData: {
        index: 1,
        category_id: "",
        type: "rank",
        key: this.searchKey
      },
      //  App Detail info
      appDetailData: {},

      // APPs Installation Location - requirement document
      storageData: [{
        name: 12,
        isSystem: true,
        fsType: 'fsType',
        diskName: 'diakname',
        availSize: '1024',
        disk_type: 'type',
        path: 'path',
        mount_point: 'mount_point',
        usePercent: 20,
        model: 'model',
        size: 123,
        health: true,
        temperature: 100,
      }],
      storage_item_scence: 'select installation location'
    }
  },

  created() {

    // Set Front-end base url
    this.baseUrl = `${document.domain}`;
    // this.initData.host = `${document.domain}:`
    //Get Max memory info form device
    this.totalMemory = Math.floor(this.configData.memory.total / 1048576);
    this.initData.memory = this.totalMemory

    //Handling network types
    this.tempNetworks = this.configData.networks;
    this.networkModes = uniq(this.tempNetworks.map(item => {
      return item.driver
    }))
    this.networks = this.networkModes.map(item => {
      let tempitem = {}
      tempitem.driver = item
      tempitem.networks = this.tempNetworks.filter(net => {
        return net.driver == item
      })
      return tempitem
    })
    this.networks = orderBy(this.networks, ['driver'], ['asc']);
    //If it is edit, Init data
    if (this.settingData != undefined) {
      this.isLoading = false
      this.initData = this.preProcessData(Object.assign(this.initData, this.settingData))
      this.currentSlide = 1

    } else {
      let gg = find(this.tempNetworks, (o) => {
        return o.driver == "bridge"
      })
      this.initData.network_model = gg.length > 0 ? gg[0].name : "bridge";
      this.getCategoryList();
    }

    // If StoreId is not 0
    if (this.storeId != 0) {
      this.showAppDetial(this.storeId);
    }

    // prepare data - APPs Installation Location requirement document
    this.getDiskList();
  },

  computed: {

    showPorts() {
      if (this.initData.network_model.toLowerCase().indexOf("macvlan") > -1 || this.initData.network_model.indexOf("host") > -1) {
        return false
      } else {
        return true
      }
    },
    showHostPort() {
      if (this.initData.network_model.indexOf("host") > -1) {
        return false
      } else {
        return true
      }
    },
    bridgePorts() {
      return this.initData.ports.filter(function (item) {
        return item.host != ""
      })
    },
    filteredBeidgePort() {
      return this.bridgePorts.filter(port => {
        return port.host.indexOf(this.initData.port_map) >= 0
      })

    },
    showImportButton() {
      return this.currentSlide == 1 && this.state == 'install'
    },
    showExportButton() {
      return this.currentSlide == 1 && this.state == 'update'

    },
    showTerminalButton() {
      return this.currentSlide == 1 && this.state == 'update' && this.runningStatus == 'running'
    },
    panelTitle() {
      if (this.currentSlide == 0) {
        return this.$t("App Store");
      } else if (this.currentSlide == 1) {
        if (!this.isCasa) {
          return this.$t("Import") + " " + this.initData.label
        } else {
          return (this.settingData != undefined) ? this.initData.label + " " + this.$t("Setting") : this.$t("Install a new App manually")
        }

      } else {
        return this.$t("Installing") + " " + this.initData.image
      }
    },
    showDetailSwiper() {
      return (!this.appDetailData.screenshot_link) ? false : true;
    },
    currentInstallAppTextClass() {
      return this.currentInstallAppError ? 'has-text-danger' : 'has-text-black'
    }

  },
  watch: {
    // Watch if Icon url has changed
    'initData.icon'(val) {
      this.updateIconUrl(val)
    },
    // Watch if Section index changes
    currentSlide(val) {
      if (val == 1) {
        this.isLoading = false;
      }
    },
    // Watch if initData changes
    initData: {
      handler(val) {
        if (this.state == 'install') {
          localStorage.setItem("app_data", JSON.stringify(val))
        }
      },
      deep: true
    },
    // Watch if the query data of app store changes
    storeQueryData: {
      handler() {
        this.getStoreList();
      },
      deep: true
    },
    // Watch if app cates changes
    currentCate: {
      handler(val) {
        if (!this.isFirst) {
          this.storeQueryData.category_id = val.id
        }
      },
      deep: true
    },
    // Watch if app sort changes
    currentSort: {
      handler(val) {
        if (!this.isFirst) {
          this.storeQueryData.type = val.slash
        }
      },
      deep: true
    }
  },
  methods: {

    /**
     * @description:
     * @param {*} function
     * @return {*}
     */
    updateIconUrl: debounce(function (string) {
      this.appIcon = string
    }, 300),

    updateLabel: debounce(function (string) {
      this.initData.label = string
    }, 50),

    /**
     * @description:
     * @param {*} text
     * @return {*}
     */
    getFilteredTags(text) {
      this.capArray = data.filter((option) => {
        return option
            .toString()
            .indexOf(text.toUpperCase()) >= 0
      })
    },

    /**
     * @description:
     * @param {*} swiper
     * @return {*}
     */
    handleInfoSlide(swiper) {
      this.disPrev = (swiper.activeIndex == 0) ? true : false;
      this.disNext = swiper.isEnd;
    },
    /**
     * @description:
     * @param {*} swiper
     * @return {*}
     */
    handleFeaturedSlide(swiper) {
      this.disFeaturedPrev = (swiper.activeIndex == 0) ? true : false;
      this.disFeaturedNext = swiper.isEnd;
    },

    /**
     * @description: Get category list
     * @param {*}
     * @return {*} void
     */
    async getCategoryList() {
      this.isLoading = true
      try {
        const res = await this.$api.appCategories.getAppCategory();
        this.cateMenu = res.data.data.filter((item) => {
          return item.count > 0
        })
        this.currentCate = this.cateMenu[0]
        this.currentSort = this.sortMenu[0]
        if (this.isFirst) {
          this.isFirst = false
        }
      } catch (error) {
        this.loadErrorStep = 1
        this.isLoading = false;
        this.isLoadError = true;
      }

    },

    /**
     * @description: Get App store list
     * @param {*}
     * @return {*} void
     */
    getStoreList() {
      this.isLoading = true
      this.$api.apps.getAppList(this.storeQueryData).then(res => {
        this.isLoading = false
        this.isLoadError = false
        if (res.data.success == 200) {
          // this.listTotal = res.data.data.count
          this.pageList = res.data.data.list
          this.communityList = res.data.data.community
          this.recommendList = res.data.data.recommend
        }
      }).catch(() => {
        this.loadErrorStep = 2
        this.isLoading = false;
        this.isLoadError = true;
      })
    },

    /**
     * @description: Show the details of app
     * @param {id} String
     * @return {*} void
     */
    showAppDetial(id) {
      this.isLoading = true;
      this.$api.apps.getAppInfo(id).then(resp => {
        this.isLoading = false;
        this.sidebarOpen = true;
        this.appDetailData = resp.data.data
      }).catch(() => {
        this.isLoading = false;
        this.$buefy.toast.open({
          message: this.$t(`There was an error loading the data, please try again!`),
          type: 'is-danger'
        })
      })
    },

    retry() {
      if (this.loadErrorStep === 1) {
        this.getCategoryList()
      } else if (this.loadErrorStep === 2) {
        this.getStoreList()
      }
    },


    /**
     * @description: Quick Install App from app store
     * @param {*}
     * @return {*} void
     */
    qucikInstall(id) {
      this.currentInstallId = id
      this.$api.apps.getAppInfo(id).then(resp => {
        if (resp.data.success == 200) {

          let respData = resp.data.data
          this.initData.protocol = respData.protocol
          this.initData.host = respData.host
          this.initData.port_map = respData.port_map
          this.initData.cpu_shares = 50
          this.initData.memory = respData.max_memory
          this.initData.restart = "always"
          this.initData.label = respData.title
          this.initData.position = true
          this.initData.index = respData.index
          this.initData.icon = respData.icon
          this.initData.network_model = respData.network_model
          this.initData.image = respData.image
          this.initData.description = respData.description
          this.initData.origin = respData.origin
          this.initData.ports = isNull(respData.ports) ? [] : respData.ports
          this.initData.volumes = isNull(respData.volumes) ? [] : respData.volumes
          this.initData.envs = isNull(respData.envs) ? [] : respData.envs
          this.initData.devices = isNull(respData.devices) ? [] : respData.devices
          this.initData.cap_add = isNull(respData.cap_add) ? [] : respData.cap_add
          this.initData.cmd = isNull(respData.cmd) ? [] : respData.cmd
          this.initData.privileged = respData.privileged
          this.initData.host_name = respData.host_name


          this.currentInstallId = 0
          if (respData.tip !== "null" && respData.tip !== "[]" && respData.tip !== "") {
            this.$buefy.dialog.confirm({
              title: this.$t('Attention'),
              message: this.formatTips(respData.tip),
              type: 'is-dark',
              onConfirm: () => {
                this.sidebarOpen = false;
                this.installAppData()
              }
            })
          } else {
            this.sidebarOpen = false;
            this.installAppData()
          }
        }
      }).catch(() => {
        this.$buefy.toast.open({
          message: this.$t(`There was an error loading the data, please try again!`),
          type: 'is-danger'
        })
      })
    },
    /**
     * @description: Format AppStore tip datas
     * @param {data}
     * @return {html} Str
     */
    formatTips(data) {
      let html = "";
      if (!isNull(data) && data != "") {
        JSON.parse(data).forEach(item => {
          html += "<span class=' is-size-14px un-break-word'>" + item.content + "</span>"
          if (item.value != '') {
            html += "<span class='tag is-primary ml-1'>" + item.value + "</span>"
          }
          html += "<br/>"
        })
      }
      return html
    },

    /**
     * @description: Pre-processed data before setting
     * @param {ConfigObject} data
     * @return {ConfigObject} data
     */
    preProcessData(data) {
      data.ports = isNull(data.ports) ? [] : data.ports
      data.volumes = isNull(data.volumes) ? [] : data.volumes
      data.envs = isNull(data.envs) ? [] : data.envs
      data.devices = isNull(data.devices) ? [] : data.devices
      data.cap_add = isNull(data.cap_add) ? [] : data.cap_add
      data.cmd = isNull(data.cmd) ? [] : data.cmd
      data.port_map = data.port_map === "" ? null : data.port_map
      data.cpu_shares = (data.cpu_shares === 0 || data.cpu_shares > 99) ? 90 : data.cpu_shares
      data.memory = data.memory === 0 ? this.totalMemory : data.memory
      data.restart = data.restart === "no" ? "unless-stopped" : data.restart
      data.network_model = data.network_model === "default" ? "bridge" : data.network_model
      data.icon = data.icon === "" ? this.getIconFromImage(data.image) : data.icon

      return data
    },


    /**
     * @description: Process the datas before submit
     * @param {*}
     * @return {*} void
     */
    processData() {

      this.initData.cpu_shares = Number(this.initData.cpu_shares)
      let model = this.initData.network_model.split("-");
      this.initData.network_model = model[0]
    },

    /**
     * @description: Back to prev Step
     * @param {*}
     * @return {*} void
     */
    prevStep() {
      this.currentSlide--;
    },

    /**
     * @description: Validate form async
     * @param {Object} ref ref of component
     * @return {Boolean}
     */
    async checkStep(ref) {
      let isValid = await ref.validate()
      return isValid
    },

    /**
     * @description: Submit datas after valid
     * @param {*}
     * @return {*} void
     */
    installApp() {
      this.checkStep(this.$refs.ob1).then(val => {
        if (val) {
          this.installAppData(this.id);
        }
      })
    },

    installAppData() {
      this.processData();
      this.isLoading = true;
      // console.log(this.initData);
      this.$api.container.install(this.initData).then((res) => {
        this.isLoading = false;
        if (res.data.success == 200) {
          this.currentInstallAppName = res.data.data
          this.currentSlide = 2;
          this.currentInstallAppText = "Start Installation..."
          this.cancelButtonText = 'Continue in background'
        } else {
          this.$buefy.toast.open({
            message: res.data.message,
            type: 'is-warning'
          })
        }
      }).catch((err) => {
        this.isLoading = false;
        this.$buefy.toast.open({
          message: err.response.data.message,
          type: 'is-warning'
        })
      })
    },


    /**
     * @description: Save edit update
     * @return {*} void
     */
    updateApp() {
      this.processData();
      this.isLoading = true;
      let updateData = this.uuid2var(cloneDeep(this.initData));
      this.$api.container.update(this.id, updateData).then((res) => {
        if (res.data.success == 200) {
          this.isLoading = false;
          this.$emit('updateState')
        } else {
          this.$buefy.toast.open({
            message: res.data.message,
            type: 'is-warning'
          })
        }
        this.$emit('close')
      }).catch((err) => {
        this.isLoading = false;
        this.$buefy.toast.open({
          message: err.response.data.message,
          type: 'is-warning'
        })
      })
    },

    /**
     * @description: Show import panel
     * @return {*} void
     */
    showImportPanel() {
      this.$buefy.modal.open({
        parent: this,
        component: ImportPanel,
        hasModalCard: true,
        customClass: '',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        events: {
          'update': (e) => {
            //localStorage.removeItem("app_data")
            this.initData = this.preProcessData(e)
            if (this.initData.icon == "") {
              this.changeIcon(this.initData.image)
            }
            this.$buefy.dialog.alert({
              title: '⚠️ ' + this.$t('Attention'),
              message: '<div class="nobrk"><h4 class="title is-5">' + this.$t('AutoFill only helps you to complete most of the configuration.') + '</h4>' +
                  '<p class="mb-3">' + this.$t('Some configuration information such as:') + '</p>' +
                  '<ul>' +
                  '<li>1. ' + this.$t('the port and path of the Web UI') + '</li>' +
                  '<li>2. ' + this.$t('the mount location of the volume or file') + '</li>' +
                  '<li>3. ' + this.$t('the port mapping of the Host') + '</li>' +
                  '<li>4. ' + this.$t('optional configuration items') + '</li>' +
                  '</ul>' +
                  '<p class="mt-3">' + this.$t('These include but are not limited to these cases and <b>still need to be confirmed or modified by you.</b>') + '</p>' +
                  '<p class="mt-3">' + this.$t('Feel free to suggest improvements to this feature in Discord Server!') + '</p></div>',
              type: 'is-dark'
            })
          }
        },
        props: {
          initData: this.initData,
          netWorks: this.networks,
          oriNetWorks: this.tempNetworks,
          deviceMemory: this.totalMemory
        }
      })
    },

    /**
     * @description: Get remote synchronization information
     * @param {*} function
     * @return {*} void
     */
    getAsyncData: debounce(function (name) {
      if (!name.length) {
        this.data = []
        return
      }
      this.isFetching = true
      axios.get(`https://hub.docker.com/api/content/v1/products/search?source=community&q=${name}&page=1&page_size=4`)
          .then(({data}) => {
            this.data = []
            data.summaries.forEach((item) => this.data.push(item.name))
          })
          .catch((error) => {
            this.data = []
            throw error
          })
          .finally(() => {
            this.isFetching = false
          })
    }, 500),
    /**
     * @description: Export AppData to json file
     * @param {*} function
     * @return {*} void
     */
    exportJSON() {
      let exportData = cloneDeep(this.initData);
      exportData.network_model = this.getNetworkName(this.initData.network_model);
      exportData.version = "1.0"
      exportData = this.uuid2var(exportData)
      delete exportData.memory
      const data = JSON.stringify(exportData);
      const blob = new Blob([data], {type: ''});
      FileSaver.saveAs(blob, `${exportData.label}.json`);
    },

    /**
     * @description: change uuid to var
     * @param {*} function
     * @return {data} Object
     */

    uuid2var(data) {
      data.volumes.forEach((item) => {
        item.host = item.host.replace(this.id, '$AppID');
      })
      data.devices.forEach((item) => {
        item.host = item.host.replace(this.id, '$AppID');
      })
      return data
    },

    /**
     * @description: Get Network name from network list
     * @param {*}
     * @return {*} String
     */
    getNetworkName(netId) {
      if (netId == "") {
        return "bridge"
      } else {
        let network = this.tempNetworks.filter(net => {
          return net.name == netId
        })
        return network[0].name
      }
    },

    /**
     * @description: Get App icon form image
     * @param {*} image
     * @return {*}
     */
    getIconFromImage(image) {
      if (image == "") {
        return ""
      } else {
        let appIcon = image.split(":")[0].split("/").pop();
        return `https://icon.casaos.io/main/all/${appIcon}.png`;
      }
    },

    /**
     * @description: Change App icon when image changed
     * @param {String} image
     * @return {*} void
     */
    changeIcon(image) {
      this.initData.icon = this.getIconFromImage(image)
    },

    /**
     * @description: Show Terminal & Logs panel
     * @return {*} void
     */

    showTerminalPanel() {
      this.$buefy.modal.open({
        parent: this,
        component: AppTerminalPanel,
        hasModalCard: true,
        customClass: 'terminal-modal',
        trapFocus: true,
        canCancel: [],
        scroll: "keep",
        animation: "zoom-in",
        props: {
          appid: this.id,
          appName: this.initData.label
        }
      })
    },

    async getDiskList() {
      try {
        const storageRes = await this.$api.storage.list({system: "show"})
        const storageArray = []
        storageRes.data.data.forEach(item => {
          item.children.forEach(part => {
            part.disk = item.path
            part.diskName = item.disk_name
            storageArray.push(part)
          })
        })
        this.storageData = storageArray.map((storage) => {
          return {
            name: storage.label,
            isSystem: storage.diskName == "System",
            fsType: storage.type,
            size: storage.size,
            availSize: storage.avail,
            usePercent: 100 - Math.floor(storage.avail * 100 / storage.size),
            diskName: storage.drive_name,
            path: storage.path,
            mount_point: storage.mount_point,
            disk: storage.disk
          }

        })
      } catch (error) {
        console.log(error.response.message);
      }
    },

    getSelection(val) {
      console.log(val)
    }
  },

  destroyed() {
    clearInterval(this.timer)
  },

  sockets: {
    app_install(res) {
      const resData = res.body.data
      if (this.currentInstallAppName != resData.name) {
        return false
      }
      if (!resData.finished) {
        this.currentInstallAppError = !resData.success;
        if (resData.success) {
          this.currentInstallAppType = resData.type;
          if (resData.message !== "") {
            const messageArray = resData.message.split(/[(\r\n)\r\n]+/);
            messageArray.forEach((item, index) => {
              if (!item) {
                messageArray.splice(index, 1);
              }
            })
            const lastMessage = last(messageArray)
            const info = JSON.parse(lastMessage)
            const id = (info.id != undefined) ? info.id : "";
            let progress = ""
            if (info.progressDetail != undefined) {
              let progressDetail = info.progressDetail
              if (!isNaN(progressDetail.current / progressDetail.total)) {
                progress = `[ ${String(Math.floor((progressDetail.current / progressDetail.total) * 100))}% ]`
              }
            }
            let status = info.status
            this.currentInstallAppText = status + ":" + id + " " + progress
          }
        } else {
          this.currentInstallAppText = resData.message
        }
      } else {
        localStorage.removeItem("app_data")
        setTimeout(() => {
          this.$emit('updateState')
          this.$emit('close')
        }, 500)
      }
    },
  }
}
</script>


<style lang="scss">
.app-item {
  border-radius: 0.5rem;
  transition: background 0.3s ease;

  &:hover {
    background-color: hsl(0, 0%, 97%);
  }
}

.level-item {
  .icon {
    overflow: initial;
  }
}

.install-animation {
  width: 200px;
  height: 200px;
}

.creating-animation {
  width: 16rem;
  height: 16rem;
}

.app-detial {
  overflow: auto;
  height: 100%;

  .app-header {
    position: relative;
  }

  .level {
    .footing {
      color: hsl(0, 0%, 48%);
    }
  }

  .swiper-button-next,
  .swiper-rtl .swiper-button-prev {
    right: -20px;
    left: auto;
  }

  .swiper-button-prev,
  .swiper-rtl .swiper-button-next {
    left: -20px;
    right: auto;
  }
}

.featured-app {
  .swiper-button-next,
  .swiper-rtl .swiper-button-prev {
    right: -20px;
    top: calc(50% - 2.25rem);
    left: auto;
  }

  .swiper-button-prev,
  .swiper-rtl .swiper-button-next {
    left: -20px;
    top: calc(50% - 2.25rem);
    right: auto;
  }

  .button {
    box-sizing: border-box !important;
  }
}

.app-select {
  .dropdown-menu {
    min-width: 1rem !important;
  }

  .dropdown-content {
    border-radius: 0.5rem;
    overflow-y: overlay !important;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      outline: none;
    }
  }

  a.dropdown-item {
    padding-right: 1.5rem;
    font-size: 0.875rem;
  }
}

@media screen and (min-width: 769px) {
  .app-panel {
    .animation-content {
      max-width: 90% !important;
    }

    .modal-card {
      width: 90vw;
      transition: all 0.3s;

      &.narrow {
        width: 50rem !important;
      }
    }
  }
}

@media screen and (min-width: 1440px) {
  .app-panel {
    .modal-card {
      width: 81rem !important;
    }
  }
}

@media screen and (max-width: 1366px) {
  .f-list {
    .is-one-quarter {
      width: 33.333333% !important;
    }
  }
}

@media screen and (max-width: 1024px) {
  .f-list {
    .is-one-quarter {
      width: 50% !important;
    }
  }
}

@media screen and (max-width: 768px) {
  .modal-card {
    max-height: 100vh !important;
    border-radius: 0;
  }
}

@media screen and (max-width: 480px) {
  .app-detial {
    overflow: auto;
    height: 100%;

    .modal-card-head {
      .button {
        -webkit-tap-highlight-color: transparent;
      }
    }

    .app-header {
      position: relative;

      .header-icon {
        .is-128x128 {
          height: 96px;
          width: 96px;
        }
      }

      .store-title {
        font-size: 1.125rem;
      }

      .subtitle {
        font-size: 0.75rem;
        margin-bottom: 0.75rem;
      }

      .description {
        .button {
          font-size: 0.75rem;
        }
      }
    }

    .level {
      .mdi-36px.mdi-set,
      .mdi-36px.mdi:before {
        font-size: 24px;
      }

      .title {
        font-size: 24px;
      }

      .footing {
        font-size: 0.6rem !important;
      }
    }
  }

  .f-list {
    .is-one-quarter {
      width: 100% !important;
    }
  }
}
</style>
