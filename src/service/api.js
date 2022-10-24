/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-20 23:47:43
 * @Description: 
 * @FilePath: /CasaOS-UI/src/service/api.js
 */

import appCategories from './appCategories.js';
import apps from './apps.js';
import batch from './batch.js';
import container from './container.js';
import disks from './disks.js';
import file from './file.js';
import folder from './folder.js';
import image from './image.js';
import port from './port.js';
import sys from './sys.js';
import storage from './storage.js';
import samba from './samba.js';

import users from "./users.js";
import local_storage from "./local_storage.js";

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
    // System
    sys,
    port,
    // User
    users,
    local_storage,
}