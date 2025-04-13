import { BASEURL } from "../BaseUrl"
import Cookies from "js-cookie";

// Create Room
export const CreateRoomApi = async (payload) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Room/create/room`, {
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
export const UpdateRoomApi = async (payload, id) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Room/update/room/${id}`, {
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


// Delete Room
export const DeleteRoomApi = async (id) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Room/delete/room/${id}`, {
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


//  Get All Room
export const GetAllRoomApi = async () => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Room/getall/room`, {
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

// Search Room

export const SearchRoomApi = async (branchid, checkindate, checkoutdate) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Room/search/room?branchid=${branchid}&checkindate=${checkindate}&checkoutdate=${checkoutdate}`, {
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
