/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 21:35:22
 * @Description: 
 * @FilePath: \CasaOS-UI\src\service\api.js
 */

import app from './app.js';
import disk from './disk.js';
import file from './file.js';
import sys from './sys.js';
import sync from './sync.js';
import user from "./user.js";


export default {
    app,
    sys,
    disk,
    file,
    user,
    sync,
}