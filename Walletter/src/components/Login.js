import { IonLabel, IonItem, IonToggle, IonSegment, IonSegmentButton, IonInput, IonButton, IonTitle, IonHeader, IonToolbar } from "@ionic/react";
import { useState } from "react";
import { doRequest, bodyUser } from "../ServerTalker";
import { Storage } from '@ionic/storage';
import MD5 from "crypto-js/md5";

export default function IsLogin(props){

    let [Email,setEmail] = useState(null);
    let [Password,setPassword] = useState(null);
    let [IsLogin,setIsLogin] = useState(true); // is login, false=> signup
    let [Remember,setRemember] = useState(true);
    let [Message,setMessage] = useState(null);
    const store = new Storage();

    //store credentials into @ionic/storage (indexDB)
    function storeCredentials(Email,Password){
        if(Remember){
            store.create();
            store.set("User",{
                "Email":Email,
                "Password": MD5(Password).toString()
            });
        }
    }

    function processCredentials(){
        if(Email!=null && Password!=null){
            let scope="getAuth"
            if(!IsLogin){ //sign up
                scope="user";
            }
            
            doRequest(scope,
                bodyUser(Email, MD5(Password).toString())
            ).then(res => res.json()).then(res => {
                if(res.usr!=null){
                    props.setUser({
                        "Email": Email,
                        "Password": MD5(Password).toString()
                    });
                    storeCredentials(Email, Password)
                }else{
                    setMessage("User not found: "+res);
                    setTimeout(()=>setMessage(null),2500)
                }
            }).catch(err => {
                console.log(err);
                alert("Error, user not found!"+err)
            })
        }
    }

    function enterPressed(ev){ 
        if (ev.key == "Enter") { //if pressend enter, process credentials
            processCredentials()
        }
    }

    return(
        <div>
            <IonSegment value={IsLogin} onClick={(ev) => setIsLogin(ev.target.value==="true")} mode="ios">
                <IonSegmentButton value={true}>
                    <IonLabel>Login</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value={false}>
                    <IonLabel>Sign up</IonLabel>
                </IonSegmentButton>
            </IonSegment>

            <IonItem>
                <IonLabel mode="ios" position="stacked">Email</IonLabel>
                <IonInput placeholder="Email" type="email" onIonChange={(ev) => setEmail(ev.target.value)} onKeyDown={(ev) => enterPressed(ev)}></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel mode="ios" position="stacked">Password</IonLabel>
                <IonInput placeholder={(IsLogin) ? "Password" : "Pick a strong one"} type="password" onIonChange={(ev)=>setPassword(ev.target.value)} onKeyDown={(ev)=>enterPressed(ev)}></IonInput>
            </IonItem>
            <br/>
            
            <IonToggle enableOnOffLabels="true" mode="ios" labelPlacement="end" checked={Remember} onIonChange={(ev)=>setRemember(!Remember)}>
                Remember me
            </IonToggle>

            <br/>
            <br/>
            <IonButton expand="block" onClick={()=>processCredentials()} >
                {(IsLogin)?"Login":"Sign up"}
            </IonButton>
            <h4 style={{color:"red", textAlign:"center"}}>{Message}</h4>
        </div>
    );
}