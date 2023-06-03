import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow, IonToolbar } from "@ionic/react";
import moment from "moment";
import { useContext, useRef, useState } from "react";
import "../../theme/ListTransactions.css";
import ListItem from "./ListItem";
import { MyContext } from "../../pages/Home";
import { arrowBack, arrowForward } from "ionicons/icons";



export default function ListTransactions(props){

    let [MonthSelected, setMonthSelected] = useState(moment().format("MM"))

    let modalEdit = useRef();
    let ctx = useContext(MyContext);

    let [DataInsert,setDataInsert] = useState(
        {
            "id": props.sTransaction?._id,
            "Amount": props.sTransaction?.Amount,
            "IsOutcome": props.sTransaction?.IsOutcome,
            "Date": props.sTransaction?.Date,
            "Reference": props.sTransaction?.Reference
        }
    )

    return(
        <>
        {(props.fullscreen)?//toolbar buttons for months
                <IonToolbar className="ion-text-center">
                    <IonButton
                        color="dark"
                        onClick={() => setMonthSelected(parseInt(MonthSelected) - 1)}
                        disabled={(MonthSelected == 1) ? true : false}
                    >
                        <IonIcon mode="ios" icon={arrowBack} />

                    </IonButton>
                    <IonLabel>{moment(MonthSelected, "MM").format("MMMM")}</IonLabel>
                    <IonButton
                        color="dark"
                        onClick={() => setMonthSelected(parseInt(MonthSelected) + 1)}
                        disabled={(MonthSelected == 12) ? true : false}
                    >
                        <IonIcon mode="ios" icon={arrowForward} />
                    </IonButton>
                </IonToolbar>
        :
        null
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
                    ctx.AllTransactions.filter(s => moment(s.Date).format("MM") == MonthSelected).map((s, index) => {
                        if(index<5 || props.fullscreen){
                            return <ListItem
                            sTransaction={s}
                            key={"itemTransaction" + index}
                            editTransaction={(s) => {
                                modalEdit.current?.present();
                                setDataInsert({
                                    "id": s._id,
                                    "Amount": s.Amount,
                                    "IsOutcome": s?.IsOutcome,
                                    "Date": s?.Date,
                                    "Reference": s?.Reference
                                })
                            }}
                        />
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
        </> 
    );
}
