import { IonButtons, IonButton, IonModal, IonHeader, IonContent, IonToolbar, IonTitle, IonIcon } from '@ionic/react';
import ListItem from "./ListItem.js";
import moment from "moment";
import { closeCircle } from 'ionicons/icons';

export default function DayTransactionsModal(props){
	return (
        <IonModal ref={props.modalDayRecap} mode="ios">
            <IonHeader mode="ios">
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonButton id="closeModal"
                            color="dark"
                            onClick={() =>{
                                console.log("OK")
                                props.modalDayRecap.current.dismiss()
                        }}>
                            <IonIcon 
                                color='light'
                                icon={closeCircle}
                                />
                        </IonButton>
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