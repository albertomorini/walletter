import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow } from "@ionic/react";
import { arrowBack, arrowForward } from "ionicons/icons";
import moment from "moment";
import { useContext, useRef, useState } from "react";
import "../../../theme/ListTransactions.css";
import ListItem from "./ListItem.js";
import InsertModal from "../../Modals/TransactionModal"
import { MyContext } from "../Dashboard"



export default function ListTransactions(props){

    let [MonthSelected, setMonthSelected] = useState(moment().format("MM"))

    let modalEdit = useRef();
    let ctx = useContext(MyContext);


    return(
        
        <div>
            <InsertModal modalInsert={modalEdit}
                data={
                    {
                        "id": props.sTransaction?._id,
                        "Amount": props.sTransaction?.Amount,
                        "IsOutcome": props.sTransaction?.IsOutcome,
                        "Date": props.sTransaction?.Date,
                        "Reference": props.sTransaction?.Reference
                    }
                }
            />

            {(props.Limit==null)?
                <div className="ion-text-center">
                    <IonButton 
                        color="dark"
                        onClick={()=>setMonthSelected(parseInt(MonthSelected)-1)}
                        disabled={(MonthSelected==1)?true:false}
                    >
                        <IonIcon mode="ios" icon={arrowBack} />

                    </IonButton>
                    <IonLabel>{moment(MonthSelected,"MM").format("MMMM")}</IonLabel>
                    <IonButton 
                        color="dark"
                        onClick={()=>setMonthSelected(parseInt(MonthSelected)+1)}
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
                {
                    ctx.AllTransactions.filter(s=> moment(s.Date).format("MM")==MonthSelected ).map((s,index)=>{
                        if(props.Limit==null || index<props.Limit){
                            return <ListItem sTransaction={s} key={"itemTransaction"+index}/>
                        }
                    })
                }
                <IonItem color="dark" className="itemList">
                    <IonGrid>
                        <IonRow >
                            <IonCol>Earning: </IonCol>
                            <IonCol></IonCol>
                            <IonCol>
                                <IonLabel color={(0 > 0) ? "success" : "danger"}>
                                    €{
                                    ctx.AllTransactions.filter(s => moment(s.Date).format("MM") == MonthSelected).reduce((partialSum, a) => partialSum + parseFloat(a.Amount) * ((a.IsOutcome) ? -1 : 1), 0)
                                    }
                                </IonLabel>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonItem>
            </IonList>
        </div>
    )
}