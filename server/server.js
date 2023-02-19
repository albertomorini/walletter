// SERVER
const { ObjectId } = require("bson");
const http = require("http");
const port = 1999;
const QueryExecutor = require("./queryExecutor.js")

//////////////////////////////////////////

function doResponse(res,status, body){
    res.writeHead(status, { "Content-type": "Application/JSON" });
    res.write(JSON.stringify(body));
    res.end();
}

http.createServer((req,res)=>{
    let body="";
    req.on("data",(chunk)=>{
        body+=chunk;
    });
    req.on("end",()=>{
        let bodyDict;
        try {
            bodyDict = JSON.parse(body);
        } catch(e) {
            console.log(e);
        }
        if (req.url=="/getAuth"){
            let usr = await = QueryExecutor.getUser(bodyDict.Email, bodyDict.Password);
            usr.then(usrRes=>{
                (usrRes!=null)? doResponse(res,200,{"usr": usrRes}) : doResponse(res, 404,{"usr": null})
            })            
        }


        //USER
        if(req.url=="/user"){
            if(req.method=="POST"){
                QueryExecutor.insertUser({"email": bodyDict.Email,"psw": bodyDict.Password,"premium": false}).then(resInsert=>{
                    doResponse(res,200,{
                        "usr": {
                            "email": bodyDict.Email,
                            "psw": bodyDict.Password,
                            "premium": false
                        }
                    })
                }).catch(err=>{
                    doResponse(res, 500, {
                        "usr": null
                    });
                });
            }else if(req.method=="DELETE"){
                //TODO: delete user
            }
        }


        //EXPORT-IMPORT
        if(req.url=="/getExport"){
            QueryExecutor.doExport(res,bodyDict.Email,bodyDict.Password)
        }


        //TRANSACTIONS

        if(req.url=="/transaction"){
            if(req.method=="POST"){
                QueryExecutor.saveTransaction(bodyDict).then(resSave=>{
                    doResponse(res,200,{"transaction":resSave})
                }).catch(err=>{ //TODO: logging error?
                    doResponse(res,500,{"transaction":err})
                })
            }else if(req.method=="DELETE"){
                QueryExecutor.deleteTransaction(res,bodyDict.idTransaction,bodyDict.Email,bodyDict.Password);
            }else if(req.method=="PUT"){
                //TODO: update transaction
            }
        } 

        //SUGGESTIONS
        if (req.url =="/getExistingReferences"){
            QueryExecutor.getExistingReferences(res,bodyDict.Email,bodyDict.Password);
        } else if (req.url =="/getAllTransaction"){
            QueryExecutor.getAllTransaction(res,bodyDict.Email,bodyDict.Password)
        }



    });
}).listen(port);
