//This class execute queries to mongodb and then, sends the results to the client (so has response function of server.js)


const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/Walletter";
var ObjectId = require('mongodb').ObjectID;
const Collection_Register = "WT_REGISTER";
const Collection_Users= "WT_USERS";

const fs = require("fs"); //we need to write the export file before send it


function doResponse(res,status, body, contentType="application/json"){ 
    res.writeHead(status,{"Content-type":contentType,"Access-Control-Allow-Origin":"*"})
    if(contentType!="application/json"){ //with export operation we send a file
        res.write(body);
    }else{
        res.write(JSON.stringify(body));
    }
    res.end();
}


//////////////////////////////////////////

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
function saveTransaction(res,objReg){
    MongoClient.connect(url, (err, db) => {
        let dbo = db.db("Walletter");
        dbo.collection(Collection_Register).insertOne(objReg, (err, resReg) => {
            if (err){
                doResponse(res,500,{"transaction":err})
            }
            doResponse(res,200,{"transaction":objReg})
            db.close();
        });
    });
}

function getExistingReferences(res,Email,Password){
    getUser(Email,Password).then(resAuth=>{
        if(resAuth!=null){
            MongoClient.connect(url,(err,db)=>{
                if(err){
                    doResponse(res,403,{"err":"unauthorized"})
                }
                let dbo = db.db("Walletter");
                dbo.collection(Collection_Register).find({"Email":Email}).toArray((err,resReferences)=>{
                    if(err){
                        doResponse(res,500,{"err":err});
                    }
                    let singleReferences = [];
                    resReferences.forEach(s=>{
                        if(singleReferences.indexOf(s.Reference)==-1){ //we need a unique array
                            singleReferences.push(s.Reference)
                        }
                    });
                    doResponse(res,200,{"singleReferences":singleReferences})
                })
            });
        }
    })
}

/**
 * Return all transactions of a user
 */
function getAllTransaction(res,Email,Password){
    getUser(Email,Password).then(resAuth=>{ 
        if(resAuth!=null){
            MongoClient.connect(url, (err,db)=>{
                let dbo= db.db("Walletter");
                dbo.collection(Collection_Register).find({ "Email": Email }).toArray((err,resTransactions)=>{
                    doResponse(res, 200, { "transactions": resTransactions });
                });
            });
        }else{
            doResponse(res, 500, { "transactions": null });
        }
    });
}

function deleteTransaction(res,idTransaction,Email,Password){
     getUser(Email,Password).then(resAuth=>{
        if(resAuth!=null){
            MongoClient.connect(url,(err,db)=>{
                let dbo = db.db("Walletter");
                dbo.collection(Collection_Register).deleteOne({ "_id": ObjectId(idTransaction), "Email":Email }, (err,resDelte)=>{
                    if(err){
                        console.log(err);
                        doResponse(res,500,{"deleteTransaction":err})
                    }
                    doResponse(res,200,{"deleteTransaction":resDelte})
                })
            })
        }else{
            doResponse(res,403,{"err":"unauthorized"})
        }
    }).catch(err=>{
            doResponse(res,403,{"err":"unauthorized"})
    })
}


//// EXPORT-IMPORT
function doExport(res,Email,Password){
    getUser(Email,Password).then(resAuth=>{
        if(resAuth!=null){
            MongoClient.connect(url,(err,db)=>{
                let dbo= db.db("Walletter");
                dbo.collection(Collection_Register).find({"Email":Email}).toArray((err,resAll)=>{
                    if(err){
                        console.log(err);
                        doResponse(res,500,{"export":null})
                    }

                    fs.writeFileSync("./tmpExpoImpo/expo"+Email+".json",JSON.stringify({"transactions":resAll}));
                    doResponse(res,200,fs.readFileSync("./tmpExpoImpo/expo"+Email+".json"),"file");
                    //after 10sec we can remove the export file from server
                    setTimeout(()=>{
                        fs.unlinkSync("./tmpExpoImpo/expo"+Email+".json")
                    },[10000]);
                })
            });
        }else{
            doResponse(res,403,{"err":"unauthorized"})
        }
    }).catch(err=>{
        doResponse(res,500,{"export":null})

    })
}


////////// USERS
function insertUser(res,objUsr){
    MongoClient.connect(url, async (err,db)=>{
        let dbo = db.db("Walletter");
        let usr = await getUser(objUsr.email,objUsr.psw);
        if (usr == null){ //if user doesn't exists
            dbo.collection(Collection_Users).insertOne(objUsr, (err, res) => {
                if (err) {
                    console.log(err);
                    doResponse(res, 500, {
                        "usr": null
                    });
                }
                db.close();
                doResponse(res,200,{
                    "usr": {
                        "email": objUsr.Email,
                        "psw": objUsr.Password,
                        "premium": false
                    }
                })
            });
        }else{
            db.close();
            doResponse(res, 500, {
                "usr": null
            });
        }
    });
}

function getAuth(res,email,psw){
    let usr = await = getUser(email,psw);
    usr.then(usrRes=>{
        (usrRes!=null)? doResponse(res,200,{"usr": usrRes}) : doResponse(res, 404,{"usr": null})
    })  
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


function getAllUsers(){
//TODO: remove this one
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


module.exports={
	getAllUsers: getAllUsers,
	getUser: getUser,
	insertUser: insertUser,
    getAuth: getAuth,
	deleteTransaction:deleteTransaction,
	getAllTransaction:getAllTransaction,
	getExistingReferences: getExistingReferences,
	saveTransaction: saveTransaction,
	createCollection:createCollection,
    doExport: doExport
}

// function deleteUser(objUsr){
//     MongoClient.connect(url,(err,db)=>{
//         let dbo= db.db("Walletter");
//         dbo.collection(Collection_Users).deleteOne(objUsr).toArray((err,res)=>{
//             if(err){
//                 return false;
//             }
//             return true;
//         })
//     })
// }


