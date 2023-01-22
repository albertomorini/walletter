import { IonLabel, IonItem, IonInput, IonCardSubtitle, IonButton } from "@ionic/react";
import { useState } from "react";
import { SrvDoLogin, SrvDoSignUp } from "../ServerTalker";


export default function Login(props){

    let [Email,setEmail] = useState(null);
    let [Password,setPassword] = useState(null);
    let [Login,setLogin] = useState(true); // login, false=> signup

    function processCredentials(){
        if(Email != null || Email.length!=0 && Password!= null || Password.length!=0){

            if(Login){
                SrvDoLogin(Email,Password).then(res=>{
                    props.okAuth();
                }).catch(err=>{
                    //TODO:
                    console.log(err);
                    alert("Error, user not found!")
                })
            }else{
                SrvDoSignUp(Email, Password).then(res => {
                    props.okAuth();
                }).catch(err => {
                    //TODO:
                    console.log(err);
                    alert("Error, user not found!")
                })
            }   
            
        }
    }


    return(
        <div>
            <IonButton onClick={()=>{(Login)?setLogin(false):setLogin(true)}}>CHANGE</IonButton>
            <IonCardSubtitle>{(Login)?"Login":"Sign up"}</IonCardSubtitle>
            <IonItem>
                <IonLabel mode="ios" position="stacked">Email address</IonLabel>
                <IonInput placeholder="Email" type="email" onIonChange={(ev)=>setEmail(ev.target.value)}></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel mode="ios" position="stacked">Password</IonLabel>
                <IonInput placeholder="Password" type="password" onIonChange={(ev)=>setPassword(ev.target.value)}></IonInput>
            </IonItem>
            <IonButton expand="block" onClick={()=>processCredentials()}>Login</IonButton>


        </div>
    )
}