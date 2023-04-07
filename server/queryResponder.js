//THIS CLASS IS A BRIDGE FROM HTTPS SERVER AND MONGODB

const url = "mongodb://localhost:27017/Walletter";
const { MongoClient } = require("mongodb");
const database = new MongoClient(url).db("Walletter");
var ObjectId = require('mongodb').ObjectID;
const COLLECTION_TRANSACTIONS = "WT_TRANSACTIONS";
const COLLECTION_USERS= "WT_USERS";

const fs = require("fs"); //we need to write the export file before send it


/////////////////////////////////////////////////////////////////////

function createCollection(){
    database.createCollection(COLLECTION_USERS).then(res=>{
        database.createCollection(COLLECTION_TRANSACTIONS);
    })
}

/**
 * Insert a new transaction
 * @param {Object} objReg 
 */
async function saveTransaction(objReg){
    //TODO: auth?
    const dbo = database.collection(COLLECTION_TRANSACTIONS);
    // create the document to insert
    const updateDoc = {
        $set: {
            Email: objReg.Email,
            Amount: objReg.Amount,
            Date: objReg.Date,
            IsOutcome: objReg.IsOutcome,
            Reference: objReg.Reference,
        },
    };
    return  dbo.updateOne({ _id: ObjectId(objReg.id), "Email": objReg.Email }, updateDoc, { upsert: true });
}

async function getExistingReferences(Email,Password){
    return getUser(Email,Password).then(resAuth=>{
        if(resAuth==null){
            return null;
        }else{
            return database.collection(COLLECTION_TRANSACTIONS).find({"Email":Email}).toArray().then(resReferences=>{
                if(resReferences.length==0){
                    return null;
                }else{
                    //create a unique array with just the references
                    return Array.from(new Set(resReferences.map(s => s.Reference)))
                }
            });
        }
    });
}

// Returns all transactions of a user
async function getAllTransaction(Email,Password){
    return getUser(Email, Password).then(resAuth =>{
        if(resAuth!=null){
            return database.collection(COLLECTION_TRANSACTIONS).find({"Email":Email}).toArray().then(res=>{
                return res;
            })
        }else{
            return null;
        }
    })
}

/**
 * 
 * @param {String} idTransaction that we want to delete ObjectID 
 * @param {String} Email of user
 * @param {String} Password hash of psw user
 * @returns the result of the deletion
 */
async function deleteTransaction(idTransaction,Email,Password){
    return getUser(Email,Password).then(resAuth=>{
        if(resAuth!=null){
            return database.collection(COLLECTION_TRANSACTIONS).deleteOne({ "_id": ObjectId(idTransaction), "Email": Email })
        }else{
            return null;
        }
    })
}


//// EXPORT-IMPORT

function _decodeBase64ToUtf8(b64string) {
    var buffer;
    if (typeof Buffer.from === "function") {
        // Node 5.10+
        buffer = Buffer.from(b64string, 'base64');
    } else {
        // older Node versions
        buffer = new Buffer(b64string, 'base64');
    }
    return buffer;
}


async function doImport(b64data,Email){
    let path = "./tmpExpoImpo/imp_" + Email + "_at" + Date.now() + ".json"
    fs.writeFileSync(path, _decodeBase64ToUtf8(b64data));

    let dataToImport = JSON.parse(fs.readFileSync(path));
    let tmp = dataToImport.transactions.map(s=>  {return {...s,Email:Email} }) //replace the email with the one of current user, this because a user can change profile
    tmp.forEach(s=>delete s._id) //remove the _id to avoid a duplicated
    
    setTimeout(()=>{
        fs.unlinkSync(path);
    },[10000]); //remove the file created

    return database.collection(COLLECTION_TRANSACTIONS).insertMany(tmp)
}


////////// USERS
/**
 * @param {Object} objUsr user profile
 * @returns the user if not already exists
 */
async function insertUser(objUsr){
    return getUser(objUsr.email,objUsr.psw).then(resAuth=>{
        if(resAuth==null){
            return db.collection(COLLECTION_USERS).insertOne(objUsr);
        }else{
            return null;
        }
    })
}

/**
 * @param {String} email of user
 * @param {String} psw hash MD5 of the user psw
 * @returns the profile of user if exists otherwise null
 */
async function getUser(email,psw){
    return database.collection(COLLECTION_USERS).find({ "email": email, "psw": psw }).toArray().then(resAuth=>{
        if (resAuth.length == 0) { //not found or error return null
            return null;
        } else {
            return resAuth[0]
        }
    });
}


module.exports={
	getUser: getUser,
	insertUser: insertUser,
	deleteTransaction:deleteTransaction,
	getAllTransaction:getAllTransaction,
	getExistingReferences: getExistingReferences,
	saveTransaction: saveTransaction,
	createCollection:createCollection,
    doImport: doImport,
}

//////////////////////////////////////////////////////
//FIX MONGO COLLECTION AFTER TESTS, cool stuff tho
/*
function renamedCollection(){
    MongoClient.connect(url,(err,db)=>{
            let dbo = db.db("Walletter");
            dbo.collection("WT_REGISTER").rename("WT_TRANSACTIONS", function(err, newColl) {
                console.log(newColl)
            });
            dbo.collection(COLLECTION_USERS).find().toArray((err,res)=>{
                if(err){
                    reject(err);
                }
                console.log(res);

                db.close();
                
            });
        });

}

function getAllUsers(){
    return new Promise((resolve,reject)=>{
        MongoClient.connect(url,(err,db)=>{
            let dbo = db.db("Walletter");
            dbo.collection(COLLECTION_USERS).find().toArray((err,res)=>{
                if(err){
                    reject(err);
                }
                console.log(res);

                db.close();
                
            });
        });
    })
}
getAllUsers()

function deleteUser(objUsr){
    MongoClient.connect(url,(err,db)=>{
        let dbo= db.db("Walletter");
            var myquery = {"email":{$ne:"alberto@morini"}};
          dbo.collection("WT_USERS").deleteMany(myquery, function(err, obj) {
            if (err) throw err;
            db.close();
          });
    })
}


*/