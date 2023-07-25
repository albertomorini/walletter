const SocketServer = "https://10.0.0.3:1999" //sever service

export const doRequest = (api,body,method="POST") => {
    return fetch(SocketServer+"/"+api,{
        method: method,
        mode: "cors",
        body: JSON.stringify(body)
    });
}

export const bodyUser = (Email,Password) =>{
    return {
        "Email":Email,
        "Password": Password
    }
}

