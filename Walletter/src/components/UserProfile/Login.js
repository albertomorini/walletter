import { IonLabel, IonItem, IonSegment, IonSegmentButton, IonInput, IonCardSubtitle, IonButton } from "@ionic/react";
import { useState } from "react";
import { doRequest,bodyUser } from "../../ServerTalker";
import { Storage } from '@ionic/storage';
import MD5 from "crypto-js/md5";


export default function Login(props){

    let [Email,setEmail] = useState(null);
    let [Password,setPassword] = useState(null);
    let [Login,setLogin] = useState(true); // login, false=> signup
    let [ValueSegment, setValueSegment] = useState("Login");
    const store = new Storage();

    function storeCredentials(Email,Password){
        store.create();
        store.set("User",{
            "Email":Email,
            "Password": MD5(Password).toString()
        });

    }

    function processCredentials(){
        if(Email != null || Email.length!=0 && Password!= null || Password.length!=0){

            if(Login){
                doRequest("getAuth",
                    bodyUser(Email,MD5(Password).toString())
                ).then(res=>res.json()).then(res=>{
                    if(res.usr==null){
                        throw new Error
                    }
                    props.setUser({ //TODO: remove, use context instead
                        "Email":Email,
                        "Password": MD5(Password).toString()
                    });
                    storeCredentials(Email,Password);
                }).catch(err=>{
                    console.log(err);
                    alert("Error, user not found!")
                })
            }else{
                doRequest("user",
                    bodyUser(Email,Password)
                ).then(res=>res.json()).then(res => {
                    props.setUser({
                        "Email":Email,
                        "Password": MD5(Password).toString()
                    });
                    storeCredentials(Email,Password)
                }).catch(err => {
                    console.log(err);
                    alert("Error, user not found!")
                })
            }   
            
        }
    }
    function enterPressed(ev){ //maybe
        if (ev.key == "Enter") {
            processCredentials()
        }
    }


    return(
        <div>
        <br/>
        <br/>
            <IonSegment value={ValueSegment} onClick={(ev) => { 
                (ev.target.value!="Login")? setLogin(false) : setLogin(true); setValueSegment(ev.target.value) 
                }} mode="ios">
                <IonSegmentButton value="Login">
                    <IonLabel>Login</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="Sign up">
                    <IonLabel>Sign up</IonLabel>
                </IonSegmentButton>
            </IonSegment>

            <IonItem>
                <IonLabel mode="ios" position="stacked">Email address</IonLabel>
                <IonInput placeholder="Email" type="email" onIonChange={(ev) => setEmail(ev.target.value)} onKeyDown={(ev) => enterPressed(ev)}></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel mode="ios" position="stacked">Password</IonLabel>
                <IonInput placeholder={(Login) ? "Password" : "Pick a strong one"} type="password" onIonChange={(ev)=>setPassword(ev.target.value)} onKeyDown={(ev)=>enterPressed(ev)}></IonInput>
            </IonItem>
            
            <IonButton expand="block" onClick={()=>processCredentials()} onKeyDown={(ev)=>{}} >
                {(Login)?"Login":"Sign up"}
            </IonButton>


        </div>
    )
}