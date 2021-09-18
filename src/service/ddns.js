import { api } from "./service.js";

/*******************************
 * 
 * DDNS Service
 * 
 *****************************/

const ddns = {
    //Add New DDNS
    add(data) {
        return api.post("/ddns/set", data);
    },
    //Delete a DDNS Item
    delete(id) {
        return api.delete("/ddns/delete/" + id);
    },
    //Get DDNS List
    get_list() {
        return api.get('/ddns/list');
    },
    //Ger DDNS Provider List
    get_provider_list() {
        return api.get('/ddns/getlist');
    },
    //Get Public Internet IP address (IPv4)
    get_ipv4() {
        return api.get('/ddns/ip');
    },
    // Ping Host
    ping(host) {
        return api.get('/ddns/ping/' + host);
    }
}
export default ddns;
