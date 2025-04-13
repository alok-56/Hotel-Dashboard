import { BASEURL } from "../BaseUrl"
import Cookies from "js-cookie";

// Create Booking
export const CreateOfflineBookingApi = async (payload) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/booking/create/offline/book`, {
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

// Update Status 
export const UpdateStatusOfflineBookingApi = async (status, id) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/booking/update/book/status?status=${status}&bookingid=${id}`, {
            method: "PATCH",
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


//  Get All Booking
export const GetAllBookingApi = async (status = 'Booked') => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/booking/get/room`, {
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

// Get All Payment
export const GetAllPaymentApi = async (status = true) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/booking/get/payment?status=${status}`, {
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

