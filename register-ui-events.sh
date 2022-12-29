#!/usr/bin/bash
#
# * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
# * @LastEditTime: 2022/12/29 下午6:46
# * @FilePath: /CasaOS-UI/register-ui-events.sh
# * @Description:
# *
# * Copyright (c) 2022 by IceWhale, All Rights Reserved.
#

# This script is used to register the UI events for the UI events

# Get the message bus URL
runtime_file="/var/run/casaos/message-bus.url"
ui_message_bus_file="/var/lib/casaos/ui-message-bus.json"
if [ -f "$runtime_file" ] && [ -f "$ui_message_bus_file" ]
then
    MESSAGE_BUS_URL=$(cat /var/run/casaos/message-bus.url)
    curl -X POST "$MESSAGE_BUS_URL/v2/message_bus/event_type" -H "Content-Type: application/json" -d @$ui_message_bus_file
    echo "UI events registered"
else
    echo "Message bus URL or message json file not found"
fi