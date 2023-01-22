import { IonLabel, IonItem, IonInput, IonCardSubtitle, IonButton } from "@ionic/react";
import { useState } from "react";
import { SrvDoLogin, SrvDoSignUp } from "../ServerTalker";


export default function SignUp(props){
    let [Email,setEmail] = useState(null);
    let [Password, setPassword] = useState(null);

    function doSignUp(){
        SrvDoSignUp(Email,Password).then(res)
        
    }
    return(
        <div>
            <IonCardSubtitle>Sign up</IonCardSubtitle>
            <IonItem>
                <IonLabel mode="ios" position="stacked">Email address</IonLabel>
                <IonInput placeholder="Your email" type="email"></IonInput>
            </IonItem>
            <IonItem>
                <IonLabel mode="ios" position="stacked">Password</IonLabel>
                <IonInput placeholder="Pick a strong one" type="password"></IonInput>
            </IonItem>
            <IonButton expand="block" onClick={()=>doSignUp()}>Sign up</IonButton>
 
        </div>
    )
}