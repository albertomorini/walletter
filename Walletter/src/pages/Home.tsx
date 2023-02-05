import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import Dashboard from '../components/Register/Dashboard';
import Login from "../components/UserProfile/Login"
import './Home.css';

const Home: React.FC = () => {

  let [OkAuth, setOkAuth] = useState(true);
  let [User, setUser] = useState(null);
  
  return (
    <IonPage>
      <IonHeader mode='ios'>
        <IonToolbar>
          <IonTitle>Walletter</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        
        {(!OkAuth) ? <Login okAuth={() => setOkAuth(true)} setUser={(ev:any)=>setUser(ev)}/> : <Dashboard User={{"Email":"a@a","Password":"a"}}/>}
      </IonContent>
    </IonPage>
  );
};

export default Home;
