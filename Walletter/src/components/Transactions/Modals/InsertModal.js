import { useEffect, useState } from "react"
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
import moment from "moment"
import { SrvGetExistingReferences, SrvSaveTransaction } from "../../ServerTalker";
import {checkmarkCircleOutline,searchSharp} from "ionicons/icons"

export default function TransactionModal(props){

    let [Amount, setAmount] = useState((props.Amount==undefined)?0:props.Amount);
    let [Date, setDate] = useState(moment().format("YYYY-MM-DD"));
    let [IsOutcome, setIsOutcome] = useState(true); //false is an income
    let [Reference, setReference] = useState();
    //
    let [ExistingReferences,setExistingReferences] = useState([]);
    let [ResResearch,setResResearch] = useState([...ExistingReferences]);
    let [SearchIcon, setSearchIcon] = useState(searchSharp)

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

    const searchReferences = (query) =>{
        let results = ExistingReferences.filter(s=>s.toLowerCase().indexOf(query)>-1);
        if(results.length==0){
            results.push(query) //OPT: optimize, if the query is a substring doesn't show the new element
        }
        setResResearch(results);
    }

    
    function insertTransaction() {
        SrvSaveTransaction({
            "Email": props.User.Email,
            "Amount": Amount,
            "Date": Date,
            "IsOutcome": (IsOutcome=='false')?false:true,
            "Reference": Reference,
        }).then(res=>{
            props.loadAllTransactions()
            props.modalInsert.current?.dismiss()
        })
    }
    useEffect(()=>{
        getExistingReferences()
    },[]);


    return (
        <div>
            <IonModal ref={props.modalInsert} trigger="modalInsert" onWillDismiss={(ev) => { }} mode="ios">
                <IonHeader mode="ios">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton id="closeModal" onClick={() => props.modalInsert.current?.dismiss()}>Cancel</IonButton>
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
                        <IonInput type="date" locale="it_IT" value={Date} placeholder={Date} onIonChange={(ev) => setDate(ev.target.value)} mode="ios"></IonInput>
                    </IonItem>
                    <IonItem>

                        <IonSegment value={IsOutcome} onIonChange={(ev) => setIsOutcome(ev.target.value) //this returns a string...
                            } mode="ios">
                            <IonSegmentButton value={true}>
                                <IonLabel color="danger" style={{fontWeight :'bold'}}>Outcome</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value={false} >
                                <IonLabel color="success" style={{fontWeight :'bold'}}>Income</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>

                      
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
            

        </div>
    )
}