import { api } from "./service.js";

const CATE = "/person"

const person = {
    /**************************
     * User's API 
    **************************/

    // Add Firend
    addFriend(shareId) {
        return api.post(`${CATE}/user/${shareId}`);
    },
    // Get Friends List
    getFriendsList() {
        return api.get(`${CATE}/users`);
    },
    // Edit Friend's Remarks
    updateFriendRemarks(shareId, remarks) {
        let data = {
            token: shareId,
            remarks: remarks
        }
        return api.put(`${CATE}/remarks/${shareId}`, data);
    },
    // Block Friend
    blockFriend(shareId, block) {
        let data = {
            block: block
        }
        return api.put(`${CATE}/block/${shareId}`, data);
    },
    // Delete Friend
    deleteFriend(shareId) {
        return api.delete(`${CATE}/user/${shareId}`);
    },

    //Get Public Server
    publicServer() {
        return api.get(`${CATE}/public`);
    },

    /**************************
     * Files's API 
    **************************/

    // get person Directory
    getDirectory(shareId, path, _this) {
        let data = {
            share_id: shareId,
            path: path
        }
        return api.get(`${CATE}/directory`, data, _this);
    },

    /**************************
     * Download API 
    **************************/

    // Get file Download List
    getDownloadList(state) {
        let data = {
            state: state
        }
        return api.get(`${CATE}/list`, data)
    },

    // Download file
    downloadFile(shareId, path, localPath, fileName) {
        let data = {
            share_id: shareId,
            path: path,
            local_path: localPath,
            file_name: fileName
        }
        return api.get(`${CATE}/file`, data);
    },

    // If download faild you can retry
    reDownload(fileId) {
        return api.get(`${CATE}/refile/${fileId}`);
    },

    // Delete download file records
    deleteDownloadRecord(fileId) {
        return api.delete(`${CATE}/file/${fileId}`);
    },

    /**************************
     * Host user's API
    **************************/

    // Get own share ID
    getMyShareId() {
        return api.get(`user/shareid`);
    },


    // Get own share folder or file list

    getMyShareList() {
        return api.get(`${CATE}/share`);
    },

    // Update a file or folder for share list

    updateShareList(pathArray) {
        let data = {
            share: JSON.stringify(pathArray),
        }
        return api.post(`${CATE}/share`, data)
    },

    // Get save path

    getSavePath() {
        return api.get(`${CATE}/down/dir`);
    },
    // Update save path
    updateSavePath(path) {
        let data = {
            path: path,
        }
        return api.post(`${CATE}/down/dir`, data);
    }
}

export default person;