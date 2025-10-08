// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQK3COpjYSWO91VL4jpmarzSRakplarDY",
  authDomain: "fitdate-586f0.firebaseapp.com",
  projectId: "fitdate-586f0",
  storageBucket: "fitdate-586f0.firebasestorage.app",
  messagingSenderId: "424288427812",
  appId: "1:424288427812:web:24fe8c28a6537a42099db1",
  measurementId: "G-H9NR25H98T",
  sha1Fingerprint: "DA:39:A3:EE:5E:6B:4B:0D:32:55:BF:EF:95:60:18:90:AF:D8:07:09"
};

// Initialize Firebase
let app, auth, firestore, dataConnect;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
  dataConnect = new DataConnect(app, connectorConfig);
} else {
  app = getApp();
  auth = getAuth();
  firestore = getFirestore();
  dataConnect = new DataConnect(app, connectorConfig);
}

export { app, auth, firestore, dataConnect };