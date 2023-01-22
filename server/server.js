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
 * Insert a new transaction/registration
 * @param {Object} objReg 
 */
function insertRegister(objReg){
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
 * Return all registers of a user
 * @param {Int} UserID 
 */
function getRegister(UserID){
    MongoClient.connect(url, (err,db)=>{
        let dbo= db.db("Walletter");
        dbo.collection(Collection_Register).find({"UserID":UserID}).toArray((err,res)=>{
            console.log(res);
        })
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
                if(usrRes!=null){
                    res.writeHead(200,{"Content-type":"Application/JSON"});
                    res.write(JSON.stringify({
                        "usr":usrRes
                    }));
                    res.end();
                }else{
                    res.writeHead(404,{"Content-type":"Application/JSON"});
                    res.write(JSON.stringify({
                        "usr": null
                    }));
                    res.end();
                }
            })            

        }else if(req.url=="/insertUser"){
            insertUser({
                "email": bodyDict.Email,
                "psw": bodyDict.Password,
                "premium": false
            }).then(resInsert=>{
                res.writeHead(200, { "Content-type": "Application/JSON" });
                res.write(JSON.stringify({
                    "usr": {
                        "email": bodyDict.Email,
                        "psw": bodyDict.Password,
                        "premium": false
                    }
                }));
                res.end();
            }).catch(err=>{
                res.writeHead(404, { "Content-type": "Application/JSON" });
                res.write(JSON.stringify({
                    "usr": null
                }));
                res.end();
            })
        }else if(req.url=="/deleteUser"){

        }



    });
}).listen(port);

