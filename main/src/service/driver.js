import {api} from "./service.js";

const PREFIX = "/driver";
const driver = {

	// get driver list
	getDriverList(data) {
		return api.get(`${PREFIX}`, data);
	}
}
export default driver;