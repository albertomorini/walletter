import MD5 from "crypto-js/md5";
//JUST FOR DEV MODE
const urlSever= "localhost";
const port = 1999;
const socket = "http://"+urlSever+":"+port
//JUST FOR DEV MODE


function doRequest(endpoint,body){
    return new Promise((resolve, reject) => {
        fetch(socket + "/" + endpoint, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(body)
        }).then(res => {
            if (res.status == 200) {
                resolve(res.json());
            } else {
                reject(null);
            }
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    });
}



export const SrvDoLogin = (Email,Password) =>{
    return doRequest("getUser",{
        "Email": Email,
        "Password": MD5(Password).toString() 
    });
}


export const SrvDoSignUp = (Email,Password) =>{
    return doRequest("insertUser",{
        "Email": Email,
        "Password": MD5(Password).toString() 
    });
}

/////////////////////////////////////////////
export const SrvSaveTransaction = (Transaction) =>{
    console.log(Transaction);
    return doRequest("saveTransaction", Transaction);
}

export const SrvGetAllTransactions = (Email,Password) =>{
    return doRequest("getAllTransaction",{
        "Email": Email,
        "Password": MD5(Password).toString() 
    });
}

export const SrvDeleteTransaction = (idTransaction) =>{
    return doRequest("deleteTransaction",{
        "idTransaction": idTransaction
    })
}