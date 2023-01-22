import MD5 from "crypto-js/md5";
//JUST FOR DEV MODE
const urlSever= "localhost";
const port = 1999;
const socket = "http://"+urlSever+":"+port
//JUST FOR DEV MODE



export const SrvDoLogin = (Email,Password) =>{

    return new Promise((resolve,reject)=>{
        fetch(socket +"/getUser",{
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                "Email": Email,
                "Password": MD5(Password).toString() 
            })
        }).then(res => {
            if (res.status == 200) {
                resolve(res.json());
            } else {
                reject(null);
            }
        }).catch(err=>{
            console.log(err);
            reject(err);
        })
    });
}


export const SrvDoSignUp = (Email,Password) =>{
    return new Promise((resolve,reject)=>{
        fetch(socket +"/insertUser",{
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                "Email": Email,
                "Password": MD5(Password).toString() 
            })
        }).then(res => {
            if(res.status==200){
                resolve(res.json());
            }else{
                reject(null);
            }
        }).catch(err=>{
            console.log(err);
            reject(err);
        })
    });
}