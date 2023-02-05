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
} from '@ionic/react';
import TransactionModal from "./TransactionModal";
import TransactionsWidget from "./TransactionsWidget";
import { SrvGetAllTransactions } from "../ServerTalker";
export default function Dashboard(props){

    let [AllTransactions,setAllTransactions] = useState([]);
   

    function loadAllTransactions(Email, Password) {
        SrvGetAllTransactions(Email, Password).then(res => {
            let tmp = [];
            res.transactions.forEach(s => {
                tmp.push(s)
            })
            setAllTransactions(tmp);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(()=>{
        loadAllTransactions(props.User.Email,props.User.Password);
    },[props])

    return(
        <>
            Welcome back {props.User.Email}
            <TransactionsWidget AllTransactions={AllTransactions} User={props.User}></TransactionsWidget>
        </>
    )
}