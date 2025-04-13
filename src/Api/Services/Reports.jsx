import { BASEURL } from "../BaseUrl";
import Cookies from "js-cookie";

// Get Dashboard
export const GetDashboardApi = async (branch) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Report/get/dashboard/count?branchIds=${branch}`, {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'token': token
            }
        })
        response = await response.json()
        return response
    } catch (error) {
        return error.message
    }
}

// Get Sales Dashboard
export const GetSalesDashboardApi = async (branch) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Report/get/sales/dashbaord?branchIds=${branch}`, {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'token': token
            }
        })
        response = await response.json()
        return response
    } catch (error) {
        return error.message
    }
}

// Get Payment Dashboard
export const GetPaymentDashboardApi = async (branch) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Report/get/payment/dashboard?branchIds=${branch}`, {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'token': token
            }
        })
        response = await response.json()
        return response
    } catch (error) {
        return error.message
    }
}