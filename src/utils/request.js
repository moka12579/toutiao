import axios from "axios";

const baseURL = "/dev-api"

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
            data
        ).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })

}