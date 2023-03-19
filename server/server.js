// SERVER
const https = require("https");
const fs = require("fs");
const queryResponder = require("./queryResponder.js")
//////////////////////////////////////////
const port = 1999;
const locationWebApp="https://10.0.0.3:3000"



const options = {
    key: fs.readFileSync("./certs/key.pem"),
    cert: fs.readFileSync("./certs/cert.pem")
}

https.createServer(options,(req,res)=>{
    let body="";
    req.on("data",(chunk)=>{
        body+=chunk;
    });
    req.on("end",()=>{
        let bodyDict = null;
        try{
            bodyDict = JSON.parse(body);
        }catch(ex){
        }


        //REDICT TO THE WEBAPP
        if(req.url=="/"){
            res.writeHead(302,{
                "Location": locationWebApp
            });
            res.end();
        }

        //////////////////////////////////////////
        if (req.url=="/getAuth"){
            queryResponder.getAuth(res,bodyDict.Email, bodyDict.Password);          
        }else if(req.url=="/user"){
            queryResponder.insertUser(res,{"email": bodyDict.Email,"psw": bodyDict.Password,"premium": false})
        }


        //EXPORT-IMPORT
        if(req.url=="/getExport"){
            queryResponder.doExport(res,bodyDict.Email,bodyDict.Password);
        }else if(req.url=="/doImport"){
            queryResponder.doImport(res, bodyDict.DataB64.split("base64,")[1],bodyDict.Email);
        }


        //TRANSACTIONS
        if(req.url=="/transaction"){
            queryResponder.saveTransaction(res,bodyDict)
        }else if(req.url=="/deleteTransaction"){
            console.log(bodyDict)
            queryResponder.deleteTransaction(res,bodyDict.idTransaction,bodyDict.Email,bodyDict.Password);
        }else if(req.url=="updateTransaction"){

        }


        //SUGGESTIONS
        if (req.url =="/getExistingReferences"){
            queryResponder.getExistingReferences(res,bodyDict.Email,bodyDict.Password);
        } else if (req.url =="/getAllTransaction"){
            queryResponder.getAllTransaction(res,bodyDict.Email,bodyDict.Password)
        }

    });
}).listen(port);

