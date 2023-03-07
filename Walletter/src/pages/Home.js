import React,{ useState,useEffect } from 'react';
import { IonContent, IonHeader, IonIcon, IonPopover, IonButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { personCircleSharp, arrowBack, chevronForwardOutline } from "ionicons/icons";
import { Storage } from '@ionic/storage';


import Dashboard from '../components/Transactions/Dashboard';
import Login from "../components/UserProfile/Login"
import MenuProfile from "../components/UserProfile/MenuProfile.js";
import './Home.css';

const MyContext = React.createContext();


export default function Home(){
  let [User, setUser] = useState(null);
  let [FullScreen,setFullScreen] = useState(false);
  const store = new Storage();
  

  useEffect(()=>{
    store.create();
    store.get('User').then(res=>{
      if(res!=null){
        setUser(res)
      }
    })
  },[])

  return (

      <MyContext.Provider value={
          {
            "User" : {User,setUser},
            "FullScreen": { FullScreen,setFullScreen }
          }          
        }>
        <IonPage className="Home">
          <IonHeader mode='ios' >
            <IonToolbar color="dark" className="walletterHeader">
              {
                (FullScreen)?
                  <IonButton slot="start" mode="ios" onClick={()=>setFullScreen(false)} color="light" size="small">
                      <IonIcon mode="ios" icon={arrowBack} />

                  </IonButton>
                :
                null
              }

              <IonTitle>Walletter</IonTitle>
              {
                (User!=null)?
                  <div>
                    <IonIcon icon={personCircleSharp} id="AccountIcon" size="large" style={{float: "right",marginRight:'5px'}}/>
                    <MenuProfile/>
                  </div>
                :
                  null
              }
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            
            {(User==null)?
               <Login setUser={(ev:any)=>setUser(ev)}/> 
            : 
                <Dashboard/>
            }
          </IonContent>
        </IonPage>
      </MyContext.Provider>
    
  );
}

export { MyContext };