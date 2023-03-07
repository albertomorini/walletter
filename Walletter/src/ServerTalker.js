import MD5 from "crypto-js/md5";
import ServerConfig from "./ServerConfig.json"


export const doRequest = (api,body,method="POST") => {
    return fetch(ServerConfig.SocketServer+"/"+api,{
        method: method,
        mode: "cors",
        body: JSON.stringify(body)
    });
}

export const bodyUser = (Email,Password) =>{
    return {
        "Email":Email,
        "Password": MD5(Password).toString()
    }
}

