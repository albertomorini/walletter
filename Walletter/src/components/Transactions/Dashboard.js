import { useEffect, useRef, useState } from "react"
import { IonGrid, IonRow, IonButton, IonCol, IonIcon, IonItem, IonLabel} from '@ionic/react';

import { SrvGetAllTransactions } from "../ServerTalker";
import ListTransactions from "./List/ListTransactions.js"
import MonthlyCalendar from "./Calendar/MonthlyCalendar.js"
import InsertModal from "./Modals/InsertModal.js"
import TransactionModal from "./Modals/InsertModal";
import { arrowBack, chevronForwardOutline } from "ionicons/icons";

export default function Dashboard(props){

    let [AllTransactions,setAllTransactions] = useState([]);
    let [MyView, setMyView] = useState(null);

    function loadAllTransactions(Email, Password) {
        SrvGetAllTransactions(Email, Password).then(res => {
            let tmp = [];
            res.transactions.forEach(s => {
                tmp.push(s)
            })
            setAllTransactions(tmp);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(()=>{
        loadAllTransactions(props.User.Email,props.User.Password);
    },[props])

    return(
        <>
        {(MyView==null)?
            <div>
                <IonGrid>
                    <IonRow>
                        <IonCol className="ion-text-center" >
                            <IonItem className="ion-text-center">
                                <IonLabel onClick={() => 
                                setMyView(<ListTransactions AllTransactions={AllTransactions} Limit={null}/>)}>
                                        Last transactions
                                        <IonIcon icon={chevronForwardOutline} />
                                    </IonLabel>
                            </IonItem>
                            <ListTransactions AllTransactions={AllTransactions} Limit={5}/>
                        </IonCol>
                        <IonCol className="ion-text-center">
                            <IonItem className="ion-text-center" onClick={() => setMyView(<MonthlyCalendar AllTransactions={AllTransactions} />)}>
                                <IonLabel >
                                    Monthly overview
                                    <IonIcon icon={chevronForwardOutline} />
                                </IonLabel>
                            </IonItem>
                            <MonthlyCalendar AllTransactions={AllTransactions} />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>Sankey</IonCol>
                        <IonCol>Andamento </IonCol>
                    </IonRow>
                </IonGrid>
                <InsertModal User={props.User} loadAllTransactions={() => loadAllTransactions(props.User.Email,props.User.Password)}></InsertModal>
            </div>
        :
        <>
            <div>
                <IonButton mode="ios" onClick={()=>setMyView(null)} color="dark" size="small">
                    <IonIcon mode="ios" icon={arrowBack} />
                    Back
                </IonButton>
                {MyView}
            </div>
        </>
        }
        </>
    )
}