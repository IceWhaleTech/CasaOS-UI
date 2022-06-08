/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-08 19:15:22
 * @Description: File API
 * @FilePath: \CasaOS-UI\src\service\file.js
 */
import { api } from "./service.js";

const file = {
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
    // Create a new File
    create(path) {
        let data = {
            path: path
        }
        return api.post('/file/create', data)
    },
    // Download File
    download(path) {
        let data = {
            files: path
        }
        return api.get('/file/download', data);
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
    // Update File
    update(path, content) {
        let data = {
            path: path,
            content: content
        }
        return api.put('/file/update', data);
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
    // Upload File
    upload() {

    },
    getFileShare() {
        return api.get('/file/share')
    },
    setFileShare(data) {
        return api.post('/file/share', data)
    }
}

export default file;