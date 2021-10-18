/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-18 16:33:39
 * @Description: File API
 * @FilePath: /CasaOS-UI/src/service/file.js
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
    // System path
    renamePath(oldpath, path) {
        let data = {
            oldpath: oldpath,
            newpath: path
        }
        return api.get('/file/rename', data);
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
    }
}

export default file;