import { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonIcon, IonButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { personCircleSharp, arrowBack } from "ionicons/icons";
import { Storage } from '@ionic/storage';
import Dashboard from '../components/Transactions/Dashboard';
import Login from "../components/UserProfile/Login";
import MenuProfile from "../components/UserProfile/MenuProfile.js";
import './Home.css';


export default function Home(){
  let [User, setUser] = useState(null);
  let [FullScreen,setFullScreen] = useState(false);

  const store = new Storage();
  

  useEffect(()=>{ //se if there are the credentials in cache
    store.create();
    store.get('User').then(res=>{
      if(res!=null){
        setUser(res)
      }
    })
  },[])

  return (
    <IonPage className="Home">
      <IonHeader mode='ios' >
        <IonToolbar color="dark" className="walletterHeader">
          { //back button
            (FullScreen)?
              <IonButton slot="start" mode="ios" onClick={(ev)=>{ev.preventDefault();setFullScreen(false)}} color="light" size="small">
                  <IonIcon mode="ios" icon={arrowBack} />
              </IonButton>
            :
            null
          }

          <IonTitle>Walletter</IonTitle>
          { //user menu
            (User!=null)?
              <div>
                <IonIcon icon={personCircleSharp} id="AccountIcon" size="large" style={{float: "right",marginRight:'5px'}}/>
                <MenuProfile doLogout={() => setUser(null)} User={User} />
              </div>
            :
              null
          }
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {(User==null)?
          <Login setUser={(ev)=>setUser(ev)}/> 
        : 
          <Dashboard User={User} FullScreen={FullScreen} setFullScreen={()=>{setFullScreen(true)}}/>
        }
      </IonContent>
    </IonPage>
  );
}
