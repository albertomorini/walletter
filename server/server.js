// SERVER
const http = require("http");
const port = 1999;
// MONGODB
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/Walletter";


const Collection_Register = "WT_REGISTER";
const Collection_Users= "WT_USERS";


function createCollection(){
    MongoClient.connect(url,(err,db)=>{
        let dbo = db.db("Walletter");
        if(err){
            console.log(err);
        }
        dbo.createCollection(Collection_Users, function (err, res) {
            if (err){
                console.log(err);
            }
            dbo.createCollection(Collection_Register, function (err, res) {
                if (err) {
                    console.log(err);
                }
                dbo.close();
            });
        });
    });
}

/**
 * Insert a new transaction
 * @param {Object} objReg 
 */
function saveTransaction(objReg){
    MongoClient.connect(url, (err, db) => {
        let dbo = db.db("Walletter");
        dbo.collection(Collection_Register).insertOne(objReg, (err, res) => {
            if (err){
                console.log(err);
            }
            db.close();
        });
    });
}
/**
 * Return all transactions of a user
 * @param {Int} UserID 
 */
function getTransaction(UserID){
    getUser(Email,Password).then(res=>{ //TODO: test, think if is okay
        if(res!=null){
            MongoClient.connect(url, (err,db)=>{
                let dbo= db.db("Walletter");
                dbo.collection(Collection_Register).find({"Email":UserID}).toArray((err,res)=>{
                    console.log(res);
                })
            });
        }
    });
}

//////////      USERS
function insertUser(objUsr){
    return new Promise((resolve,reject)=>{
        MongoClient.connect(url, async (err,db)=>{
            let dbo = db.db("Walletter");
            let usr = await getUser(objUsr.email,objUsr.psw);
            if (usr == null){ //if user doesn't exists
                dbo.collection(Collection_Users).insertOne(objUsr, (err, res) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    db.close();
                    resolve(true);
                });
            }else{
                db.close();
                reject(false);
            }
        });
    });
}

function getUser(email,psw){
    return new Promise((resolve,reject)=>{
        MongoClient.connect(url,(err,db)=>{
            let dbo = db.db("Walletter");
            dbo.collection(Collection_Users).find({"email":email, "psw":psw}).toArray((err,res)=>{
                if(err){
                    reject(err);
                }
                if(res.length==0){
                    db.close();
                    resolve(null);
                }else{
                    db.close();
                    resolve(res[0]);
                }
            });
        });
    })
}

function getAllUsers(email,psw){
    return new Promise((resolve,reject)=>{
        MongoClient.connect(url,(err,db)=>{
            let dbo = db.db("Walletter");
            dbo.collection(Collection_Users).find().toArray((err,res)=>{
                if(err){
                    reject(err);
                }
                console.log(res);

                db.close();
                
            });
        });
    })
}

function deleteUser(objUsr){
    MongoClient.connect(url,(err,db)=>{
        let dbo= db.db("Walletter");
        dbo.collection(Collection_Users).deleteOne(objUsr).toArray((err,res)=>{
            if(err){
                return false;
            }
            return true;
        })
    })
}

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
        let bodyDict = JSON.parse(body);
        if (req.url=="/getUser"){
            let usr = await = getUser(bodyDict.Email, bodyDict.Password);
            usr.then(usrRes=>{
                (usrRes!=null)? doResponse(res,200,{"usr": usrRes}) : doResponse(res, 404,{"usr": null})
            })            
        }else if(req.url=="/insertUser"){
            insertUser({
                "email": bodyDict.Email,
                "psw": bodyDict.Password,
                "premium": false
            }).then(resInsert=>{
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
        }else if(req.url=="/deleteUser"){
        }


        //TRANSACTIONS

        if(req.url=="/saveTransaction"){
            saveTransaction(bodyDict).then(resSave=>{
                doResponse(res,200,{"transaction":resSave})
            }).catch(err=>{ //TODO: logging error?
                doResponse(res,500,{"transaction":null})
            })
        }else if(req.url=="/getAllTransaction"){
            getTransaction("a@a"); //works!, check to-do, ask psw
        }else if(req.url=="/getTransaction"){
        }else if(req.url=="/deleteTransaction"){
        }else if(req.url=="/updateTransaction"){
        }



    });
}).listen(port);

