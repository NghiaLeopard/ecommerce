import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyDNr9FY0BWxihPUD3tvSQwFT59h6S5qUaw',
  authDomain: 'ecommerce-426608.firebaseapp.com',
  projectId: 'ecommerce-426608',
  storageBucket: 'ecommerce-426608.appspot.com',
  messagingSenderId: '571962248186',
  appId: '1:571962248186:web:409cc5abe7119691ec7243',
  measurementId: 'G-5G195C5PZV'
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
