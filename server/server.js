// SERVER
const https = require("https");
const fs = require("fs");
const queryResponder = require("./queryResponder.js")
//////////////////////////////////////////
const port = JSON.parse(fs.readFileSync("./config.json")).ServerPort;
const locationWebApp= JSON.parse(fs.readFileSync("./config.json")).locationWebApp

/**
 * Do the HTTP response
 * @param {Object} res HTTPS response object
 * @param {int} status like 200/500
 * @param {Object} body body of response
 * @param {String} contentType the content type of our response
 */
function sendResponse(res, status, body, contentType = "application/json") {
    res.writeHead(status, { "Content-type": contentType, "Access-Control-Allow-Origin": "*" })
    if (contentType != "application/json") { //with export operation we send a file so we cant strinify the body
        res.write(body);
    } else {
        res.write(JSON.stringify(body));
    }
    res.end();
}


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
        }catch(ex){ //NOT A JSON
            
        }

        //REDIRECT TO THE WEBAPP
        if(req.url=="/"){
            res.writeHead(302,{
                "Location": locationWebApp
            });
            res.end();
        }

        //////////////////////////////////////////
        if (req.url=="/getAuth"){ //a user's trying to authenticate it self
            queryResponder.getUser(bodyDict.Email,bodyDict.Password).then(resQuery=>{
                if(resQuery==null){
                    sendResponse(res, 200, { "usr": null })
                }else{
                    sendResponse(res, 200, { "usr": resQuery })
                }
            })
        }else if(req.url=="/user"){ //new user sign in
            queryResponder.insertUser({ "email": bodyDict.Email, "psw": bodyDict.Password, "premium": false }).then(resQuery=>{
                sendResponse(res,200,{"usr":resQuery})
            }).catch(err=>{
                sendResponse(res,500,{"usr":null})
            })
        }


        //EXPORT-IMPORT
        if(req.url=="/getExport"){
            queryResponder.getAllTransaction(bodyDict.Email, bodyDict.Password).then(resQuery =>{
                if(resQuery!=null){
                    let path = "./tmpExpoImpo/exp_" + bodyDict.Email + "_at" + Date.now() + ".json"
                    fs.writeFileSync(path, JSON.stringify({ "transactions": resQuery }));
                    setTimeout(() => {
                        fs.unlinkSync(path)
                    }, [10000]); //remove it after 10 sec
                    sendResponse(res, 200, fs.readFileSync(path),"file");
                }else{
                    sendResponse(res,500,null);
                }
            })
        }else if(req.url=="/doImport"){ 
            //split the second half of the body (encoded in BASE64)
            queryResponder.doImport(bodyDict.DataB64.split("base64,")[1],bodyDict.Email).then(resQuery=>{
                console.log(resQuery);
                //TODO: TO TEST
                sendResponse(res,200,null);
            });
        }

        //TRANSACTIONS
        if(req.url=="/transaction"){ // update or insert new a transaction
            console.log(bodyDict)
            queryResponder.saveTransaction(bodyDict).then(resQuery=>{
                if(resQuery.acknowledged){
                    sendResponse(res, 200, { "transaction": resQuery })
                }else{
                    sendResponse(res, 200, { "transaction": resQuery })
                }
            })
        }else if(req.url=="/deleteTransaction"){ //delete an existing transaction
            queryResponder.deleteTransaction(bodyDict.idTransaction,bodyDict.Email,bodyDict.Password).then(resQuery=>{
                if(resQuery.acknowledged){
                    sendResponse(res, 200, { deleteTransaction :resQuery})
                }else{
                    sendResponse(res, 500, { deleteTransaction :null})
                }
            })
        }

        //SUGGESTIONS
        if (req.url =="/getExistingReferences"){
            queryResponder.getExistingReferences(bodyDict.Email,bodyDict.Password).then(resQuery=>{
                if(resQuery==null){
                    sendResponse(res, 500, {"singleReferences":null});
                }else{
                    sendResponse(res, 200, {"singleReferences":resQuery})
                }
            });
        } 
        
        //RETURNS ALL TRANSACTIONS OF A USER
        if (req.url =="/getAllTransaction"){
            queryResponder.getAllTransaction(bodyDict.Email,bodyDict.Password).then(resQuery=>{
                if(resQuery!=null){
                    sendResponse(res, 200, { "transactions": resQuery })
                }else{
                    sendResponse(res, 500, {"transactions": null})
                }
            });
        }

    });
}).listen(port);
console.log("Server started at port: "+port)

