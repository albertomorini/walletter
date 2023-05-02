import { useEffect, useState, useContext } from "react";
import {IonButtons,IonButton,IonModal,IonHeader, IonSegment,IonSegmentButton,IonContent,IonToolbar,IonTitle,IonItem,IonLabel,    IonInput, IonSearchbar,IonList} from '@ionic/react';
import moment from "moment";
import { doRequest, bodyUser } from "../../ServerTalker";
import { checkmarkCircleOutline, searchSharp } from "ionicons/icons";
import { MyContext } from "../Transactions/Dashboard"


//INSERT TRANSACTION MODAL
export default function TransactionModal(props){


    let [Amount, setAmount] = useState(0);
    let [Date, setDate] = useState(moment().format("YYYY-MM-DD"));
    let [IsOutcome, setIsOutcome] = useState(true); //false is an income
    let [Reference, setReference] = useState("");
    //
    let [ExistingReferences,setExistingReferences] = useState([]);
    let [ResResearch,setResResearch] = useState([...ExistingReferences]);
    let [SearchIcon, setSearchIcon] = useState(searchSharp)
    //
    let ctx = useContext(MyContext);

    function getExistingReferences(){
        doRequest("getExistingReferences",bodyUser(ctx.User.Email,ctx.User.Password)).then(res=>res.json()).then(res=>{
            let tmp= res.singleReferences.map(s=>s);
            setExistingReferences(tmp);
            setResResearch(tmp)
        });
    }

    const searchReferences = (query) =>{
        let results = ExistingReferences.filter(s=>s.toLowerCase().indexOf(query)>-1);
        if(results.length==0){
            results.push(query) //TODO: optimize, if the query is a substring doesn't show the new element
        }
        setResResearch(results);
    }

    
    function insertTransaction() {
        doRequest("transaction",{
            "Email": ctx.User.Email,
            "Amount": Amount,
            "Date": Date,
            "IsOutcome": (IsOutcome=='false')?false:true,
            "Reference": Reference,
            "id": (props.data?.id!=undefined)?props.data.id : null
        }).then(res=>res.json()).then(res=>{
            ctx.loadAllTransaction()
            props.modalInsert.current?.dismiss()
            resetInput();
        })
    }

    function resetInput(){
        setAmount((props.data?.Amount==undefined)?0:props.data?.Amount);
        setDate(moment().format("YYYY-MM-DD"));
        setIsOutcome(true);
        setReference();
        getExistingReferences()
    }

    useEffect(()=>{
        setAmount(props.data?.Amount);
        setDate(props.data?.Date);
        setIsOutcome(props.data?.IsOutcome);
        setReference(props.data?.Reference);
        getExistingReferences()
    },[props]);


    return (
        <IonModal ref={props.modalInsert} trigger="modalInsert" mode="ios">
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
                    <IonInput type="number" min={1} placeholder={Amount} onIonInput={(ev) => setAmount(ev.target.value)} mode="ios"></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Date</IonLabel>
                    <IonInput type="date" locale="it_IT" value={Date} placeholder={Date} onIonInput={(ev) => setDate(ev.target.value)} mode="ios"></IonInput>
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
                        onIonInput={(ev) => {
                            setReference(ev.target.value); 
                            setSearchIcon(searchSharp);

                            searchReferences(ev.target.value)
                        }}
                        mode="ios"
                        placeholder={Reference}

                    />
                    <IonList style={{width: "100%"}}>
                        {ResResearch.map((result,index) => (
                            <IonItem onClick={()=>{ 
                                setTimeout(() => {
                                    setSearchIcon(checkmarkCircleOutline);
                                    setResResearch([]);
                                }, 400);
                                setReference(result)
                            }}
                            key={"referenceItem"+index}
                            >{result}</IonItem>
                        ))}
                    </IonList>
                </IonItem>
            </IonContent>
        </IonModal>
    )
}