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
        let bodyDict = JSON.parse(body);

        if (req.url=="/getAuth"){
            queryResponder.getAuth(res,bodyDict.Email, bodyDict.Password);          
        }


        //USER
        if(req.url=="/user"){
            if(req.method=="POST"){
                queryResponder.insertUser(res,{"email": bodyDict.Email,"psw": bodyDict.Password,"premium": false})
            }else if(req.method=="DELETE"){
                //TODO: delete user
            }
        }


        //EXPORT-IMPORT
        if(req.url=="/getExport"){
            queryResponder.doExport(res,bodyDict.Email,bodyDict.Password)
        }else if(req.url=="/importBackup"){
            //TODO:
            queryResponder.doImport(res,bodyDict.Email,bodyDict.Password,body);
        }

        //TRANSACTIONS
        if(req.url=="/transaction"){
            if(req.method=="POST"){
                queryResponder.saveTransaction(res,bodyDict)
            }else if(req.method=="DELETE"){
                queryResponder.deleteTransaction(res,bodyDict.idTransaction,bodyDict.Email,bodyDict.Password);
            }else if(req.method=="PUT"){
                //TODO: update transaction
            }
        } 

        //SUGGESTIONS
        if (req.url =="/getExistingReferences"){
            queryResponder.getExistingReferences(res,bodyDict.Email,bodyDict.Password);
        } else if (req.url =="/getAllTransaction"){
            queryResponder.getAllTransaction(res,bodyDict.Email,bodyDict.Password)
        }

    });
}).listen(port);

