import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";

export default function MiddlewareFullScreen(props){
    return(
        <IonContent>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton mode="md" defaultHref="Dashboard"></IonBackButton>
                    </IonButtons>
                    <IonTitle className="ion-text-center">{props.title}</IonTitle>
                </IonToolbar>
            </IonHeader>
            {props.entity}
        </IonContent>
    )
}