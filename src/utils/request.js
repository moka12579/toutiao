import axios from "axios";
import config from "uview-ui/libs/config/config";
import store from "@/store";

const baseURL = process.env.NODE_ENV === "development" ? "/dev-api" : "https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http"
const Authorization = "Bearer "+localStorage.getItem("token")

const service = axios.create({
    timeout: 60000, // 请求超时时间
    baseURL,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

service.interceptors.request.use(
    config => {
        if(config.url === "https://upload-z1.qiniup.com")
            config.headers["Content-Type"] = "multipart/form-data"
        const whiteList = ["/","/login","/register"]
        if (whiteList.findIndex(v => v === config.url) === -1)
            config.headers["Authorization"] = Authorization
        return config
    },
    error => {
        console.log(error)
    }
)

service.interceptors.response.use(
    config => {
        return config
    },
    error => {
        console.log(error)
    }
)


export const get = (url) => {
    return new Promise((resolve, reject) => {
        service.get(url).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
    })
}

export const post = (url,data) => {
    return new Promise((resolve, reject) => {
        service.post(
            url,
            data,
        ).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}