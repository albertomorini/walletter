

fetch("http://localhost:1999/getUser",{
    method: "POST",
    mode:"cors",
    body: JSON.stringify({
        "email": "22@alby",
        "psw": "2md5",
        "premium": true
    })
}).then(res=>res.json()).then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err);
})
