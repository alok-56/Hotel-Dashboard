import { BASEURL } from "../BaseUrl";
import Cookies from "js-cookie";

export const MultipleFileUpload = async (files) => {
    let token = Cookies.get("token");
    try {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("Image", file);
        });

        const response = await fetch(`${BASEURL}/file/multiple`, {
            method: "POST",
            body: formData,
            headers: {
                token: `${token}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.error("Upload failed:", error);
        return { error: error.message };
    }
};

export const SingleFileUpload = async (files) => {
    let token = Cookies.get("token");
    try {
        const formData = new FormData();
        formData.append("Image", files);

        const response = await fetch(`${BASEURL}/file/single`, {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data",
                token: `${token}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.error("Upload failed:", error);
        return { error: error.message };
    }
};

export const DeleteFileUpload = async (file) => {
    let token = Cookies.get("token");
    try {
        const response = await fetch(`${BASEURL}/file/delete?imageUrl=${file}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                token: `${token}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.error("Upload failed:", error);
        return { error: error.message };
    }
};
