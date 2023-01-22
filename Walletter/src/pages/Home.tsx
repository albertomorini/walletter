import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import Dashboard from '../components/Register/Dashboard';
import Login from "../components/UserProfile/Login"
import './Home.css';

const Home: React.FC = () => {

  let [OkAuth, setOkAuth] = useState(false);
  
  return (
    <IonPage>
      <IonHeader mode='ios'>
        <IonToolbar>
          <IonTitle>Walletter</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        
        {(!OkAuth)?<Login okAuth={()=>setOkAuth(true)} /> : <Dashboard/>}
      </IonContent>
    </IonPage>
  );
};

export default Home;
