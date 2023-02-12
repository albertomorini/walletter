import { IonContent, IonHeader, IonIcon, IonPopover, IonButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import Dashboard from '../components/Register/Dashboard';
import Login from "../components/UserProfile/Login"
import './Home.css';
import { personCircleSharp } from 'ionicons/icons';

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
            <IonButton color="warning" size="small" onClick={()=>console.log("TODO:")}>
              Edit
            </IonButton><IonButton color="danger" size="small" onClick={()=>setUser(null)}>
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
