import { useState, useEffect, createContext, useRef } from 'react';
import { IonContent, IonPage, IonNav, IonHeader, IonToolbar, IonTitle, IonIcon, IonFab, IonFabButton } from '@ionic/react';
import { Storage } from '@ionic/storage';
import Dashboard from '../components/Dashboard';
import Login from "../components/Login";
import { bodyUser, doRequest } from '../ServerTalker';
import { add, personCircleSharp } from 'ionicons/icons';
import MenuProfile from '../components/MenuProfile';
import TransactionModal from '../components/TransactionModal';

export const MyContext = createContext();

export default function Home(){
  let [User, setUser] = useState(null); //user credentials
  let [AllTransactions, setAllTransactions] = useState([]); //all transaction of the user
  let transactionHandler = useRef();
  const store = new Storage();


  /**
   * load into the state, all the transaction of a user
   * @param {string} Email of user
   * @param {string} Password is the hash of user's psw (MD5)
   */
  function loadAllTransactions(Email, Password) {
    doRequest("getAllTransaction", bodyUser(Email, Password)).then(res => res.json()).then(res => {
      setAllTransactions(
        res.transactions.sort((a,b) => (a.Date>b.Date)?-1 : 1 ) //sort the transaction by date and return an array of them
      );
    }).catch(err => {
      console.log(err);
    });
  }

  /**
   * check if the credentials are stored in the bowser's cache
   */
  function checkCredentials(){
    store.create();
    store.get('User').then(res=>{
      if(res!=null){
        loadAllTransactions(res.Email,res.Password)
        setUser(res)
      }
    })
  }

  useEffect(()=>{ //se if there are the credentials in cache then set it
    checkCredentials();
  },[]);


  return (
    <IonPage className="Home">
      <IonHeader mode='ios'>
        <IonToolbar color="dark" className="walletterHeader">
          <IonTitle>Walletter</IonTitle>
          {
            (User!=null)? //user is logged
            <div>
              <IonIcon icon={personCircleSharp} id="AccountIcon" size="large" style={{ float: "right", marginRight: '5px' }} />
              <MenuProfile User={User} setUser={(obj)=>setUser(obj)}/>
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
            
            <IonFab slot="fixed" horizontal="end" vertical="bottom" mode='ios'>
              <IonFabButton onClick={()=>transactionHandler.current?.present()} color="dark" mode='ios'>
                <IonIcon icon={add}></IonIcon>
              </IonFabButton>
            </IonFab>
            <TransactionModal modalHandler={transactionHandler}/>

          </MyContext.Provider>
        }
      </IonContent>
    </IonPage>
  );
}