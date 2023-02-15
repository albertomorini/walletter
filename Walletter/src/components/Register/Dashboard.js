import { useEffect, useRef, useState } from "react"
import { IonGrid, IonRow, IonButton, IonCol, IonIcon, IonItem, IonLabel} from '@ionic/react';

import { SrvGetAllTransactions } from "../ServerTalker";
import ListTransactions from "./ListTransactions.js"
import MonthlyCalendar from "./MonthlyCalendar.js"
import InsertModal from "./Modals/InsertModal.js"
import TransactionModal from "./Modals/InsertModal";
import { arrowBack } from "ionicons/icons";


export default function Dashboard(props){

    let [AllTransactions,setAllTransactions] = useState([]);
    let [MyView, setMyView] = useState(null);

    function loadAllTransactions(Email, Password) {
        SrvGetAllTransactions(Email, Password).then(res => {
            console.log(res)
            //TODO: fix autorefresh on insert of record
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
                                setMyView(<ListTransactions AllTransactions={AllTransactions} Limit={null}/>)}>Last transactions</IonLabel>
                            </IonItem>
                            <ListTransactions AllTransactions={AllTransactions} Limit={5}/>
                        </IonCol>
                        <IonCol className="ion-text-center">
                            <IonItem className="ion-text-center">
                                <IonLabel onClick={() => setMyView(<MonthlyCalendar AllTransactions={AllTransactions} />)}>Monthly overview</IonLabel>
                            </IonItem>
                            <MonthlyCalendar AllTransactions={AllTransactions} />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>Sankey</IonCol>
                        <IonCol>Andamento </IonCol>
                    </IonRow>
                </IonGrid>
                <InsertModal User={props.User} loadAllTransactions={() => loadAllTransactions()}></InsertModal>
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