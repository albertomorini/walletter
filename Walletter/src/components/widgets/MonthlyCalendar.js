import { IonBackButton, IonButtons, IonContent, IonDatetime, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import moment from 'moment';
import { useEffect, useState, useRef, useContext } from 'react';
import DayTransacionsModal from "./DayTransactionsModal.js"
import "../../theme/MonthlyCalendar.css"
import { MyContext } from "../../pages/Home"


export default function MonthlyCalendar(props){
    
    let [TransactionsDays,setTransactionsDays] = useState([moment().format("YYYY-MM-DD")]);
    let [TransactionsDaySelected,setTransactionsDaySelected] = useState([]);
    let modalDayRecap = useRef();
    let ctx = useContext(MyContext);

    function displayDays(AllTransactions){
        let tmp = AllTransactions.map(s=>moment(s.Date).format("YYYY-MM-DD"))
        setTransactionsDays(tmp);
    }

    function daySelected(CalendarValues){
        if(CalendarValues.length!=ctx.AllTransactions.length){ //trigger the modal just when a date is selected, not if change month
            let daySelected;
            if(CalendarValues.length>ctx.AllTransactions.length){
                daySelected = CalendarValues.filter(s=>!ctx.AllTransactions.map(item =>item.Date).includes(s));
            }else{
                daySelected = ctx.AllTransactions.map(item =>item.Date).filter(s=>!CalendarValues.includes(s));
            }
            daySelected=daySelected.pop(); //remove possibly duplicates and get a single string
            setTransactionsDaySelected(ctx.AllTransactions.filter(s=>( s.Date == daySelected))); //save it
            displayDays(ctx.AllTransactions);
            modalDayRecap.current?.present();
        }
    }
    
    useEffect(()=>{
        displayDays(ctx.AllTransactions)
    },[props,ctx.AllTransactions]);
    
    return(
       
        <>
        <DayTransacionsModal
                TransactionsDaySelected={TransactionsDaySelected}
                modalDayRecap={modalDayRecap}
                />
                
                <IonDatetime
                    className="myCalendar"
                    mode='ios'
                    yearValues={moment().format("YYYY")}
                    presentation="date"
                    size='large'
                    multiple="true"
                    locale='it-IT'
                    firstDayOfWeek={1}
                    preferWheel="false"
                    value={TransactionsDays}
                    onClick={(ev) => daySelected(ev.target.value)}
                />
            
        </>
    )
}