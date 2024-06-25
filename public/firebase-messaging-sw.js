importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyDNr9FY0BWxihPUD3tvSQwFT59h6S5qUaw',
  authDomain: 'ecommerce-426608.firebaseapp.com',
  projectId: 'ecommerce-426608',
  storageBucket: 'ecommerce-426608.appspot.com',
  messagingSenderId: '571962248186',
  appId: '1:571962248186:web:409cc5abe7119691ec7243',
  measurementId: 'G-5G195C5PZV'
}
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig)
// eslint-disable-next-line no-undef
const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png'
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})
