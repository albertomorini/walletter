import { IonLabel, IonItem, IonToggle, IonSegment, IonSegmentButton, IonInput, IonButton } from "@ionic/react";
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

    /**
     * do the login or sing up
     * @param {string} emailP 
     * @param {psw} passwordP 
     * @param {boolean} isLoginP if is login or sign up
     */
    function processCredentials(emailP,passwordP,isLoginP){
        if (emailP != null && passwordP !=null){
            doRequest((isLoginP) ? "getAuth" :"user", //login or sign up
                bodyUser(emailP, MD5(passwordP).toString())
            ).then(res => res.json()).then(res => {
                if(res.usr!=null){
                    props.setUser({
                        "Email": emailP,
                        "Password": MD5(passwordP).toString()
                    });
                    storeCredentials(emailP, passwordP)
                }else{
                    setMessage("User not found");
                    setTimeout(()=>setMessage(null),2500)
                }
            }).catch(err => {
                console.log(err);
                alert("Error doing the login... retry")
            })
        }
    }

    function enterPressed(ev){ 
        if (ev.key == "Enter") { //if pressend enter, process credentials
            //The states can be still empty (not updated yet), so we retrieve the value with javascript
            let tmpMail = document.getElementById("inputEmail").value;
            let tmpPsw = document.getElementById("inputPsw").value;
            let tmpToggle = document.getElementById("inputIsLogin").value;
            processCredentials(tmpMail,tmpPsw,tmpToggle);
        }
    }

    return(
        <div style={{width: "50%", margin: "0 auto", marginTop: "20px"}}>
            
            <IonSegment
                value={IsLogin} 
                onClick={(ev) => setIsLogin(ev.target.value==="true")} 
                mode="ios"
                id="inputIsLogin"
            >
                <IonSegmentButton value={true}>
                    <IonLabel>Login</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value={false}>
                    <IonLabel>Sign up</IonLabel>
                </IonSegmentButton>
            </IonSegment>

            <IonItem>
                <IonLabel mode="ios" position="stacked">Email</IonLabel>
                <IonInput 
                    placeholder="Email" mode="ios" 
                    fill="outline" type="email" 
                    id="inputEmail"
                    onIonChange={(ev) => setEmail(ev.target.value)}    
                    onKeyDown={(ev) => enterPressed(ev)}
                />
            </IonItem>
            <IonItem>
                <IonLabel mode="ios" position="stacked">Password</IonLabel>
                <IonInput 
                    placeholder={(IsLogin) ? "Password" : "Pick a strong one"}
                    type="password" 
                    id="inputPsw"
                    onIonChange={(ev)=>setPassword(ev.target.value)}
                    onKeyDown={(ev)=>enterPressed(ev)}
                />
            </IonItem>
            <br/>
            
            <IonToggle color="dark"
                enableOnOffLabels="true" mode="ios"
                checked={Remember}
                onIonChange={(ev)=>setRemember(!Remember)}
                labelPlacement="start"
                style={{float:"right"}}
            >
                Remember me
            </IonToggle>

            <br/>
            <br/>
            <IonButton color="dark" expand="block" onClick={()=>processCredentials(Email,Password,IsLogin)} >
                {(IsLogin)?"Login":"Sign up"}
            </IonButton>
            <h4 style={{color:"red", textAlign:"center"}}>{Message}</h4>
      
        </div>
    );
}