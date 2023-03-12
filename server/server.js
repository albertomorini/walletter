// SERVER
const http = require("http");
const port = 1999;
const queryResponder = require("./queryResponder.js")

//////////////////////////////////////////


http.createServer((req,res)=>{
    let body="";
    req.on("data",(chunk)=>{
        body+=chunk;
    });
    req.on("end",()=>{
        let bodyDict = null;
        try{
            bodyDict = JSON.parse(body);
        }catch(ex){
            console.log(req.url)
            console.log(req.method)
        }

        if (req.url=="/getAuth"){
            queryResponder.getAuth(res,bodyDict.Email, bodyDict.Password);          
        }


        //USER
        if(req.url=="/user"){
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

