import { createContext, useEffect, useRef, useState } from "react";
import { IonGrid, IonRow, IonButton, IonCol, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { chevronForwardOutline } from "ionicons/icons";
import { doRequest, bodyUser } from "../../ServerTalker";
import ListTransactions from "./List/ListTransactions.js";
import MonthlyCalendar from "./Calendar/MonthlyCalendar.js";
import InsertModal from "../Modals/TransactionModal.js";
import MonthlyRecap from "./MonthlyRecap/MonthlyRecap.js";
import GroupReference from "./GroupReference/GroupReference";

const MyContext = createContext();

export default function Dashboard(props){

    let [AllTransactions,setAllTransactions] = useState([]);
    let [MyView, setMyView] = useState();
    const refModalInsert = useRef();

    function loadAllTransactions(Email, Password) {
        doRequest("getAllTransaction",bodyUser(Email,Password)).then(res=>res.json()).then(res=>{
            let tmp = res.transactions.map(s =>s).sort((a, b) => { //sort the transaction by date
                if (a.Date > b.Date) {
                    return -1
                } else {
                    return 1
                }
            });
            setAllTransactions(tmp);
        }).catch(err => {
            console.log(err);
        })
    }
    
    useEffect(()=>{
        loadAllTransactions(props.User.Email,props.User.Password);
        if(!props.FullScreen){
            setMyView()
        }
    },[props])

    return(
        <MyContext.Provider value={
            {
                "User": props.User,
                "AllTransactions": AllTransactions,
                "loadAllTransaction": ()=>loadAllTransactions(props.User.Email, props.User.Password)
            }
        }>
            <>
                {(!MyView) ?
                    <div className="Dashboard">
                        <IonGrid>
                            <IonRow>
                                <IonCol className="ion-text-center" >
                                    <IonItem className="ion-text-center">
                                        <IonLabel onClick={() => {
                                            setMyView(<ListTransactions Limit={null}/>)
                                            props.setFullScreen();
                                        }
                                        }
                                        >
                                            Last transactions
                                            <IonIcon icon={chevronForwardOutline} />
                                        </IonLabel>
                                    </IonItem>
                                    <ListTransactions Limit={5} />
                                </IonCol>


                                <IonCol className="ion-text-center">
                                    <IonItem className="ion-text-center"
                                        onClick={() => {
                                            setMyView(<MonthlyCalendar />)
                                            props.setFullScreen();
                                        }}
                                    >
                                        <IonLabel >
                                            Monthly overview
                                            <IonIcon icon={chevronForwardOutline} />
                                        </IonLabel>
                                    </IonItem>
                                    <MonthlyCalendar />
                                </IonCol>
                            </IonRow>

                            <IonRow>
                                <IonCol>
                                    <IonItem className="ion-text-center">
                                        <IonLabel >Total</IonLabel>
                                    </IonItem>
                                    <MonthlyRecap />
                                </IonCol>
                                <IonCol>
                                    <IonItem className="ion-text-center"
                                        onClick={() => {
                                            setMyView(<GroupReference Limit={null} />)
                                            props.setFullScreen();
                                        }}
                                    >
                                        <IonLabel>
                                            Reference summary
                                            <IonIcon icon={chevronForwardOutline} />
                                        </IonLabel>
                                    </IonItem>
                                    <GroupReference Limit={5} />
                                </IonCol>


                            </IonRow>
                        </IonGrid>
                        <div>
                            <InsertModal modalInsert={refModalInsert}></InsertModal>
                            <IonButton onClick={() => { refModalInsert.current?.present() }} expand="block" mode="ios" color="dark">Add new transaction</IonButton>
                        </div>
                    </div>
                    :
                    <div>
                        {MyView}
                    </div>
                }
            </>
        </MyContext.Provider >
    );
}

export { MyContext };
