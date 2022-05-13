/*
 * @Author: 老竭力 jerrykuku@qq.com
 * @Date: 2022-02-18 10:20:10
 * @LastEditors: 老竭力 jerrykuku@qq.com
 * @LastEditTime: 2022-05-13 20:12:39
 * @FilePath: \CasaOS-UI\public\static.go
 * @Description:
 *
 * Copyright (c) 2022 by 老竭力 jerrykuku@qq.com, All Rights Reserved.
 */
package web

import "embed"

//go:embed index.html favicon.svg browserconfig.xml site.webmanifest robots.txt img js fonts *.worker.js
var Static embed.FS
