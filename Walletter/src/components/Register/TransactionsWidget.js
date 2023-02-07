import { IonGrid, IonRow,IonCol, IonLabel } from "@ionic/react";
import { useEffect } from "react";
import ListTransactions from "./ListTransactions";
import MonthlyCalendar from "./MonthlyCalendar";
import InsertModal from "./Modals/InsertModal";


export default function TransactionsWidget(props){
    return(
        <div>
            <IonGrid>
                <IonRow>
                    <IonCol className="ion-text-center" onClick={() => console.log("Enter full size mode")}>
                        <IonLabel >Last transactions</IonLabel>
                        <ListTransactions AllTransactions={props.AllTransactions} Limit={10}/>
                    </IonCol>
                    <IonCol className="ion-text-center">
                        <IonLabel onClick={() => console.log("Enter full size mode")}>Monthly overview</IonLabel>
                        <MonthlyCalendar AllTransactions={props.AllTransactions} />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>Sankey</IonCol>
                    <IonCol>Andamento </IonCol>
                </IonRow>
            </IonGrid>
            <InsertModal User={props.User}></InsertModal>

        </div>
    )
}