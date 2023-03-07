import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonToggle,
    IonSegment,
    IonSegmentButton,
    IonContent,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonSelectOption,
    IonSelect,
    IonSearchbar,
    IonList,
} from '@ionic/react';


export default function UploadModal(props){
	return(
		<IonModal ref={props.modalUpload} trigger="modalUpload" mode="ios">
                <IonHeader mode="ios">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton id="closeModal" onClick={() => props.modalUpload.current?.dismiss()}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle>Add a transaction</IonTitle>
                        <IonButtons slot="end">
                            <IonButton strong={true} onClick={() => props.doUpload()}>
                                Confirm
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <div>
                    	<input type="file" />
                    </div>
                    <IonButton expand="block" onClick={()=>props.doUpload()}>Upload</IonButton>
                </IonContent>
            </IonModal>
            
	);
}