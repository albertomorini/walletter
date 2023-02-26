
import { IonLabel, IonItem, IonPopover, IonSegment, IonSegmentButton, IonInput, IonCardSubtitle, IonButton } from "@ionic/react";
import {SrvDoExport} from "../../ServerTalker.js"
import moment from "moment";



export default function MenuProfile(props){
	return(
		<IonPopover trigger="AccountIcon" triggerAction="click">
           
            <IonButton color="medium" size="small" onClick={()=>{
                SrvDoExport("a@a","a").then(blob=>{
                  console.log(blob.data)

                   var url = window.URL.createObjectURL(blob);
                  var a = document.createElement('a');
                  a.href = url;

                  a.download = "WalletterExport_"+moment().format("YYYY-MM-DD")+".json";
                  document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                  a.click();    
                  a.remove();

                })
              }}>
              Export
            </IonButton>

            <IonButton color="warning" size="small" onClick={()=>console.log("TODO:")}>
              Edit
            </IonButton>
            <IonButton color="danger" size="small" onClick={()=>props.setUser(null)}>
              Log out
            </IonButton>
          </IonPopover>
    );	
}