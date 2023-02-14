import { IonList,IonItem, IonRow,useIonAlert, IonCol, IonGrid, IonLabel, IonButton, IonItemSliding, IonItemOptions, IonItemOption, IonIcon} from "@ionic/react";
import { useEffect, useState} from "react";
import "../../theme/ListTransactions.css"
import moment from "moment";
import { SrvDeleteTransaction } from "../ServerTalker";
import { heart,trash, createOutline } from "ionicons/icons";

export default function ListTransactions(props){
    let [transactionList,setTransactionList] = useState([]);
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
                        //TODO: reload list
                    })
                },
              },
            ],
        });
    }
   
    function createList(AllTransactions,Limit){
        let tmp = []
        //header
        tmp.push(
            <IonItem color="light" className="itemList">
                <IonGrid>
                    <IonRow>
                        <IonCol><b>AMOUNT</b></IonCol>
                        <IonCol><b>REFERENCE</b></IonCol>
                        <IonCol><b>DATE</b></IonCol>
                    </IonRow>
                </IonGrid>
            </IonItem>
        )
        AllTransactions = AllTransactions.sort((a, b) => {
            if (a.Date > b.Date) {
                return -1
            } else {
                return 1
            }
        });
        //compute the transactions
        let total = 0;
        for (let i = 0; i < ((Limit == null) ? 10 : Math.min(Limit, AllTransactions.length)); i++) {
            if (AllTransactions[i].IsOutcome) {
                total -= parseFloat(AllTransactions[i].Amount)
                tmp.push(
                    <IonItemSliding>
                        <IonItem color="danger" className="itemList outcomeElement">
                            <IonGrid>

                            <IonRow>
                                <IonCol>-{AllTransactions[i].Amount}€</IonCol>
                                <IonCol>{AllTransactions[i].Reference}</IonCol>
                                <IonCol>{moment(AllTransactions[i].Date).format("DD/MM/YYYY")}</IonCol>
                            </IonRow>
                            </IonGrid>

                        </IonItem>
                        <IonItemOptions>
                        <IonItemOption color="warning">
                            <IonIcon slot="bottom" icon={createOutline}></IonIcon>
                            Edit
                        </IonItemOption>
                        <IonItemOption color="danger" onClick={()=>deleteTransaction(AllTransactions[i]._id)} expandable>
                            <IonIcon slot="bottom" icon={trash}></IonIcon>
                            Delete
                        </IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                )
            } else {
                total += parseFloat(AllTransactions[i].Amount)
                tmp.push(
                    <IonItemSliding>
                        <IonItem color="success" className="itemList incomeElement">
                            <IonGrid>
                                <IonRow>
                                    <IonCol>+{AllTransactions[i].Amount}€</IonCol>
                                    <IonCol>{AllTransactions[i].Reference}</IonCol>
                                    <IonCol>{moment(AllTransactions[i].Date).format("DD/MM/YYYY")}</IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>
                        <IonItemOptions>
                        <IonItemOption color="warning">
                            <IonIcon slot="bottom" icon={createOutline}></IonIcon>
                            Edit
                        </IonItemOption>
                        <IonItemOption color="danger" onClick={()=>deleteTransaction(AllTransactions[i]._id)} expandable >
                            <IonIcon slot="bottom" icon={trash}></IonIcon>
                            Delete
                        </IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                )
            }
        }
        //footer
        tmp.push(
            <IonItem color="dark" className="itemList">
                <IonGrid>
                    <IonRow >
                        <IonCol>Total: </IonCol>
                        <IonCol></IonCol>
                        <IonCol>
                            <IonLabel color={(total > 0) ? "success" : "danger"}>
                                €{total}
                            </IonLabel>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonItem>
        )
        setTransactionList(tmp)
    }
   
    useEffect(()=>{
        console.log("qualcosa è cambiato")
        createList(props.AllTransactions,props.Limit)
    },[props])
    
    return(
        <IonList>
                {transactionList}
        </IonList>
    )
}