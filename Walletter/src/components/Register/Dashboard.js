import { useEffect, useRef, useState } from "react"
import { IonGrid, IonRow, IonCol, IonItem, IonLabel} from '@ionic/react';

import { SrvGetAllTransactions } from "../ServerTalker";
import ListTransactions from "./ListTransactions.js"
import MonthlyCalendar from "./MonthlyCalendar.js"
import InsertModal from "./Modals/InsertModal.js"
import TransactionModal from "./Modals/InsertModal";


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
                                setMyView(<ListTransactions AllTransactions={AllTransactions} Limit={AllTransactions.length}/>)}>Last transactions</IonLabel>
                            </IonItem>
                            <ListTransactions AllTransactions={AllTransactions} Limit={10}/>
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
            {MyView}
        </>
        }
        </>
    )
}