import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB1rjluAW9f7ZWIN7LEFIoaFalTj5Iai8",
  authDomain: "flight-status-34ad8.firebaseapp.com",
  projectId: "flight-status-34ad8",
  storageBucket: "flight-status-34ad8.appspot.com",
  messagingSenderId: "645244972927",
  appId: "1:645244972927:web:a19a304a93a985b424744a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request notification permission and get FCM token
export const requestPermission = async (setToken) => {
  console.log('Requesting permission...');
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    const token = await getToken(messaging, { vapidKey: 'BCxV_XvzohXPf3EQvQkFc35-HYY04VM8t5mY1kgd0pRX8o5hOTmHF1EQ2GOXwxPjAlMMj9gU0yIYrIuRctD-PdE' });
    if (token) {
      console.log('FCM Token:', token);
      // Send the token to your backend to register
      await fetch('http://localhost:5000/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      setToken(token); // Update state with the token
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } else {
    console.log('Notification permission denied.');
  }
};

// Handle foreground messages
export const handleForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/firebase-logo.png'
    };
    if (Notification.permission === 'granted') {
      new Notification(payload.notification.title, notificationOptions);
    }
  });
};

export { messaging };
