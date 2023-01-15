
const http = require("http");
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

function getRegister(){
    MongoClient.connect(url, (err,db)=>{
        let dbo= db.db("Walletter");
        dbo.collection(Collection_Register).find({}).toArray((err,res)=>{
            console.log(res);
        })
    });
}


function insertUser(objUsr){
    MongoClient.connect(url,(err,db)=>{
        let dbo = db.db("Walletter");
        dbo.collection(Collection_Users).insertOne(objUsr,(err,res)=>{
            if(err){
                console.log(err);
            }
            console.log("OK");
            db.close();
        });
    });
}
function getUser(objUsr){
    MongoClient.connect(url,(err,db)=>{
        let dbo = db.db("Walletter");
        dbo.collection(Collection_Users).find(objUsr).toArray((err,res)=>{
            console.log(res);
        })
    });
}

//////////////
let regTmp ={
    "import":23,
    "date":"11/02/22",
    "type": "out",
    "causale":"cadoro"
}


let usrTmp={
    "email": "alby@alby",
    "psw":"2md5",
    "id":"comesifacevaaa"
}

//insertUser(usrTmp)
getUser(usrTmp) // return [] if not found, else array

//insertRegister(regTmp);
//getRegister();