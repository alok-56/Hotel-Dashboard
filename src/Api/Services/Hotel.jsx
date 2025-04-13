import { BASEURL } from "../BaseUrl"
import Cookies from "js-cookie";

// Create Hotel
export const CreateHotelApi = async (payload) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Branch/create/branch`, {
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
export const UpdateHotelApi = async (payload, id) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Branch/update/branch/${id}`, {
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


// Delete Hotel
export const DeleteHotelApi = async (id) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Branch/delete/branch/${id}`, {
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


//  Get All Hotel
export const GetAllHotelApi = async () => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Branch/getall/branch`, {
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


