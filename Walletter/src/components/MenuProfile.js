
import { IonPopover, IonButton } from "@ionic/react";
import { doRequest, bodyUser } from "../ServerTalker.js";
import moment from "moment";
import { useRef } from "react";
import { Storage } from '@ionic/storage';
import UploadModal from "./UploadModal.js";

export default function MenuProfile(props){

  let store = new Storage();
  let modalUpload = useRef();
  let popoverMenu = useRef();

  function doLogout(){
    //remove credentials
    try{
      store.create();
      store.set("User",null);
    }catch{
    } 
    popoverMenu.current?.dismiss(); //close popup
    props.setUser(null);
  }

  //upload JSON backup file 
  function doImport(){ 
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      doRequest("doImport",{
        "DataB64":reader.result,
        "Email":props.User.Email,
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
  
  //export the transactions in a json file -- do a backup
  function doExport(){
    doRequest("getExport",
      bodyUser(props.User.Email, props.User.Password)
    ).then(res => res.blob()).then(blob => {

      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;

      a.download = "WalletterExport_" + moment().format("YYYY-MM-DD") + ".json";
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove();

    })
  }

	return(
		<IonPopover trigger="AccountIcon" triggerAction="click" ref={popoverMenu}>
        <IonButton color="medium" size="small" onClick={()=>doExport()}>
          Export
        </IonButton>

       <UploadModal modalUpload={modalUpload} doUpload={() => doImport()}/>
        <IonButton size="small" color="success" id="modalUpload">
          Import
        </IonButton>

        <IonButton color="warning" size="small" onClick={()=>console.log("TODO:")}>
          Edit
        </IonButton>
        <IonButton color="danger" size="small" onClick={()=> doLogout()}>
          Log out
        </IonButton>
      </IonPopover>
    );	
}