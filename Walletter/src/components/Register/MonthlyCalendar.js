import { IonDatetime } from '@ionic/react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import "../../theme/MonthlyCalendar.css"

export default function MonthlyCalendar(props){
    
    let [TransactionsDays,setTransactionsDays] = useState([moment().format("YYYY-MM-DD")]);

    function displayDays(AllTransactions){
        let tmp=[]
        AllTransactions.forEach(s=>{
            tmp.push(
                moment(s.Date).format("YYYY-MM-DD")
            )
        });
        setTransactionsDays(tmp);
    }
    
    useEffect(()=>{
        displayDays(props.AllTransactions)
    },[props]);
    
    return(
        <>
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
            ></IonDatetime>
        </>
    )
}