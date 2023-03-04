import React,{ useEffect, useRef, useState } from "react"
import { IonGrid, IonRow, IonButton, IonCol, IonIcon, IonItem, IonLabel} from '@ionic/react';

import { SrvGetAllTransactions } from "../../ServerTalker";
import ListTransactions from "./List/ListTransactions.js"
import MonthlyCalendar from "./Calendar/MonthlyCalendar.js"
import InsertModal from "./Modals/InsertModal.js"
import TransactionModal from "./Modals/InsertModal";
import Sankey from "./Sankey/Sankey.js"
import MyPie from "./Pie/Pie.js"
import { arrowBack, chevronForwardOutline } from "ionicons/icons";


export default function Dashboard(props){

    let [AllTransactions,setAllTransactions] = useState([]);
    let [MyView, setMyView] = useState(props.FullScreen);
    const refModalInsert = useRef();


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
        {(!MyView)?
            <div>
                <IonGrid>
                    <IonRow>
                        <IonCol className="ion-text-center" >
                            <IonItem className="ion-text-center">
                                <IonLabel onClick={() => 
                                        {
                                            setMyView(
                                                <ListTransactions AllTransactions={AllTransactions} Limit={null} loadAllTransactions={()=>loadAllTransactions(props.User.Email,props.User.Password)}/>)
                                            props.setFullScreen();
                                        }

                                     }
                                 >
                                        Last transactions
                                        <IonIcon icon={chevronForwardOutline} />
                                    </IonLabel>
                            </IonItem>
                            <ListTransactions AllTransactions={AllTransactions} Limit={5} User={props.User} loadAllTransactions={()=>loadAllTransactions(props.User.Email,props.User.Password)}/>
                        </IonCol>
                        <IonCol className="ion-text-center">
                            <IonItem className="ion-text-center" onClick={() => setMyView(<MonthlyCalendar AllTransactions={AllTransactions} User={props.User} loadAllTransactions={()=>loadAllTransactions(props.User.Email,props.User.Password)}/>)}>
                                <IonLabel >
                                    Monthly overview
                                    <IonIcon icon={chevronForwardOutline} />
                                </IonLabel>
                            </IonItem>
                            <MonthlyCalendar AllTransactions={AllTransactions} User={props.User} loadAllTransactions={()=>loadAllTransactions(props.User.Email,props.User.Password)}/>
                        </IonCol>
                    </IonRow>
                </IonGrid>


                <div>
                    <InsertModal User={props.User} loadAllTransactions={() => loadAllTransactions(props.User.Email,props.User.Password)} modalInsert={refModalInsert}></InsertModal>
                  
                    <IonButton onClick={()=>{refModalInsert.current?.present()}} expand="block" mode="ios">Insert a transaction</IonButton>
                </div>
            </div>
        :
        <>
            <div>
                {MyView}
            </div>
        </>
        }
        </>

    )
}