/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 22:58:20
 * @Description: File API
 * @FilePath: \CasaOS-UI\src\service\file.js
 */
import { api } from "./service.js";

const PREFIX = "/file"

const file = {

    // get file content
    getContent(path) {
        return api.get(`${PREFIX}/content`, {
            path: path
        });
    },

    // download single file
    download(path) {
        return api.get(`${PREFIX}`, {
            path: path
        });
    },

    // create file
    create(path) {
        return api.post(`${PREFIX}`, {
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



    // ------------------------------------------------------------------------
    /**
     * @description: get Path list
     * @param {String} path
     * @return {*}
     */
    dirPath(path) {
        let data = {
            path: path
        }
        return api.get('/file/dirpath', data);
    },
    // Rename file path
    renamePath(oldpath, path) {
        let data = {
            oldpath: oldpath,
            newpath: path
        }
        return api.put('/file/rename', data);
    },
    // Make a new Dir
    mkdir(path) {
        let data = {
            path: path
        }
        return api.post('/file/mkdir', data)
    },

    // Thumbnail Data
    getThumb(path) {
        let data = {
            path: path,
            type: "thumbnail",
            responseType: 'arraybuffer'
        }
        return api.get('/file/image', data);
    },

    // Copy or Move File
    operate(data) {
        return api.post('/file/operate', data);
    },
    // cancel operate
    cancel(id) {
        return api.delete(`/file/operate/${id}`);
    },
    // Delete file or folder
    delete(pathArray) {
        return api.delete('/file/delete', pathArray);
    },

    getFileShare() {
        return api.get('/file/share')
    },
    setFileShare(data) {
        return api.post('/file/share', data)
    }
}

export default file;