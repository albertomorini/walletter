import { IonList,IonItem, IonRow,useIonAlert, IonCol, IonGrid, IonLabel, IonButton, IonItemSliding, IonItemOptions, IonItemOption, IonIcon} from "@ionic/react";
import { useEffect, useState} from "react";
import "../../../theme/ListTransactions.css"
import moment from "moment";
import ListItem from "./ListItem.js"
import { arrowBack,arrowForward } from "ionicons/icons";


export default function ListTransactions(props){
    let [transactionList,setTransactionList] = useState([]);
    let [MonthSelected,setMonthSelected] = useState(moment().format("MM"))

    function createMonthList(AllTransactions,Limit,Month=moment().format("MM")){
        let tmp = []
        //sorting the transastion
        AllTransactions = AllTransactions.sort((a, b) => {
            if (a.Date > b.Date) {
                return -1
            } else {
                return 1
            }
        });

        AllTransactions = AllTransactions.filter(s=>{
          return  moment(s.Date).format("MM") == Month
        })
        
        let monthTotal=0;
        AllTransactions.forEach(s=>{
            if(s.IsOutcome){
                monthTotal-=parseFloat(s.Amount);
            }else{
                monthTotal+=parseFloat(s.Amount);
            }
        });


        AllTransactions.forEach(s=>{
            if(Limit==null || AllTransactions.indexOf(s)<Limit){
                tmp.push(
                    <ListItem sTransaction={s} loadAllTransactions={()=>props.loadAllTransactions()} User={props.User}/>
                );
            }
        })

        //footer
        tmp.push(
            <IonItem color="dark" className="itemList">
                <IonGrid>
                    <IonRow >
                        <IonCol>Total: </IonCol>
                        <IonCol></IonCol>
                        <IonCol>
                            <IonLabel color={(monthTotal > 0) ? "success" : "danger"}>
                                €{monthTotal}
                            </IonLabel>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonItem>
        )
        setTransactionList(tmp)
    }
   
    useEffect(()=>{
        createMonthList(props.AllTransactions,props.Limit)
    },[props])
    
    return(
        <div>
            {(props.Limit==null)?
                <div className="ion-text-center">
                    <IonButton 
                        color="dark"
                        onClick={()=>{
                            setMonthSelected(parseInt(MonthSelected)-1);
                            createMonthList(props.AllTransactions,props.Limit,(moment(MonthSelected,"MM").subtract(1,'months').format("MM")))
                        }}
                        disabled={(MonthSelected==1)?true:false}
                    >
                        <IonIcon mode="ios" icon={arrowBack} />

                    </IonButton>
                    <IonLabel>{moment(MonthSelected,"MM").format("MMMM")}</IonLabel>
                    <IonButton 
                        color="dark"
                        onClick={()=>{
                            setMonthSelected(parseInt(MonthSelected)+1);
                            createMonthList(props.AllTransactions,props.Limit,(moment(MonthSelected,"MM").add(1,'months').format("MM")))
                        }}
                        disabled={(MonthSelected==12)?true:false}
                    >
                        <IonIcon mode="ios" icon={arrowForward} />
                    </IonButton>
                </div>
            :
            ""
            }

            <IonList>
                <IonItem color="light" className="itemList">
                    <IonGrid>
                        <IonRow>
                            <IonCol><b>AMOUNT</b></IonCol>
                            <IonCol><b>REFERENCE</b></IonCol>
                            <IonCol><b>DATE</b></IonCol>
                        </IonRow>
                    </IonGrid>
                </IonItem>

                {transactionList}
            </IonList>
        </div>
    )
}