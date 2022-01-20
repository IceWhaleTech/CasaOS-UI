/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2022-01-18 14:42:04
 * @Description: Disk API
 * @FilePath: /CasaOS-UI/src/service/disk.js
 */
import { api } from "./service.js";

const disk = {
    // get Path list
    diskInfo() {
        return api.get('/disk/info');
    },
    diskList() {
        return api.get('/disk/list');
    },
    
    addStorage(data){
        return api.post('/disk/storage',data);
    },
    removeStorage(data){
        return api.post('/disk/umount',data);
    },
    formatStorage(data){
        return api.post('/disk/format',data);
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
