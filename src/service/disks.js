/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 18:54:27
 * @Description: Disk API
 * @FilePath: \CasaOS-UI\src\service\disks.js
 */
import { api } from "./service.js";
const PREFIX = "/disks";
const disks = {

    // get disk list
    getDiskList(data) {
        return api.get(`${PREFIX}`, data);
    },
}
export default disks;
