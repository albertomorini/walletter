const http = require("http");


setTimeout(()=>{

fetch("http://localhost:7771/user",{
    method: "PUT",
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
},2000);

http.createServer((req,res)=>{
    let body="";
    req.on("data",(chunk)=>{
        body+=chunk;
    })
    req.on("end",()=>{

        if(req.url=="/user"){
            if(req.method=="PUT"){
                console.log(JSON.parse(body));

            }

        }

    })
}).listen(7771);