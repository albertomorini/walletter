import { useEffect, useRef, useState, useContext } from "react"
import { IonGrid, IonRow, IonButton, IonCol, IonIcon, IonItem, IonLabel} from '@ionic/react';
import { arrowBack, chevronForwardOutline } from "ionicons/icons";

import {doRequest,bodyUser} from "../../ServerTalker";

import ListTransactions from "./List/ListTransactions.js"
import MonthlyCalendar from "./Calendar/MonthlyCalendar.js"
import InsertModal from "../Modals/InsertModal.js"
import MonthlyRecap from "./MonthlyRecap/MonthlyRecap.js"

import {MyContext} from "../../pages/Home"

export default function Dashboard(){

    let ctx = useContext(MyContext);
    let [AllTransactions,setAllTransactions] = useState([]);
    let [MyView, setMyView] = useState();
    const refModalInsert = useRef();


    function loadAllTransactions(Email, Password) {
        doRequest("getAllTransaction",bodyUser(Email,Password)).then(res=>res.json()).then(res=>{
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
        loadAllTransactions(ctx.User.User.Email,ctx.User.User.Password);
        if(!ctx.FullScreen.FullScreen){
            //break the loop
            setMyView(ctx.FullScreen.FullScreen)
        }
    },[ctx.FullScreen.FullScreen])

    return(

        <>
        {(!MyView)?
            <div className="Dashboard">
                <IonGrid>
                    <IonRow>
                        <IonCol className="ion-text-center" >
                            <IonItem className="ion-text-center">
                                <IonLabel onClick={() => 
                                        {
                                            setMyView(
                                                <ListTransactions AllTransactions={AllTransactions} 
                                                    Limit={null}
                                                    loadAllTransactions={()=>loadAllTransactions(ctx.User.User.Email,ctx.User.User.Password)}
                                                />)
                                            ctx.FullScreen.setFullScreen(true);
                                        }
                                     }
                                 >
                                        Last transactions
                                        <IonIcon icon={chevronForwardOutline} />
                                    </IonLabel>
                            </IonItem>
                            <ListTransactions AllTransactions={AllTransactions} Limit={5} loadAllTransactions={()=>loadAllTransactions(ctx.User.User.Email,ctx.User.User.Password)}/>
                        </IonCol>


                        <IonCol className="ion-text-center">
                            <IonItem className="ion-text-center" 
                                onClick={() => {
                                    setMyView(<MonthlyCalendar AllTransactions={AllTransactions} loadAllTransactions={()=>loadAllTransactions(ctx.User.User.Email,ctx.User.User.Password)}/>)
                                    ctx.FullScreen.setFullScreen(true);
                                }}
                            >
                                <IonLabel >
                                    Monthly overview
                                    
                                    <IonIcon icon={chevronForwardOutline} />
                                </IonLabel>
                            </IonItem>
                            <MonthlyCalendar AllTransactions={AllTransactions} loadAllTransactions={()=>loadAllTransactions(ctx.User.User.Email,ctx.User.User.Password)}/>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol>
                            <IonItem className="ion-text-center">
                                <IonLabel >Total</IonLabel>
                            </IonItem>
                            <MonthlyRecap AllTransactions={AllTransactions}/>
                        </IonCol>
                        
                    </IonRow>
                </IonGrid>




                <div>
                    <InsertModal loadAllTransactions={() => loadAllTransactions(ctx.User.User.Email,ctx.User.User.Password)} modalInsert={refModalInsert}></InsertModal>
                  
                    <IonButton onClick={()=>{refModalInsert.current?.present()}} expand="block" mode="ios" color="dark">Add a new transaction</IonButton>
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