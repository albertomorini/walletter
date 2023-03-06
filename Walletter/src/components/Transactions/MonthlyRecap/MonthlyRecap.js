import {useState, useEffect} from "react";
import { IonGrid, IonRow, IonButton, IonCol, IonIcon, IonItem, IonLabel,IonSegment,IonSegmentButton} from '@ionic/react';
import moment from "moment"

export default function MonthlyRecap(props){
	
	let [TotalIncome,setTotalIncome] = useState();
	let [TotalOutcome,setTotalOutcome] = useState();

	let [ModeSelected,setModeSelected] = useState("Monthly");

	function loadRecap(transactions,Mode="Monthly"){
		let tmpIncome=0;
		let tmpOutcome=0;

		if(Mode=="Monthly"){
			let tmpMonth=moment().format("MM")
			transactions = transactions.filter(s=>{
	          return  moment(s.Date).format("MM") == tmpMonth
	        })
		}

		transactions.forEach(s=>{
			if(s.IsOutcome){
				tmpOutcome+=parseFloat(s.Amount)
			}else{
				tmpIncome+=parseFloat(s.Amount)
			}
		});
		setTotalOutcome(tmpOutcome)
		setTotalIncome(tmpIncome)

	}

	useEffect(()=>{
		loadRecap(props.AllTransactions)
	},[props])

	return(
		<div>
			<IonSegment value={ModeSelected} mode="ios" onClick={(ev)=>{
					loadRecap(props.AllTransactions,ev.target.value)
					setModeSelected(ev.target.value)
				}}>
		        <IonSegmentButton value="Monthly">
		          <IonLabel>Monthly</IonLabel>
		        </IonSegmentButton>
		        <IonSegmentButton value="All">
		          <IonLabel>All time</IonLabel>
		        </IonSegmentButton>
	      	</IonSegment>

			<IonGrid>
				<IonRow className="ion-text-center">
					<IonCol>
						<IonLabel color="success">Income</IonLabel>
						<h2><IonLabel color="success">€{TotalIncome}</IonLabel></h2>
					</IonCol>
					<IonCol>
						<IonLabel color="danger">Outcome</IonLabel>
						<h2><IonLabel color="danger">€{TotalOutcome}</IonLabel></h2>
					</IonCol>
				</IonRow>
			</IonGrid>
		</div>
	);
}