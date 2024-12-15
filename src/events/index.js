import message_bus from '@/events/message_bus.js'
import { api } from '@/service/service.js'

export default function messageBus(name, params) {
  if (!params) {
    params = null
  }
  try {
    message_bus[name](params).then((res) => {
      const properties = res.properties
      const eventName = res.name
      api.post(`/v2/message_bus/event/casaos-ui/${eventName}`, properties)
    })
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}
