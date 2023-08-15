import { useContext, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { IonLabel, IonSpinner } from '@ionic/react';
import { MyContext } from '../../pages/Home';


/// references
// 1) https://echarts.apache.org/examples/en/editor.html?c=sankey-nodeAlign-right
// 2) https://github.com/hustcc/echarts-for-react

export default function Sankey(props) {

     let ctx = useContext(MyContext);
     let [Canvas, setCanvas] = useState(
          <div className='ion-text-center'>
               <IonLabel>Loading</IonLabel>
               <br />
               <IonSpinner name="crescent"></IonSpinner>
          </div>
     ); //loading spinner while we wait to render the chatrs
     
     let mySankey = {
          tooltip: {
               trigger: 'item',
               triggerOn: 'mousemove'
          },
          animation: false,
          series: {
               type: 'sankey',
               layout: 'none',
               emphasis: {
                    focus: 'adjacency'
               },
               lineStyle: {
                    color: 'source',
                    curveness: 0.5
               },
               data: [],
               links: []
          }
     };
     
     function createDataset(){

          let groupedBy = {
               "Earning":0, //"placeholder"
               "Saving":0 //destination for amount don't spent"
          } //create a dict with the amount of money for reference
          ctx.AllTransactions.forEach(s => {
               if (isNaN(groupedBy[s.Reference])) {
                    groupedBy[s.Reference] = 0
               }
               if (s.IsOutcome) {
                    groupedBy[s.Reference] -= parseFloat(s.Amount)
               } else {
                    groupedBy[s.Reference] += parseFloat(s.Amount)
               }
          });

          //DATA (incomes/outcomes)
               mySankey.series.data = Object.keys(groupedBy).map(s=>({"name":s}));

          
          //LINKS

               //incomes
               let tmpLinks =  Object.keys(groupedBy).filter(s=> groupedBy[s]>0).map(s=>({
                    source: s,
                    target: "Earning",
                    value: Math.abs(groupedBy[s])
               }))
               
               //outcomes
               tmpLinks = [...tmpLinks, ...Object.keys(groupedBy).filter(s => groupedBy[s] < 0).map(s => (
                    {
                         source: "Earning",
                         target: s,
                         value: Math.abs(groupedBy[s])
                    }
               ))];

               //CREATE SAVING LINK
               let sumIncome = Object.keys(groupedBy).filter(s=>groupedBy[s]>0).reduce((prev,s)=>prev+parseFloat(groupedBy[s]),0);
               let sumOutcome = Math.abs(Object.keys(groupedBy).filter(s => groupedBy[s] < 0).reduce((prev, s) => prev + parseFloat(groupedBy[s]), 0)); //put in absolute, after we will subtract from the total income

               tmpLinks.push({
                    source: "Earning",
                    target: "Saving",
                    value: Math.abs(parseFloat(sumIncome) - parseFloat(sumOutcome))
               });

               mySankey.series.links = tmpLinks
          

          setTimeout(() => {
               setCanvas(
                    <ReactECharts
                         option={mySankey}
                         lazyUpdate={true}
                         notMerge={true}
                         autoResize={true}
                         label={true}
                    />
               );
          }, 1200); //giving time to the page to be ready to inject the canvas
     }


     useEffect(() => {
          createDataset();
     }, []);
     
     return (
          <div>
               {
                    (props.fullscreen)?
                    <div style={{height:"400px"}}>
                         {Canvas}
                    </div>
                    :
                    <h3>Available only on fullscreen mode, click above</h3>
               }
              
          </div>
     );
}