import { useEffect, useState, useContext } from "react";
import { IonButtons, IonButton, IonModal, IonHeader, IonSegment, IonSegmentButton, IonContent, IonToolbar, IonTitle, IonItem, IonLabel, IonInput, IonSearchbar, IonList, IonIcon } from '@ionic/react';
import moment from "moment";
import { doRequest, bodyUser } from "../ServerTalker";
import { checkmarkCircleOutline, checkmarkSharp, closeCircle, searchSharp } from "ionicons/icons";
import { MyContext } from "../pages/Home";

//INSERT TRANSACTION MODAL
export default function TransactionModal(props){


    let [Amount, setAmount] = useState(0);
    let [Date, setDate] = useState(moment().format("YYYY-MM-DD"));
    let [IsOutcome, setIsOutcome] = useState(true); //false is an income
    let [Reference, setReference] = useState("");
    //
    let [ExistingReferences,setExistingReferences] = useState([]);
    let [ResResearch,setResResearch] = useState((ExistingReferences!=null)?[...ExistingReferences]:[]);
    let [SearchIcon, setSearchIcon] = useState(searchSharp)
    //
    let ctx = useContext(MyContext);

    function getExistingReferences(){
        doRequest("getExistingReferences",bodyUser(ctx.User.Email,ctx.User.Password)).then(res=>res.json()).then(res=>{
            setExistingReferences(res?.singleReferences);
            setResResearch(res?.singleReferences);
        });
    }

    const searchReferences = (query) =>{
        let results = ExistingReferences?.filter(s=>s.toLowerCase().indexOf(query)>-1);
        if(results.length==0){
            results.push(query) //TODO: optimize, if the query is a substring doesn't show the new element
        }
        setResResearch(results);
    }

    
    function insertTransaction() {
        if(Amount!=0 && Amount!="" && Date!=null && Reference!="" && Reference!=null){
            doRequest("transaction",{
                "Email": ctx.User.Email,
                "Password": ctx.User.Password,
                "Amount": Amount,
                "Date": Date,
                "IsOutcome": (IsOutcome=='false')?false:true,
                "Reference": Reference,
                "id": (props.data?.id!=undefined)?props.data.id : null
            }).then(res=>res.json()).then(res=>{
                ctx.loadAllTransaction()
                props.modalHandler.current?.dismiss()
                cleanInputs();
            });
        }
    }

    function cleanInputs(){
        setAmount((props.data?.Amount==undefined)?0:props.data?.Amount);
        setDate(moment().format("YYYY-MM-DD"));
        setIsOutcome(true);
        setReference();
        getExistingReferences()
    }

    useEffect(()=>{

        /* TODO: for the edit function??
        setAmount(props.data?.Amount);
        setDate(props.data?.Date);
        setIsOutcome(props.data?.IsOutcome);
        setReference(props.data?.Reference);
        */
        getExistingReferences()
    },[props]);


    return (
        <IonModal ref={props.modalHandler} mode="ios">
            <IonHeader mode="ios">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton 
                        color="danger"
                        onClick={() => props.modalHandler.current?.dismiss()}>
                            CANCEL
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Add a transaction</IonTitle>
                    <IonButtons slot="end">
                        <IonButton strong={true} color="success" onClick={() => insertTransaction()}>
                            SAVE
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
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
                        value={Reference}
                        onIonInput={(ev) => {
                            setReference(ev.target.value); 
                            setSearchIcon(searchSharp);
                            searchReferences(ev.target.value)
                        }}
                        mode="ios"
                        placeholder={Reference}
                    />
                    <IonList style={{width: "100%"}}>
                        {ResResearch?.map((result,index) => (
                            <IonItem onClick={()=>{ 
                                setTimeout(() => {
                                    setSearchIcon(checkmarkCircleOutline);
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