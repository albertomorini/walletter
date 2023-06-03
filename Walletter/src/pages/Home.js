import { useState, useEffect, createContext } from 'react';
import { IonContent, IonPage, IonNav, IonApp, IonHeader, IonToolbar, IonTitle, IonIcon } from '@ionic/react';
import { Storage } from '@ionic/storage';
import Dashboard from '../components/Dashboard';
import Login from "../components/Login";
import { bodyUser, doRequest } from '../ServerTalker';
import MonthlyRecap from '../components/widgets/MonthlyRecap';
import { personCircleSharp } from 'ionicons/icons';
import MenuProfile from '../components/MenuProfile';

const MyContext = createContext();

export default function Home(){
  let [User, setUser] = useState(null); //user credentials
  const store = new Storage();


  let [AllTransactions, setAllTransactions] = useState([]); //all transaction of the user

  function loadAllTransactions(Email, Password) {
    //create an array with the transaction, sorted by date desc
    doRequest("getAllTransaction", bodyUser(Email, Password)).then(res => res.json()).then(res => {
      let tmp = res.transactions.map(s => s).sort((a, b) => { //sort the transaction by date
        if (a.Date > b.Date) {
          return -1
        } else {
          return 1
        }
      });
      setAllTransactions(tmp);
    }).catch(err => {
      console.log(err);
    })
  }



  useEffect(()=>{ //se if there are the credentials in cache then set it
    store.create();
    store.get('User').then(res=>{
      if(res!=null){
        loadAllTransactions(res.Email,res.Password)
        setUser(res)
      }
    })
  },[]);

  return (
    <IonPage className="Home">
      <IonHeader mode='ios'>
        <IonToolbar color="dark" className="walletterHeader">

          <IonTitle>Walletter</IonTitle>
          { //user menu
            (User != null) ?
              <div>
                <IonIcon icon={personCircleSharp} id="AccountIcon" size="large" style={{ float: "right", marginRight: '5px' }} />
                <MenuProfile doLogout={() => setUser(null)} User={User} />
              </div>
              :
              null
          }
        </IonToolbar>
      </IonHeader>

      <IonContent class='ion-padding'>
        {(User==null)? //not credentials found -> login
          <Login setUser={(ev)=>{setUser(ev); loadAllTransactions(ev.Email,ev.Password)}}/> 
        : 
          <MyContext.Provider value={
            {
              "User": User,
              "AllTransactions": AllTransactions,
              "loadAllTransaction": () => loadAllTransactions(User.Email, User.Password)
            }
          }>
              
            <IonNav animated="true" swipeGesture="true" root={() => <Dashboard/> }></IonNav>
          </MyContext.Provider>
        }
      </IonContent>
    </IonPage>
  );
}

export { MyContext };


/**
 * 
 * 
 *    <IonHeader mode='ios' >
        <IonToolbar color="dark" className="walletterHeader">
          

          <IonTitle>Walletter</IonTitle>
          { //user menu
            (User != null) ?
              <div>
                <IonIcon icon={personCircleSharp} id="AccountIcon" size="large" style={{ float: "right", marginRight: '5px' }} />
                <MenuProfile doLogout={() => setUser(null)} User={User} />
              </div>
              :
              null
          }
        </IonToolbar>
      </IonHeader>
 * 
 */