
import { IonLabel, IonItem, IonPopover, IonSegment, IonSegmentButton, IonInput, IonCardSubtitle, IonButton } from "@ionic/react";
import {SrvDoExport} from "../../ServerTalker.js"
import moment from "moment";
import {MyContext} from '../../pages/Home';
import {useContext} from "react"
import { Storage } from '@ionic/storage';

export default function MenuProfile(props){

  let ctx = useContext(MyContext);
  let store = new Storage();

  function unstoreCredentials(){
      store.create();
      store.set("User",null);
      ctx.User.setUser(null)
  }

	return(
		<IonPopover trigger="AccountIcon" triggerAction="click">
           
            <IonButton color="medium" size="small" onClick={()=>{
                SrvDoExport(ctx.User.User.Email,ctx.User.User.Password).then(blob=>{

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
            <IonButton color="danger" size="small" onClick={()=>unstoreCredentials()}>
              Log out
            </IonButton>
          </IonPopover>
    );	
}