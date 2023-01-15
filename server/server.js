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
            console.log("1 document inserted");
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

/////      USERS

function insertUser(objUsr){
    MongoClient.connect(url,(err,db)=>{
        let dbo = db.db("Walletter");
        if(getUser(objUsr.email,objUsr.psw)!= null){ //if user doesn't exists
            dbo.collection(Collection_Users).insertOne(objUsr, (err, res) => {
                if (err) {
                    console.log(err);
                }
                db.close();
                return true;
            });
        }else{
            db.close();
            return false;
        }
    });
}

function getUser(email,psw){
    MongoClient.connect(url,(err,db)=>{
        let dbo = db.db("Walletter");
        dbo.collection(Collection_Users).find({"email":email, "psw":psw}).toArray((err,res)=>{
            if(err){
                console.log(err);
            }
            if(res.length==0){
                db.close();
                return null;
            }else{
                db.close();
                return res[0]; //TODO: return undefined, not ready --> da vedere se usare promiseee
            }
        });
    });
}

function deleteUser(objUsr){
    MongoClient.connect(url,(err,db)=>{
        let dbo= db.db("Walletter");
        dbo.collection(Collection_Users).deleteOne(objUsr).toArray((err,res)=>{
            console.log(res);
        })
    })
}

//////////////
let regTmp ={
    "import":23,
    "date":"11/02/22",
    "type": "out",
    "causale":"cadoro",
    "idUtente":3
}


let usrTmp={
    "email": "alby@alby",
    "psw":"2md5",
    "premium":true
} //Id || _id

//insertUser(usrTmp)
console.log(
    getUser("alby@alby","2md5") // return [] if not found, else array

)

//insertRegister(regTmp);
//getRegister();

/*
http.createServer((req,res)=>{
    let body="";
    req.on("data",(raw)=>{
        body+=raw
    });
    req.on("end",()=>{
        //TODO: JSON.parse(body)
    });
}).listen(port);
*/