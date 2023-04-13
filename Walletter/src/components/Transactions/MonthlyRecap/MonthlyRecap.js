import { useState } from "react";
import { IonGrid, IonRow, IonCol, IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import moment from "moment";

export default function MonthlyRecap(props){
	
	let [Monthly, setMonthly] = useState(true);

	return(
		<>
			<IonSegment value={Monthly} mode="ios" onClick={(ev)=>setMonthly(ev.target.value === 'true')}>
		        <IonSegmentButton value={true}>
		          <IonLabel>Monthly</IonLabel>
		        </IonSegmentButton>
		        <IonSegmentButton value={false}>
		          <IonLabel>All year</IonLabel>
		        </IonSegmentButton>
	      	</IonSegment>

			<IonGrid>
				<IonRow className="ion-text-center">
					<IonCol>
						<IonLabel color="success">Income</IonLabel>
						<h2>
							<IonLabel color="success">{
								props.AllTransactions.filter(s => {
									if (Monthly) {
										return moment(s.Date).format("MMYY") == moment().format("MMYY")
									} else {
										return moment(s.Date).format("YY") == moment().format("YY")
									}
								}).reduce((partialSum, a) => partialSum + ((a.IsOutcome) ? 0 : parseFloat(a.Amount)), 0)
							}€
							</IonLabel>
						</h2>
					</IonCol>
					<IonCol>
						<IonLabel color="danger">Outcome</IonLabel>
						<h2>
							<IonLabel color="danger">{
								props.AllTransactions.filter(s => {
									if (Monthly) {
										return moment(s.Date).format("MMYY") == moment().format("MMYY")
									} else {
										return moment(s.Date).format("YY") == moment().format("YY")
									}
								}).reduce((partialSum, a) => partialSum - ((a.IsOutcome) ? parseFloat(a.Amount) : 0), 0)
							}€
							</IonLabel>
						</h2>
					</IonCol>
				</IonRow>
			</IonGrid>
		</>
	);
}