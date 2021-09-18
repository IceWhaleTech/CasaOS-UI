import { api } from "./service.js";

/*******************************
 * 
 * Task
 * 
 *****************************/

const task = {
    //List
    list() {
        return api.get("/task/list");
    },
    //Mark
    completion(id) {
        return api.put(`/task/completion/${id}`);
    }
}
export default task;
