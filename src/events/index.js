import {api} from "@/service/service.js";
import message_bus from "@/events/message_bus.js";

export default function messageBus(name, params) {
    let properties = message_bus[name](params).properties;
    api.post(`/v2/message_bus/event/casaos-ui/${name}`, properties);
}
