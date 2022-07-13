/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-13 14:18:17
 * @Description: 
 * @FilePath: /CasaOS-UI/src/service/api.js
 */

import app from './app.js';
import disk from './disk.js';
import file from './file.js';
import sys from './sys.js';
import sync from './sync.js';
import user from "./user.js";
import users from "./users.js";
import container from "./container.js";

export default {
    app,
    sys,
    disk,
    file,
    user,
    sync,
    users,
    container
}