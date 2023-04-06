
import { IonLabel, IonHeader,IonToolbar,IonTitle,IonContent,IonItem, IonPopover, IonSegment, IonSegmentButton, IonInput, IonCardSubtitle, IonButton,IonModal } from "@ionic/react";
import {doRequest,bodyUser} from "../../ServerTalker.js"
import moment from "moment";
import {MyContext} from '../../pages/Home';
import {useContext, useRef} from "react"
import { Storage } from '@ionic/storage';
import UploadModal from "../Modals/UploadModal"

export default function MenuProfile(props){

  let ctx = useContext(MyContext);
  let store = new Storage();
  let modalUpload = useRef();
  let popoverMenu = useRef();

  function unstoreCredentials(){
      store.create();
      store.set("User",null);
      ctx.User.setUser(null)
  }

  function doUpload(){
    const file = document.querySelector('input[type=file]').files[0];
    console.log(file)
    const reader = new FileReader();
    reader.addEventListener("load", function () {

      doRequest("doImport",{
        "DataB64":reader.result,
        "Email":ctx.User.User.Email,
      }).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })

    }, false);
    modalUpload.current?.dismiss();

    if (file) {
        reader.readAsDataURL(file);
    }
  }


	return(
		<IonPopover trigger="AccountIcon" triggerAction="click" ref={popoverMenu}>
           
        <IonButton color="medium" size="small" onClick={()=>{
            doRequest("getExport",
                bodyUser(ctx.User.User.Email,ctx.User.User.Password)
              ).then(res=>res.blob()).then(blob=>{

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

        <UploadModal modalUpload={modalUpload} doUpload={()=>doUpload()}/>
        <IonButton size="small" color="success" id="modalUpload">
          Import
          
        </IonButton>

        <IonButton color="warning" size="small" onClick={()=>console.log("TODO:")}>
          Edit
        </IonButton>
        <IonButton color="danger" size="small" onClick={()=>{
          unstoreCredentials()
          popoverMenu.current?.dismiss();
        }}>
          Log out
        </IonButton>
      </IonPopover>
    );	
}