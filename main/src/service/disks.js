/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/8/30 下午2:38
 * @FilePath: /CasaOS-UI/main/src/service/disks.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-11 17:16:42
 * @Description: Disk API
 * @FilePath: \CasaOS-UI\src\service\disks.js
 */
import {api} from "./service.js";

const PREFIX = "/disks";
const disks = {

	// get disk list
	getDiskList(data) {
		return api.get(`${PREFIX}`, data);
	},

	umount(data) {
		return api.delete(`${PREFIX}`, data);
	}
}
export default disks;
