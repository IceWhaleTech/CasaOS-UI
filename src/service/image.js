import { api } from "./service.js";

const PREFIX = "/image"

const image = {
	// image thumbnail/original image
	getImage(path, type) {
		return api.get(`${PREFIX}`, {
			path: path,
			type: type
		});
	}
}

export default image;