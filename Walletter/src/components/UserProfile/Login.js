import { IonLabel, IonItem, IonSegment, IonSegmentButton, IonInput, IonCardSubtitle, IonButton } from "@ionic/react";
import { useState } from "react";
import { SrvDoLogin, SrvDoSignUp } from "../../ServerTalker";


export default function Login(props){

    let [Email,setEmail] = useState(null);
    let [Password,setPassword] = useState(null);
    let [Login,setLogin] = useState(true); // login, false=> signup
    let [ValueSegment, setValueSegment] = useState("Login");

    function processCredentials(){
        if(Email != null || Email.length!=0 && Password!= null || Password.length!=0){

            if(Login){
                SrvDoLogin(Email,Password).then(res=>{
                    props.setUser({
                        "Email":Email,
                        "Password": Password
                    });
                    props.okAuth();
                }).catch(err=>{
                    console.log(err);
                    alert("Error, user not found!")
                })
            }else{
                SrvDoSignUp(Email, Password).then(res => {
                    props.setUser({
                        "Email":Email,
                        "Password": Password
                    });
                    props.okAuth();
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


            <IonCardSubtitle>{(Login)?"Login":"Sign up"}</IonCardSubtitle>
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