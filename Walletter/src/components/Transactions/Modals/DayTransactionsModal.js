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
    IonSelectOption,
    IonSelect,
    IonSearchbar,
    IonList,
} from '@ionic/react';

export default function DayTransactionsModal(props){
  	const modal = useRef();

	 return (
        <div>
            <IonModal ref={modal} trigger="MonthlyCalendar" onWillDismiss={(ev) => { }} mode="ios">
                <IonHeader mode="ios">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton id="closeModal" onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle>Add a transaction</IonTitle>
                        <IonButtons slot="end">
                            <IonButton strong={true} onClick={() =>{}}>
                                Confirm
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    
                </IonContent>
            </IonModal>

        </div>
    )

}