import { api } from "./service.js";

/*******************************
 * 
 * Disk Apis
 * 
 *****************************/

const disk = {
    // get Path list
    diskInfo() {
        return api.get('/disk/info');
    },
    diskList(){
        return api.get('/disk/list');
    },
    // System path
    renamePath(oldpath, path) {
        let data = {
            oldpath: oldpath,
            newpath: path
        }
        return api.get('/zima/rename', data);
    },
    // Make a new Dir
    mkdir(path) {
        let data = {
            path: path
        }
        return api.get('/zima/mkdir', data)
    }
}
export default disk;
