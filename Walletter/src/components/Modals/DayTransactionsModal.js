import {IonButtons,IonButton,IonModal,IonHeader, IonContent,IonToolbar,IonTitle} from '@ionic/react';
import ListItem from "../Transactions/List/ListItem.js";
import moment from "moment";

export default function DayTransactionsModal(props){
	return (
        <IonModal ref={props.modalDayRecap} trigger="MonthlyCalendar" mode="ios">
            <IonHeader mode="ios">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton id="closeModal" onClick={() => props.modalDayRecap.current?.dismiss()}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>{moment(props.TransactionsDaySelected[0]?.Date).format("DD MMMM YYYY")}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {props.TransactionsDaySelected.map((s,index)=>( //if day selected open the modal with the transaction of that day
                    <ListItem key={"transactionItem" + index} sTransaction={s} closeModal={props.modalDayRecap} />
                ))}
            </IonContent>
        </IonModal>
    );
}