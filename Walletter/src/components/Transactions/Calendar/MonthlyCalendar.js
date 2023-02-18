import { IonDatetime } from '@ionic/react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import "../../../theme/MonthlyCalendar.css"
import DayTransacionsModal from "../Modals/DayTransactionsModal.js"

export default function MonthlyCalendar(props){
    
    let [TransactionsDays,setTransactionsDays] = useState([moment().format("YYYY-MM-DD")]);
    let [TransactionsDaySelected,setTransactionsDaySelected] = useState([]);

    function displayDays(AllTransactions){
        let tmp=[]
        AllTransactions.forEach(s=>{
            tmp.push(
                moment(s.Date).format("YYYY-MM-DD")
            )
        });
        setTransactionsDays(tmp);
    }

    function daySelected(CalendarValues){

        let daySelected;
        if(CalendarValues.length>props.AllTransactions.length){
            daySelected = CalendarValues.filter(s=>!props.AllTransactions.map(item =>item.Date).includes(s));
        }else{
            daySelected = props.AllTransactions.map(item =>item.Date).filter(s=>!CalendarValues.includes(s));
        }
        daySelected=daySelected.pop(); //remove possibly duplicates and get a single string
        setTransactionsDaySelected(props.AllTransactions.filter(s=>( s.Date == daySelected))); //save it

        displayDays(props.AllTransactions);
    }
    
    useEffect(()=>{
        displayDays(props.AllTransactions)
    },[props]);
    
    return(
        <>
            <DayTransacionsModal TransactionsDaySelected={TransactionsDaySelected}/>
            <IonDatetime 
                className='myCalendar'
                mode='ios'
                presentation="date"
                size='large'
                multiple="true"
                locale='it-IT'
                firstDayOfWeek={1}
                preferWheel="false"
                value={TransactionsDays}
                id="MonthlyCalendar"
                onClick={(ev)=>daySelected(ev.target.value)}
            ></IonDatetime>
        </>
    )
}