
import { IonList,IonItem, IonRow,useIonAlert, IonCol, IonGrid, IonLabel, IonButton, IonItemSliding, IonItemOptions, IonItemOption, IonIcon} from "@ionic/react";
import { heart,trash, createOutline } from "ionicons/icons";
import { SrvDeleteTransaction } from "../../ServerTalker";
import moment from "moment";

export default function ListItem(props){
    const [deleteConfirm] = useIonAlert(); 
	
	 function deleteTransaction(idTransaction){
        deleteConfirm({
            header: 'Delete transaction',
            message: "Confirm the deletion?",
            mode: "ios",
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
              },
              {
                text: 'OK',
                role: 'confirm',
                handler: () => {
                    SrvDeleteTransaction(idTransaction).then(res=>{
                        props.loadAllTransactions()
                    }).catch(err=>{
                        console.log(err)
                    })
                },
              },
            ],
        });
    }

	return(
		<IonItemSliding>
            <IonItem color={(props.sTransaction.IsOutcome)?"danger":"success"} className="itemList outcomeElement">
                <IonGrid>
                <IonRow>
                    <IonCol>
                    {(props.sTransaction.IsOutcome)?"-":"+"}
                    {props.sTransaction.Amount}€
                    </IonCol>
                    <IonCol>{props.sTransaction.Reference}</IonCol>
                    <IonCol>{moment(props.sTransaction.Date).format("DD/MM/YYYY")}</IonCol>
                </IonRow>
                </IonGrid>

            </IonItem>
            <IonItemOptions>
            <IonItemOption color="warning">
                <IonIcon slot="bottom" icon={createOutline}></IonIcon>
                Edit
            </IonItemOption>
            <IonItemOption color="danger" onClick={()=>deleteTransaction(props.sTransaction._id)} expandable>
                <IonIcon slot="bottom" icon={trash}></IonIcon>
                Delete
            </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    );	
}