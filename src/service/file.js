/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-08 15:17:12
 * @Description: File API
 * @FilePath: \CasaOS-UI\src\service\file.js
 */
import { api } from "./service.js";

const file = {
    // get Path list
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
            path: path
        }
        return api.get('/file/download', data);
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
    operate(from, to, type) {
        let data = {
            from: from,
            to: to,
            type: type
        }
        return api.post('/file/operate', data);
    },
    // Delete file or folder
    delete(path) {
        let data = {
            path: path
        }
        return api.delete('/file/delete', data);
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