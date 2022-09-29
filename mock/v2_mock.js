/*
 * @Author: zhanghengxin ezreal.ice@icloud.com
 * @Date: 2022-09-22 19:00:01
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-22 21:20:11
 * @FilePath: /CasaOS-UI/mock/v2_mock.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 *
 */

// 【not use】
module.exports = function mock(app) {
    app.get('/v2/local_storage/mount1', (req, res) => {
        //
        console.log(req);
        res.json({
            "data": [
                {
                    "extended": {
                        "mergerfs.srcmounts": "b:c"
                    },
                    "fstype": "fuse.mergerfs",
                    "id": 86,
                    "mount_point": "/DATA/merged",
                    "options": "rw,relatime",
                    "source": "b:c"
                }
            ]
        })
    });
    app.put('/v2/local_storage/mount1', (req, res) => {
        res.json({
            "data": {
                "extended": {
                    "mergerfs.srcmounts": "/mnt/sdb:/mnt/sdc"
                },
                "fstype": "fuse.mergerfs",
                "id": 86,
                "mount_point": "/DATA/merged",
                "options": "rw,relatime",
                "source": "/mnt/sdb:/mnt/sdc"
            }
        })
    });
}
