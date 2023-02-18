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
      
        console.log(CalendarValues)
        console.log(props.AllTransactions)
        let w = CalendarValues.filter(s=>!props.AllTransactions.includes(s)).concat(props.AllTransactions.filter(x => !CalendarValues.includes(x)))
        console.log(w)



        //displayDays(props.AllTransactions);
        //setTransactionsDays(CalendarValues.pop())
    }
    
    useEffect(()=>{
        displayDays(props.AllTransactions)
    },[props]);
    
    return(
        <>
            <DayTransacionsModal />
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
                onClick={(ev)=>daySelected(ev.target.value)}
            ></IonDatetime>
        </>
    )
}
                //id="MonthlyCalendar"