import appCategories from './appCategories.js'
import apps from './apps.js'
import batch from './batch.js'
import cloud from './cloud.js'
import container from './container.js'
import disks from './disks.js'
import driver from './driver.js'
import file from './file.js'
import folder from './folder.js'
import image from './image.js'
import local_storage from './local_storage.js'
import port from './port.js'
import samba from './samba.js'
import storage from './storage.js'
import sys from './sys.js'
import users from './users.js'

export default {
  // Apps
  appCategories,
  apps,
  container,
  // Files
  file,
  folder,
  image,
  batch,
  // Devices
  disks,
  storage,
  samba,
  driver,
  cloud,
  // System
  sys,
  port,
  // User
  users,
  local_storage,
}
