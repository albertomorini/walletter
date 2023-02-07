import { IonList,IonItem, IonRow, IonCol, IonGrid, IonLabel} from "@ionic/react";
import { useEffect, useState } from "react";
import "../../theme/ListTransactions.css"
import moment from "moment";

export default function ListTransactions(props){
    let [transactionList,setTransactionList] = useState([]);

    function createList(AllTransactions,Limit){
        let tmp=[]
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
        //order by last ones
        AllTransactions =  AllTransactions.sort((a,b)=>{
            if(a.Date>b.Date){
                return -1
            }else{
                return 1
            }
        });

        //compute the transactions
        let total = 0;
        for (let i = 0; i < ((Limit==null)? 10 : Math.min(Limit,AllTransactions.length) ); i++) {
            if(AllTransactions[i].IsOutcome){
                total -=parseFloat(AllTransactions[i].Amount)
                tmp.push(
                    <IonItem color="danger" className="itemList">
                        <IonGrid>
                            <IonRow>
                                <IonCol>-{AllTransactions[i].Amount}€</IonCol>
                                <IonCol>{AllTransactions[i].Reference}</IonCol>
                                <IonCol>{moment(AllTransactions[i].Date).format("DD/MM/YYYY")}</IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                )
            }else{
                total += parseFloat(AllTransactions[i].Amount)
                tmp.push(
                    <IonItem color="success" className="itemList">
                        <IonGrid>
                            <IonRow>
                                <IonCol>+{AllTransactions[i].Amount}€</IonCol>
                                <IonCol>{AllTransactions[i].Reference}</IonCol>
                                <IonCol>{moment(AllTransactions[i].Date).format("DD/MM/YYYY")}</IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
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
                            <IonLabel color={(total>0)?"success":"danger"}>
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
        console.log(props);
        createList(props.AllTransactions,props.Limit)
    },[props])
    return(
        <IonList>
            {transactionList}
        </IonList>
    )
}