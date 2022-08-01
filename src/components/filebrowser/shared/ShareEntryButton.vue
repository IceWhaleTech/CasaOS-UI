<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-28 15:29:40
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-31 20:41:46
 * @FilePath: \CasaOS-UI\src\components\filebrowser\shared\ShareEntryButton.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div>
    <div class="is-flex list-item new-list-item" :class="{'active':active}" id="v-step-0" @click="$emit('open')">
      <div class="cover mr-4 is-flex-shrink-0">
        <b-icon icon="star-outline"></b-icon>
      </div>
      <span>{{ $t('Shared') }}</span>
    </div>

    <!-- Vue Tour Start -->
    <v-tour name="myTour" :steps="steps">
      <template slot-scope="tour">
        <transition name="fade">
          <v-step v-if="tour.steps[tour.currentStep]" :key="tour.currentStep" :step="tour.steps[tour.currentStep]" :previous-step="tour.previousStep" :next-step="tour.nextStep" :stop="tour.stop" :skip="tour.skip" :is-first="tour.isFirst" :is-last="tour.isLast" :labels="tour.labels">
            <template>
              <div slot="content" class="v-step__content">
                {{$t(tour.steps[tour.currentStep].content)}}
              </div>
              <div slot="actions" class="buttons mb-0 columns is-gapless">
                <div class="column has-text-left">
                  <b-button size="is-small" class=" mb-0" @click="tour.previousStep" v-if="!tour.isFirst && !tour.isLast" rounded>{{ $t('Prev') }}</b-button>
                </div>
                <div class="column">

                  <b-button size="is-small" class=" mb-0" type="is-success" @click="tour.skip" v-if="!tour.isLast" rounded>{{ $t('Skip') }}</b-button>

                </div>
                <div class="column has-text-right">
                  <b-button size="is-small" class=" mb-0" @click="tour.nextStep" v-if="!tour.isLast" rounded>{{ $t('Next') }}</b-button>
                  <b-button size="is-small" class=" mb-0" type="is-success" @click="selectShare" v-if="tour.isLast" rounded>{{ $t(`Let's Go`)}}</b-button>
                </div>
              </div>
            </template>
          </v-step>
        </transition>
      </template>
    </v-tour>
    <!-- Vue Tour End -->
  </div>

</template>

<script>

const sharedInitData = "shared_init_data";
import events from '@/events/events';

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      steps: [
        {
          target: '#v-step-0',
          content: 'Start sharing your files one thel local network.',
          params: {
            placement: 'right' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
          }
        }
      ]
    }
  },
  created() {

  },
  mounted() {
    setTimeout(() => {
      this.$tours['myTour'].start();
    }, 500)
    this.checkInit()
  },

  methods: {
    async checkInit() {
      try {
        const res = await this.$api.users.getCustomStorage(sharedInitData)
        const resData = res.data.data
        console.log(resData);
        if (resData) {
          if (!resData.isInit) {
            setTimeout(() => {
              this.$tours['myTour'].start();
            }, 500)
            this.$api.users.setCustomStorage(sharedInitData, {
              isInit: true
            })
          }
        } else {
          setTimeout(() => {
            this.$tours['myTour'].start();
          }, 500)
          this.$api.users.setCustomStorage(sharedInitData, {
            isInit: true
          })
        }
      } catch (error) {
        console.log(error);
      }
    },
    selectShare() {
      this.$EventBus.$emit(events.SELECT_SHARE);
      this.$tours['myTour'].skip()
    }
  },

}
</script>

<style>
</style>