/*
 * @Author: JerryK
 * @Date: 2022-03-08 13:01:07
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-08 14:26:40
 * @Description: 
 * @FilePath: \CasaOS-UI\src\service\analyse.js
 */
import { api } from "./service.js";
const analyse = {
    // Analyse App Action
    analyseAppAction(name, type) {
        let data = {
            name: name,
            type: type
        }
        return api.post('/analyse/app', data)
    }
}
export default analyse;