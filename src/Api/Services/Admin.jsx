import { BASEURL } from "../BaseUrl"
import Cookies from "js-cookie";

// Login Api
export const LoginApi = async (payload) => {
    try {
        let response = await fetch(`${BASEURL}/Admin/auth/Login`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Content-type': 'application/json'
            }
        })
        response = await response.json()
        return response
    } catch (error) {
        return error.message
    }
}


// Create Admin
export const CreateAdminApi = async (payload) => {
    let token = Cookies.get("token");

    try {
        let response = await fetch(`${BASEURL}/Admin/create/admin`, {
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
export const UpdateAdminApi = async (payload, id) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Admin/update/admin/${id}`, {
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


// Delete Admin
export const DeleteAdminApi = async (id) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Admin/delete/admin/${id}`, {
            method: "DELETE",
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


//  Get All Admin
export const GetAllAdminApi = async () => {
    let token = Cookies.get("token");
    console.log("aloksaas", token)
    try {
        let response = await fetch(`${BASEURL}/Admin/getall/admin`, {
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

//  Get All Profile
export const GetMYProfileApi = async () => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Admin/profile`, {
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