// Import the scripts directly via CDN or use global variables if needed.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "AIzaSyDB1rjluAW9f7ZWIN7LEFIoaFalTj5Iai8",
    authDomain: "flight-status-34ad8.firebaseapp.com",
    projectId: "flight-status-34ad8",
    storageBucket: "flight-status-34ad8.appspot.com",
    messagingSenderId: "645244972927",
    appId: "1:645244972927:web:a19a304a93a985b424744a"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
