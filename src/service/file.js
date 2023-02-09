/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 12:24:01
 * @Description: File API
 * @FilePath: \CasaOS-UI\src\service\file.js
 */
import {api} from "./service.js";

const PREFIX = "/file"

const file = {

    // get file content
    getContent(path) {
        return api.get(`${PREFIX}/content`, {
            path: path,
            timestamp: Date.now()
        });
    },

    // download single file
    download(path) {
        return api.get(`${PREFIX}`, {
            path: path,
            timestamp: Date.now()
        });
    },

    // create file
    create(path) {
        return api.post(`/v3${PREFIX}`, {
            path: path
        });
    },

    // rename file
    rename(old_path, new_path) {
        return api.put(`${PREFIX}/name`, {
            old_path: old_path,
            new_path: new_path
        });
    },

    // update file
    update(path, content) {
        return api.put(`${PREFIX}`, {
            path: path,
            content: content
        });
    },

}

export default file;