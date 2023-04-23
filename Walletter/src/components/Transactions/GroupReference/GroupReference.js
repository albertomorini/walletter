
import { useState, useEffect, useContext } from "react";
import { IonGrid, IonRow, IonCol, IonItem, IonLabel } from '@ionic/react';
import { MyContext } from "../Dashboard"


// 4th widget: grouped by reference 
export default function GroupReference(props){

	let [Ranking,setRanking] = useState([])
	let ctx = useContext(MyContext);


	useEffect(()=>{
		let groupedBy={}
		ctx.AllTransactions.forEach(s=>{
			if (isNaN(groupedBy[s.Reference])){
				groupedBy[s.Reference]=0
			}
			if(s.IsOutcome){
				groupedBy[s.Reference]-=parseFloat(s.Amount)
			}else{
				groupedBy[s.Reference]+=parseFloat(s.Amount)
			}
		})
		
		setRanking(

			Object.keys(groupedBy).sort((a,b)=>{ //sort the groupedBy dictionary
				if(Math.abs(groupedBy[a])>Math.abs(groupedBy[b])){
					return -1;
				} else if (Math.abs(groupedBy[a]) < Math.abs(groupedBy[b])){
					return 1;
				}
				return 0
			}).map(s=>{ //return a well formed array of object 
				return {
					"reference": s,
					"sum": groupedBy[s]
				}
			})
		)

	}, [ctx.AllTransactions])

	return(
		<IonGrid>
			<IonRow>
				<IonCol>
					<h3>Reference</h3>
				</IonCol>
				<IonCol>
					<h3>Total</h3>
				</IonCol>
			</IonRow>
			{Ranking.map((s,index)=>{
				if((props.Limit!=null && index<props.Limit) || props.Limit==null){ //if limit!=null we're in preview, otherwhise fullscreen
					return(
						<IonRow key={"goupItem"+index}>
							<IonItem style={{width:"100%", borderRadius:'10px'}}>
							<IonCol>
								<b><IonLabel>{s.reference}</IonLabel></b>
							</IonCol>
							<IonCol >
								<b><IonLabel color={(parseFloat(s.sum)>0)?"success":"danger"}>{s.sum}€</IonLabel></b>
							</IonCol>
							</IonItem>
						</IonRow>
					);
				}
			})}
		</IonGrid>
	);
}