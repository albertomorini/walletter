import MD5 from "crypto-js/md5";
//JUST FOR DEV MODE
const urlSever= "localhost";
const port = 1999;
const socket = "http://"+urlSever+":"+port
//JUST FOR DEV MODE


function doRequest(endpoint,body,method,responseType="JSON"){
    return new Promise((resolve, reject) => {
        fetch(socket + "/" + endpoint, {
            method: method,
            mode: "cors",
            headers: {
                "Content-type": "Application/JSON",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(body)
        }).then(res => {
            if(responseType!="JSON" && res.status==200){
                resolve(res.blob()); //for export function
            }
            if (res.status == 200) {
                resolve(res.json());
            } else {
                reject(res.json()); //TODO: check
            }
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    });
}



export const SrvDoLogin = (Email,Password) =>{
    return doRequest("getAuth",{
        "Email": Email,
        "Password": MD5(Password).toString() 
    },"POST");
}


export const SrvDoSignUp = (Email,Password) =>{
    return doRequest("user",{
        "Email": Email,
        "Password": MD5(Password).toString() 
    },"POST");
}

export const SrvDoExport = (Email,Password)=>{
    return doRequest("getExport",{
        "Email": Email,
        "Password": MD5(Password).toString() 
    },"POST","FILE");
}


/////////////////////////////////////////////
export const SrvGetExistingReferences = (Email, Password) =>{
    return doRequest("getExistingReferences",{
        "Email": Email,
        "Password": MD5(Password).toString() 
    },"POST")
}


export const SrvGetAllTransactions = (Email,Password) =>{
    return doRequest("getAllTransaction",{
        "Email": Email,
        "Password": MD5(Password).toString() 
    },"POST");
}


export const SrvSaveTransaction = (Transaction) =>{
    return doRequest("transaction", Transaction,"POST");
}

export const SrvDeleteTransaction = (idTransaction,Email,Password) =>{
    return doRequest("transaction",{
        "Email": Email,
        "Password": MD5(Password).toString(),
        "idTransaction": idTransaction
    },"DELETE")
}
