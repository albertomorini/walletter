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
    IonSearchbar,
    IonList,
} from '@ionic/react';
import moment from "moment"
import { SrvGetExistingReferences, SrvSaveTransaction } from "../../ServerTalker";
import {checkmarkCircleOutline,searchSharp} from "ionicons/icons"

export default function TransactionModal(props){

    let [Amount, setAmount] = useState();
    let [Date, setDate] = useState(moment().format("YYYY-MM-DD"));
    let [IsOutcome, setIsOutcome] = useState(true); //false is an income
    let [Reference, setReference] = useState();
    //
    let [ExistingReferences,setExistingReferences] = useState([]);
    let [ResResearch,setResResearch] = useState([...ExistingReferences]);
    let [SearchIcon, setSearchIcon] = useState(searchSharp)


    const modal = useRef();

    function getExistingReferences(){
        SrvGetExistingReferences(props.User.Email,props.User.Password).then(res=>{
            let tmp=[]
            res.singleReferences.forEach(s=>{
                tmp.push(s);
            });
            setExistingReferences(tmp);
            setResResearch(tmp)
        })
    }

    function insertTransaction() {
        SrvSaveTransaction({
            "Email": props.User.Email,
            "Amount": Amount,
            "Date": Date,
            "IsOutcome": IsOutcome,
            "Reference": Reference,
        }).then(res=>{
            props.loadAllTransactions()
            modal.current?.dismiss()
        })
    }
    const searchReferences = (query) =>{
        let results = ExistingReferences.filter(s=>s.toLowerCase().indexOf(query)>-1);
        if(results.length==0){
            results.push(query) //OPT: optimize, if the query is a substring doesn't show the new element
        }
        setResResearch(results);
    }
    useEffect(()=>{
        getExistingReferences()
    },[]);


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
                        <IonSearchbar
                            searchIcon={SearchIcon}
                            onIonChange={(ev) => {
                                setReference(ev.target.value); 
                                setSearchIcon(searchSharp);

                                searchReferences(ev.target.value)
                            }}
                            mode="ios"
                            placeholder="Reference"
                            value={Reference}
                        />
                        <IonList style={{width: "100%"}}>
                            {ResResearch.map(result => (
                                <IonItem onClick={()=>{ 
                                    setTimeout(() => {
                                        setSearchIcon(checkmarkCircleOutline);
                                        setResResearch([]);
                                    }, 400);
                                    setReference(result)
                                }}>{result}</IonItem>
                            ))}
                        </IonList>

                        
                    </IonItem>
                  
                </IonContent>
            </IonModal>
            
            <IonButton id="open-modal" expand="block" mode="ios">Insert a transaction</IonButton>

        </div>
    )
}