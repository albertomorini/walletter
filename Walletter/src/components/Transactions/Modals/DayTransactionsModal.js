import { useState } from "react"
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
import ListItem from "../List/ListItem.js"
import moment from "moment"

export default function DayTransactionsModal(props){


	 return (
        <div>
            <IonModal ref={props.modalDayRecap} trigger="MonthlyCalendar" mode="ios">
                <IonHeader mode="ios">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton id="closeModal" onClick={() => props.modalDayRecap.current?.dismiss()}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle>{moment(props.TransactionsDaySelected.Date).format("DD MMMM YYYY")}</IonTitle>
                        
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    {props.TransactionsDaySelected.map(s=>{
                        return(
                            <ListItem sTransaction={s} User={props.User} loadAllTransactions={()=>{
                                props.loadAllTransactions();
                                props.modalDayRecap.current?.dismiss()
                            }}/>
                        )
                    })}
                </IonContent>
            </IonModal>

        </div>
    )

}