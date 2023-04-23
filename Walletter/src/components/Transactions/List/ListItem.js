
import { IonItem, IonRow, useIonAlert, IonCol, IonGrid, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from "@ionic/react";
import { trash, createOutline } from "ionicons/icons";
import { doRequest, bodyUser } from "../../../ServerTalker";
import moment from "moment";
import { useContext } from "react";
import { MyContext } from "../Dashboard";

export default function ListItem(props){
    const [deleteConfirm] = useIonAlert(); 
    let ctx = useContext(MyContext);
	
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
                    let tmpBody=bodyUser(ctx.User.Email,ctx.User.Password)
                    tmpBody.idTransaction = idTransaction
                    doRequest("deleteTransaction",tmpBody,"POST").then(res=>{
                        ctx.loadAllTransaction()
                        props.closeModal?.current.dismiss(); //if item is opened in a modal, we close the modal on the delete of the item
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
            <IonItemOption color="warning" onClick={()=>{props.editTransaction(props.sTransaction)}} className="buttonList">
                <IonIcon slot="bottom" icon={createOutline}></IonIcon>
                Edit
            </IonItemOption>

            <IonItemOption color="danger" onClick={()=>deleteTransaction(props.sTransaction._id)} expandable className="buttonList">
                <IonIcon slot="bottom" icon={trash}></IonIcon>
                Delete
            </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    );	
}