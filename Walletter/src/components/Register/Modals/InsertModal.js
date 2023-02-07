import { useEffect, useRef, useState } from "react"
import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonToggle,
    IonContent,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonSelectOption,
    IonSelect,
} from '@ionic/react';
import moment from "moment"
import { SrvGetExistingReferences, SrvSaveTransaction } from "../../ServerTalker";


export default function TransactionModal(props){

    let [Amount, setAmount] = useState();
    let [Date, setDate] = useState(moment().format("YYYY-MM-DD"));
    let [IsOutcome, setIsOutcome] = useState(true); //false is an income
    let [Reference, setReference] = useState();
    //
    let [ExistingReferences,setExistingReferences] = useState([]);

    const modal = useRef();
    const sel = useRef();

    function getExistingReferences(search=null){
        SrvGetExistingReferences(props.User.Email,props.User.Password).then(res=>{
            let tmp=[]
            setExistingReferences([])
            res.singleReferences.forEach(s=>{
                if(s.includes(search)){
                    tmp.push(
                        <IonSelectOption value={s}>{s}</IonSelectOption>
                    );
                }else if(search==null || search==" "){ //default
                    tmp.push(
                        <IonSelectOption value={s}>{s}</IonSelectOption>
                    );
                }
            });
            setExistingReferences(tmp);
        })
    }

    function insertTransaction() {
        console.log(props);
        SrvSaveTransaction({
            "Email": props.User.Email,
            "Amount": Amount,
            "Date": Date,
            "IsOutcome": IsOutcome,
            "Reference": Reference,
        }).then(res=>{
            modal.current?.dismiss()
        })
    }
    useEffect(()=>{

        getExistingReferences()
    },[])
    return (
        <div>
            <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => { }} mode="ios">
                
                <IonHeader mode="ios">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton id="closeModal" onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle>Add a transaction</IonTitle>
                        <IonButtons slot="end">
                            <IonButton strong={true} onClick={() => insertTransaction()}>
                                Confirm
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonItem>
                        <IonLabel position="stacked">Amount</IonLabel>
                        <IonInput type="number" min={1} onIonChange={(ev) => setAmount(ev.target.value)} mode="ios"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Date</IonLabel>
                        <IonInput data-date-format="DD MM YYYY" type="date" value={Date} placeholder={Date} onIonChange={(ev) => setDate(ev.target.value)} mode="ios"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Type</IonLabel>
                        <IonToggle enableOnOffLabels={true} slot="end" value={IsOutcome} onIonChange={(ev) => setIsOutcome(!IsOutcome)} mode="ios"></IonToggle>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Reference</IonLabel>
                        <IonInput type="text" 
                            onIonChange={(ev) => {
                                    getExistingReferences(ev.target.value);
                                    setReference(ev.target.value);
                                    //document.getElementById("select").open()
                            }} 
                            mode="ios"
                            placeholder="Reference"
                            value={Reference}
                        />
                                    
                        <IonButton onClick={() => { sel.current.open(); }}>Search</IonButton>

                        <IonSelect ref={sel} interface="popover" id="select" mode="ios" 
                        onIonChange={(ev)=>{
                            document.getElementById("select").style.display = 'none'
                            setReference(ev.target.value)
                        }}>
                            {ExistingReferences}
                        </IonSelect>
                    </IonItem>
                  
                </IonContent>
            </IonModal>
            
            <IonButton id="open-modal">Insert a transaction</IonButton>

        </div>
    )
}