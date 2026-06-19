import { AccountRequest } from "../../interface/manager/Account"
import axiosClient from "../axiosClient"

const adminApi ={
    createManager(data:AccountRequest) {
        const url = "/account/create-account"
        return axiosClient.post(url, data)
    },

    countAll(){
        const url = "/account/count-admins"
        return axiosClient.get(url)
    },

    countManager(){
        const url = "/account/count-managers"
        return axiosClient.get(url)
    },

    getAllAccount(){
        const url = "/account/role-manager-admin"
        return axiosClient.get(url)
    },
     
    getOverview(){
        const url = "/ticket-purchase/overview"
        return axiosClient.get(url)
    }
}

export default adminApi;