#!/usr/bin/bash
# This script is used to register the UI events for the UI events

# Get the message bus URL
runtime_file="/var/run/casaos/message-bus.url"
ui_message_bus_file="/var/lib/casaos/ui-message-bus.josn"
if [ -f "$runtime_file" ] && [ -f "$ui_message_bus_file" ]
then
    MESSAGE_BUS_URL=$(cat /var/run/casaos/message-bus.url)
    curl -X POST "$MESSAGE_BUS_URL/v2/message_bus/event_type" -H "Content-Type: application/json" -d @$ui_message_bus_file
    echo "UI events registered"
else
    echo "Message bus URL or message json file not found"
fi