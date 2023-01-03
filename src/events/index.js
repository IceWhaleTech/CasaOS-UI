/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2022/12/30 下午5:32
 * @FilePath: /CasaOS-UI/src/events/index.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

import {api} from "@/service/service.js";
import message_bus from "@/events/message_bus.js";

export default function messageBus(name, params) {
    if (!params) {
        params = null
    }
    // console.log(this.$store.state.device_id)
    // message_bus.publicParameter = {
    //     "device_id": this.$store.state.device_id,
    // }

    let properties = message_bus[name](params).properties;
    let eventName = message_bus[name](params).name;
    api.post(`/v2/message_bus/event/casaos-ui/${eventName}`, properties);
}
