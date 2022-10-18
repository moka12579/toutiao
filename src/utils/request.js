import axios from "axios";

const baseURL = process.env.NODE_ENV === "development" ? "/dev-api" : "https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http"

export const get = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(baseURL+url).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
    })
}

export const post = (url,data) => {
    return new Promise((resolve, reject) => {
        axios.post(
            baseURL+url,
            data,
        ).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}