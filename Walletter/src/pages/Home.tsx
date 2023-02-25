import { IonContent, IonHeader, IonIcon, IonPopover, IonButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import Dashboard from '../components/Transactions/Dashboard';
import Login from "../components/UserProfile/Login"
import './Home.css';
import { personCircleSharp } from 'ionicons/icons';
import {SrvDoExport} from "../components/ServerTalker.js"
import moment from "moment";


const Home: React.FC = () => {

  let [OkAuth, setOkAuth] = useState(true); //TODO: put false in depl
  let [User, setUser] = useState(null);
  
  return (
    <IonPage>
      <IonHeader mode='ios'>
        <IonToolbar>
          <IonTitle>Walletter</IonTitle>
          <IonIcon icon={personCircleSharp} id="AccountIcon" size="large" style={{float: "right",marginRight:'5px'}}/>
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
            <IonButton color="danger" size="small" onClick={()=>setUser(null)}>
              Log out
            </IonButton>
          </IonPopover>

        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        
      {(!OkAuth) ? <Login okAuth={() => setOkAuth(true)} setUser={(ev:any)=>setUser(ev)}/> : <Dashboard User={{"Email":"a@a","Password":"a"}}/>}
      </IonContent>
    </IonPage>
  );
};

//{ (!OkAuth) ? <Login okAuth={() => setOkAuth(true)} setUser={(ev: any) => setUser(ev)} /> : <Dashboard User={User} /> }
export default Home;
