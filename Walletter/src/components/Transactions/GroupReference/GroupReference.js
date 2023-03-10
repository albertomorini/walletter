
import {useState,useEffect} from "react"
import { IonGrid, IonList,IonRow, IonButton, IonCol, IonIcon, IonItem, IonLabel} from '@ionic/react';

export default function GroupReference(props){
	

	let [Ranking,setRanking] = useState([])

	useEffect(()=>{
	    let groupedByR = props.AllTransactions.reduce(function (r, a) {
	        r[a.Reference] = r[a.Reference] || [];
	        r[a.Reference].push(a);
	        return r;
	    }, Object.create(null));

	    let tmp =[]
	    Object.keys(groupedByR).forEach(s=>{
	    	let sum=0;
	    	groupedByR[s].forEach(i=>{
	    		if(i.IsOutcome){
	    			sum-=parseFloat(i.Amount)
	    		}else{
					sum+=parseFloat(i.Amount)
	    		}
	    	})
	    	tmp.push({
	    		"reference":s,
	    		"sum":sum
	    	});
	    })
	    tmp.sort((a,b)=>{
	    	if(Math.abs(a.sum)>Math.abs(b.sum)){
	    		return -1
	    	}else if(Math.abs(a.sum)<Math.abs(b.sum)){
	    		return 1
	    	}else{
	    		return 1
	    	}
	    })
	    setRanking(tmp);

	},[props.AllTransactions])

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
			
				if(props.Limit==null){
					return(
						<IonRow >
							<IonItem style={{width:"100%", borderRadius:'10px'}}>
							<IonCol>
								<b><IonLabel>{s.reference}</IonLabel></b>
							</IonCol>
							<IonCol >
								<b><IonLabel color={(parseFloat(s.sum)>0)?"success":"danger"}>{s.sum}€</IonLabel></b>
							</IonCol>
							</IonItem>
						</IonRow>
					)
				}else if(index<props.Limit){ //Fullscreen
					return(
						<IonRow >
							<IonItem style={{width:"100%", borderRadius:'10px'}}>
							<IonCol>
								<b><IonLabel>{s.reference}</IonLabel></b>
							</IonCol>
							<IonCol >
								<b><IonLabel color={(parseFloat(s.sum)>0)?"success":"danger"}>{s.sum}€</IonLabel></b>
							</IonCol>
							</IonItem>
						</IonRow>
					)
				}
			})}
		</IonGrid>
	);
}