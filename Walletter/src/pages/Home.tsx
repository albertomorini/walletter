import { IonContent, IonHeader, IonIcon, IonPopover, IonButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import Dashboard from '../components/Transactions/Dashboard';
import Login from "../components/UserProfile/Login"
import { personCircleSharp } from 'ionicons/icons';
import MenuProfile from "../components/UserProfile/MenuProfile.js";
import './Home.css';

const Home: React.FC = () => {

  let [OkAuth, setOkAuth] = useState(true); //TODO: put false after test
  let [User, setUser] = useState(null);
  
  return (
    <IonPage>
      <IonHeader mode='ios'>
        <IonToolbar>
          <IonTitle>Walletter</IonTitle>
          <IonIcon icon={personCircleSharp} id="AccountIcon" size="large" style={{float: "right",marginRight:'5px'}}/>
          <MenuProfile setUser={(obj:any)=>setUser(obj)}/>

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
