/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 18:16:06
 * @Description: 
 * @FilePath: \CasaOS-UI\src\service\api.js
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

import users from "./users.js";

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
    // System
    sys,
    port,
    // User
    users,
}