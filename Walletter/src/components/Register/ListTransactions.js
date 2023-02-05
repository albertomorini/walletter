import { IonList,IonItem, IonRow, IonCol, IonGrid} from "@ionic/react";
import { useEffect, useState } from "react";
import { SrvGetAllTransactions } from "../ServerTalker";
import "../../theme/ListTransactions.css"
import moment from "moment";

export default function ListTransactions(props){
    let [transactionList,setTransactionList] = useState([]);

    function createList(AllTransactions){
        let tmp=[]
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
        AllTransactions =  AllTransactions.sort((a,b)=>{
            if(a.Date>b.Date){
                return -1
            }else{
                return 1
            }
            return 0
        })
        //TODO: limit to 10 + resume at the end
        AllTransactions.forEach(s => {
            if(s.IsOutcome){ //red
                tmp.push(
                    <IonItem color="danger" className="itemList">
                        <IonGrid>
                            <IonRow>
                                <IonCol>-{s.Amount}€</IonCol>
                                <IonCol>{s.Reference}</IonCol>
                                <IonCol>{moment(s.Date).format("DD/MM/YYYY")}</IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                )
            }else{ //green
                tmp.push(
                    <IonItem color="success" className="itemList">
                        <IonGrid>
                            <IonRow color="green">
                                <IonCol>+{s.Amount}€</IonCol>
                                <IonCol>{s.Reference}</IonCol>
                                <IonCol>{moment(s.Date).format("DD/MM/YYYY")}</IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                )
            }
        });
        setTransactionList(tmp)
    }
   
    useEffect(()=>{
        createList(props.AllTransactions)
    },[props])
    return(
        <IonList>
            {transactionList}
        </IonList>
    )
}