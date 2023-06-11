import { useRef } from "react";
import { IonGrid, IonRow, IonButton, IonCol, IonIcon, IonNavLink, IonContent } from '@ionic/react';
import { chevronForwardOutline } from "ionicons/icons";
import ListTransactions from "./widgets/ListTransactions.js";
import MonthlyCalendar from "./widgets/MonthlyCalendar.js";
import GroupReference from "./widgets/GroupReference";
import MonthlyRecap from "./widgets/MonthlyRecap.js";
import MiddlewareFullScreen from "./MiddlewareFullScreen.js";
import TransactionModal from "./TransactionModal.js";


export default function Dashboard(props){

    const refModalInsert = useRef(); //refere   nces the insert modal (for closing programmatically)
    return(
            <IonContent className="Dashboard" fullscreen={true}>
                <IonGrid>
                    <IonRow>
                        <IonCol className="ion-text-center ion-padding" >
                            <IonNavLink routerDirection="forward" component={() => <MiddlewareFullScreen entity={<ListTransactions fullscreen={true} />} title ="List transaction" />} >
                            <IonButton color={"dark"} expand="block">Last transactions
                                    <IonIcon icon={chevronForwardOutline} />
                                </IonButton>
                            </IonNavLink>
                            <ListTransactions fullscreen={false} />
                        </IonCol>


                        <IonCol className="ion-text-center ion-padding">
                            <IonNavLink routerDirection="forward" component={() => 
                                <MiddlewareFullScreen entity={<MonthlyCalendar/>} title="Monthly calendar"/>
                            } >
                                <IonButton color={"dark"} expand="block">Monthly Calendar
                                    <IonIcon icon={chevronForwardOutline} />
                                </IonButton>
                            </IonNavLink>
                            <MonthlyCalendar  />
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol className="ion-text-center ion-padding">
                            <IonContent>

                            <IonNavLink routerDirection="forward"  >
                            <IonButton color={"dark"} expand="block">Monthly recap
                                    <IonIcon icon={chevronForwardOutline} />
                                </IonButton>
                            </IonNavLink>
                            <MonthlyRecap />
                            </IonContent>
                        </IonCol>
                        <IonCol className="ion-padding">
                        <IonNavLink routerDirection="forward" component={() => <MiddlewareFullScreen entity={<GroupReference fullscreen={true} title="Monthly calendar" />} />} >
                            <IonButton color={"dark"} expand="block">Group reference
                                    <IonIcon icon={chevronForwardOutline} />
                                </IonButton>
                            </IonNavLink>
                            <GroupReference fullscreen={false} />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>

                        <IonNavLink routerDirection="forward" component={() => <MiddlewareFullScreen entity={<TransactionModal fullscreen={true} title="Add a new transaction" />} />} >
                            <IonButton color={"dark"} expand="block">Insert new transaction
                                <IonIcon icon={chevronForwardOutline} />
                            </IonButton>
                        </IonNavLink>

                        </IonCol>
                    </IonRow>
                </IonGrid>
        </IonContent>
    );
}

