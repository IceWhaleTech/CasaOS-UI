import message_bus from '@/events/message_bus.js'

export default {
    install(Vue) {
        Vue.prototype.$messageBus = message_bus;
    },
}