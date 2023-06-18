
import { useState, useEffect, useContext } from "react";
import { IonGrid, IonRow, IonCol, IonItem, IonLabel, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';
import { MyContext } from "../../pages/Home"

// 4th widget: grouped by reference 
export default function GroupReference(props){

	let [Ranking,setRanking] = useState([])
	let ctx = useContext(MyContext);

	function createRanking(){
		let groupedBy={} //create a dict with the amount of money for reference
		ctx.AllTransactions.forEach(s=>{
			if (isNaN(groupedBy[s.Reference])){
				groupedBy[s.Reference]=0
			}
			if(s.IsOutcome){
				groupedBy[s.Reference]-=parseFloat(s.Amount)
			}else{
				groupedBy[s.Reference]+=parseFloat(s.Amount)
			}
		});

		//create the rank: first the reference with more income/outcome
		setRanking(
			Object.keys(groupedBy).sort((a, b) => Math.abs(groupedBy[a]) > Math.abs(groupedBy[b]) ? -1 : 1).map(s => (
				{
					"reference": s,
					"sum": groupedBy[s]
				}
			))
		);
	}

	useEffect(()=>{
		createRanking()
	}, [ctx.AllTransactions])

	return(
		<>
			<IonGrid>
				<IonRow>
					<IonCol>
						<h3>Reference</h3>
					</IonCol>
					<IonCol>
						<h3>Total</h3>
					</IonCol>
				</IonRow>
				{Ranking.map((s, index) => {
					if (index < 5 || props.fullscreen) { //if fullscreen show all records
						return (
							<IonRow key={"goupItem" + index}>
								<IonItem style={{ width: "100%", borderRadius: '10px' }}>
									<IonCol>
										<b><IonLabel>{s.reference}</IonLabel></b>
									</IonCol>
									<IonCol >
										<b><IonLabel color={(parseFloat(s.sum) > 0) ? "success" : "danger"}>{s.sum}€</IonLabel></b>
									</IonCol>
								</IonItem>
							</IonRow>
						);
					}
				})}
			</IonGrid>
		</>

	);
}