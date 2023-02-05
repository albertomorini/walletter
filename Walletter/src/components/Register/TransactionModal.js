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
    IonItem,
    IonLabel,
    IonInput,
} from '@ionic/react';
import moment from "moment"
import { SrvSaveTransaction } from "../ServerTalker";


export default function TransactionModal(props){

    let [Amount, setAmount] = useState();
    let [Date, setDate] = useState(moment().format("YYYY-MM-DD"));
    let [IsOutcome, setIsOutcome] = useState(true); //false is an income
    let [Reference, setReference] = useState();

    const modal = useRef();


    function insertTransaction() {
        SrvSaveTransaction({
            "Email": props.User.Email,
            "Amount": Amount,
            "Date": Date,
            "IsOutcome": IsOutcome,
            "Reference": Reference,
        }).then(res=>{
            modal.current?.dismiss()
        })
    }

    return (
        <div>
            <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => { }} mode="ios">
                <IonHeader mode="ios">
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
                        <IonInput type="number" min={1} onIonChange={(ev) => setAmount(ev.target.value)} mode="ios"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Date</IonLabel>
                        <IonInput data-date-format="DD MM YYYY" type="date" value={Date} placeholder={Date} onIonChange={(ev) => setDate(ev.target.value)} mode="ios"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Type</IonLabel>
                        <IonToggle enableOnOffLabels={true} slot="end" value={IsOutcome} onIonChange={(ev) => setIsOutcome(!IsOutcome)} mode="ios"></IonToggle>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Reference</IonLabel>
                        <IonInput type="text" onIonChange={(ev) => setReference(ev.target.value)} mode="ios"></IonInput>
                    </IonItem>
                </IonContent>
            </IonModal>
            
            <IonButton id="open-modal">Insert a transaction</IonButton>

        </div>
    )
}