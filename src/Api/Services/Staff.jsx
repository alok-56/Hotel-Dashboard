import { BASEURL } from "../BaseUrl";
import Cookies from "js-cookie";


// Create Staff
export const CreateStaffApi = async (payload) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Staff/create/Staff`, {
            method: "POST",
            body: JSON.stringify(payload),
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


// Create Salary
export const CreateSalaryApi = async (payload) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Staff/create/Salary`, {
            method: "POST",
            body: JSON.stringify(payload),
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

// Update Update
export const UpdateStaffApi = async (payload, id) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Staff/update/Staff/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
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



//  Get All Staff
export const GetAllStaffApi = async () => {
    let token = Cookies.get("token")
    try {
        let response = await fetch(`${BASEURL}/Staff/getall/Staff`, {
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


//  Get All Salary
export const GetAllSalaryApi = async () => {
    let token = Cookies.get("token")
    try {
        let response = await fetch(`${BASEURL}/Staff/getall/Salary`, {
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

