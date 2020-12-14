import firebase from "firebase/app";
import "firebase/messaging";
import { Ui } from "@Helpers/Ui";

let messaging = null;

const FirebaseHelper = {
  messaging: null,
  init: () => {
    firebase.initializeApp({
      apiKey: "AIzaSyBUkx0kqWntwVzNCjq8apE5yRZaSpXWVv4",
      authDomain: "carrental-6604e.firebaseapp.com",
      databaseURL: "https://carrental-6604e.firebaseio.com",
      projectId: "carrental-6604e",
      storageBucket: "carrental-6604e.appspot.com",
      messagingSenderId: "92471568067",
      appId: "1:92471568067:web:d1381a0bec55f8e458a476"
    });
    if (firebase.messaging.isSupported()) {
      messaging = firebase.messaging();
      // console.log("Supported");
    } else {
      Ui.showWarning({ message: "Firebase is not support." });
    }
  },

  getToken: () => {
    // let {messaging} = this;
    return messaging.requestPermission().then(() => {
      return messaging.getToken();
    });
  },

  onMessaging: history => {
    let messaging = firebase.messaging();
    if (messaging) {
      messaging.requestPermission().then(() => {
        console.log("We have permission..");
      });
      messaging.onMessage(payload => {
        if (parseInt(payload.data.type) === 0) {
          // type === 0 => Báo cáo sự cố
          Ui.showWarning({
            onClick: () => {
              window.open(
                `availableResourcesManagement/incidentReport?uuid=${payload.data.uuid}`,
                "_blank"
              );
            },
            message: "Có sự cố mới."
          });
        }
      });
    }
  }
};

export default FirebaseHelper;
