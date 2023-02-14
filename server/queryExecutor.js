const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/Walletter";



const Collection_Register = "WT_REGISTER";
const Collection_Users= "WT_USERS";

//TODO: chose where to replay
function doResponse(res,status, body){
    res.writeHead(status, { "Content-type": "Application/JSON" });
    res.write(JSON.stringify(body));
    res.end();
}


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
    return new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            let dbo = db.db("Walletter");
            dbo.collection(Collection_Register).insertOne(objReg, (err, res) => {
                if (err){
                    reject(err);
                }
                console.log(objReg);
                resolve("Saving ok");
                db.close();
            });
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

function deleteTransaction(res,idTransaction){
    MongoClient.connect(url,(err,db)=>{
        let dbo = db.db("Walletter");
        dbo.collection(Collection_Register).deleteOne({ "_id": ObjectId(idTransaction) }, (err,resDelte)=>{
            if(err){
                console.log(err);
                doResponse(res,500,{"deleteTransaction":err})
            }
            doResponse(res,200,{"deleteTransaction":resDelte})
        })
    })
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



function getAllUsers(){
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
	deleteTransaction:deleteTransaction,
	getAllTransaction:getAllTransaction,
	getExistingReferences: getExistingReferences,
	saveTransaction: saveTransaction,
	createCollection:createCollection

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


