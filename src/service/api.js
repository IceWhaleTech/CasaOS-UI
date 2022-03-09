/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-08 13:03:39
 * @Description: 
 * @FilePath: \CasaOS-UI\src\service\api.js
 */

import app from './app.js';
import analyse from './analyse.js';
import disk from './disk.js';
import file from './file.js';
import info from './info.js';
import task from './task.js';
import sync from './sync.js';
import user from "./user.js";


export default {
    app,
    analyse,
    info,
    disk,
    file,
    user,
    task,
    sync
}