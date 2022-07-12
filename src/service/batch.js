/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-12 22:45:44
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 22:49:57
 * @FilePath: \CasaOS-UI\src\service\batch.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import { api } from "./service.js";

const PREFIX = "/batch"

const batch = {
    // download
    download(format, files) {
        return api.get(`${PREFIX}/download`, {
            format: format,
            files: files
        });
    },

    // File operate task TODO:wait for the api
    task(action, files) {
        return api.post(`${PREFIX}/task`, {
            action: action,
            files: files
        });
    },

    // delete file operate task
    deleteTask(id) {
        return api.delete(`${PREFIX}/${id}/task`);
    },

    // delete file or folder
    delete(files) {
        return api.delete(`${PREFIX}`, files);
    },


}

export default batch;