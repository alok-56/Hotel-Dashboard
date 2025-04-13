import { BASEURL } from "../BaseUrl";
import Cookies from "js-cookie";


// Create Expense
export const CreateExpenseApi = async (payload) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Expense/create/Expense`, {
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
export const UpdateExpenseApi = async (payload, id) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Expense/update/Expense/${id}`, {
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



//  Get All Expense
export const GetAllExpenseApi = async () => {
    let token = Cookies.get("token")
    try {
        let response = await fetch(`${BASEURL}/Expense/getall/Expense`, {
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


export const DeleteExpenseApi = async (id) => {
    let token = Cookies.get("token");
    try {
        let response = await fetch(`${BASEURL}/Expense/delete/Expense/${id}`, {
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