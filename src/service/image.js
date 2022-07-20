/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-12 22:50:45
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 22:51:38
 * @FilePath: \CasaOS-UI\src\service\image.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import { api } from "./service.js";

const PREFIX = "/image"

const image = {
    // image thumbnail/original image
    getImage(path, type) {
        return api.get(`${PREFIX}`, {
            path: path,
            type: type
        });
    }
}

export default image;