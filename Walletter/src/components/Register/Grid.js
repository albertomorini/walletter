import { IonGrid } from "@ionic/react";


export default function Grid(props){
    return(
        <div>
            <IonGrid>
                <IonRow>
                    <IonCol>List ultime registrazioni</IonCol>
                    <IonCol>Torta totale</IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>Sankey</IonCol>
                    <IonCol>Andamento </IonCol>
                </IonRow>
            </IonGrid>
        </div>
    )
}