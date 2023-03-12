
import { IonList,IonItem, IonRow,useIonAlert, IonCol, IonGrid, IonLabel, IonButton, IonItemSliding, IonItemOptions, IonItemOption, IonIcon} from "@ionic/react";
import { heart,trash, createOutline } from "ionicons/icons";
import {doRequest,bodyUser} from "../../../ServerTalker";
import moment from "moment";
import InsertModal from "../../Modals/InsertModal.js"
import {useState,useRef,useContext} from "react"
import {MyContext} from "../../../pages/Home"

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
                    let tmpBody=bodyUser(ctx.User.User.Email,ctx.User.User.Password)
                    tmpBody.idTransaction = idTransaction
                    doRequest("deleteTransaction",tmpBody,"POST").then(res=>{
                        props.loadAllTransactions()
                    }).catch(err=>{
                        console.log(err)
                    })
                },
              },
            ],
        });
    }

    let [Amount,setAmount]=useState()
    let modalEdit = useRef()

	return(
        <div>
            <InsertModal User={props.User} loadAllTransactions={props.loadAllTransactions} Amount={Amount} modalInsert={modalEdit}
                data={
                    {
                        "id": props.sTransaction._id,
                        "Amount":props.sTransaction.Amount,
                        "IsOutcome": props.sTransaction.IsOutcome,
                        "Date":props.sTransaction.Date,
                        "Reference": props.sTransaction.Reference
                    }
                }
            />

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
                <IonItemOption color="warning" onClick={()=>{
                    modalEdit.current?.present();
                    setAmount(props.sTransaction.Amount)
                }}
                className="buttonList"
                >
                    <IonIcon slot="bottom" icon={createOutline}></IonIcon>
                    Edit
                </IonItemOption>
                <IonItemOption color="danger" 
                    onClick={()=>deleteTransaction(props.sTransaction._id)
                    }
                    expandable
                 
                    className="buttonList"
                 >
                    <IonIcon slot="bottom" icon={trash}></IonIcon>
                    Delete
                </IonItemOption>
                </IonItemOptions>
            </IonItemSliding>
        </div>
    );	
}