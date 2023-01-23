import { useEffect, useRef, useState } from "react"
import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonToggle,
    IonContent,
    IonToolbar,
    IonTitle,
    IonPage,
    IonItem,
    IonLabel,
    IonInput,
} from '@ionic/react';


export default function Dashboard(props){

    let [Amount,setAmount] = useState();
    let [Date,setDate] = useState(); //TODO: default to today w/o moment
    let [IsOutcome, setIsOutcome] = useState(true); //false is an income
    let [Causale,setCausale] = useState();

    const modal = useRef();
    useEffect(()=>{
        console.log(props);
    },[]);

    function insertTransaction(){
        console.log(Amount);
        console.log(Date);
        console.log(IsOutcome);
        console.log(Causale);
        console.log(props.UserEmail);
        modal.current?.dismiss()
    }

    return(
        <div>
            <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => { }} mode="ios">
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton id="closeModal" onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle>Add a transaction</IonTitle>
                        <IonButtons slot="end">
                            <IonButton strong={true} onClick={() => insertTransaction()}>
                                Confirm
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonItem>
                        <IonLabel position="stacked">Amount</IonLabel>
                        <IonInput type="number" min={0} onIonChange={(ev)=>setAmount(ev.target.value)}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Date</IonLabel>
                        <IonInput type="date" mode="ios" onIonChange={(ev)=>setDate(ev.target.value)}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Type</IonLabel>
                        <IonToggle enableOnOffLabels={true} slot="end" value={IsOutcome} onIonChange={(ev)=>setIsOutcome(!IsOutcome)}></IonToggle>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Causale</IonLabel>
                        <IonInput type="text" onIonChange={(ev)=>setCausale(ev.target.value)}></IonInput>
                    </IonItem>
                </IonContent>
            </IonModal>
            Welcome back {props.UserEmail}
            <IonButton id="open-modal">Insert a transaction</IonButton>

        </div>
    )
}