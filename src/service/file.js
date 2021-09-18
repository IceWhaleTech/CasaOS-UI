import { api } from "./service.js";

/*******************************
 * 
 * File Apis
 * 
 *****************************/

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
    }
}

export default file;