import React,{ useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { IonLabel, IonSpinner } from '@ionic/react';
 
export default function echarts(props:any){
    let [Canvas,setCanvas] = useState(
        <div className='ion-text-center'>
            <IonLabel>Loading</IonLabel>
            <br/>
            <IonSpinner name="crescent"></IonSpinner>
        </div>
    ); //loading spinner while we wait to render the chatrs
 
    useEffect(()=>{
        setTimeout(() => {
            setCanvas(<ReactECharts option={props.option} />)
        }, 1200); //giving time to the page to be ready to inject the canvas
    },[])
    return(
        <div>
            {Canvas}
        </div>
    );
}
/////////////
<echarts option={mySankey} />
// https://echarts.apache.org/examples/en/editor.html?c=pie-borderRadius