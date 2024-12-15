/* eslint-disable no-console */

const fs = require('node:fs')
const path = require('node:path')
const events = require('./src/events/message_bus.js')

const outPath = '../build/sysroot/var/lib/casaos/'
const outName = 'ui-message-bus.json'
const registerShellPath = '../build/sysroot/etc/casaos/start.d/'
const array = []

// Parse the event to array
Object.keys(events).forEach((key) => {
  events[key]().then((eventObj) => {
    eventObj.propertyTypeList = Object.keys(eventObj.properties)
    eventObj.propertyTypeList = eventObj.propertyTypeList.map((key) => {
      return {
        name: key,
        discription: '',
        example: '',
      }
    })
    delete eventObj.properties
    array.push(eventObj)
  })
})

// Create the output folder
fs.mkdir(outPath, { recursive: true }, (err) => {
  if (err) {
    console.error(err)
  }
  else {
    // Write the output file
    fs.writeFile(path.join(outPath, outName), JSON.stringify(array, '', '\t'), (err) => {
      if (err) {
        console.error(err)
      }
      else {
        console.log('The json file has been saved!')
      }
    })
  }
})

// Copy the register shell file to the output folder

fs.mkdir(registerShellPath, { recursive: true }, (err) => {
  if (err) {
    console.error(err)
  }
  else {
    fs.copyFile('./register-ui-events.sh', path.join(registerShellPath, 'register-ui-events.sh'), (err) => {
      if (err) {
        console.error(err)
      }
      else {
        console.log('The shell file has been saved!')
      }
    })
  }
})
