// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/6.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.0.2/firebase-messaging.js');
// importScripts('/__/firebase/init.js');
// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    // apiKey: 'AIzaSyBUkx0kqWntwVzNCjq8apE5yRZaSpXWVv4',
    // authDomain: 'carrental-6604e.firebaseapp.com',
    // databaseURL: 'https://carrental-6604e.firebaseio.com',
    // projectId: 'carrental-6604e',
    // storageBucket: 'carrental-6604e.appspot.com',
    messagingSenderId: '92471568067',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
let messaging = firebase.messaging();
// messaging.setBackgroundMessageHandler(function (payload) {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     var notificationTitle = 'Background Message Title';
//     var notificationOptions = {
//         body: 'Background Message body.',
//         icon: '/firebase-logo.png'
//     };
//
//     return self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });
// messaging.onMessage(function (payload) {
//     console.log('Message received. ', payload);
//     // ...
// });