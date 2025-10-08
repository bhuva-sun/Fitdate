import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { DataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';
import { Provider } from '@firebase/component';

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

let app;
let auth: Auth;
let firestore: Firestore;
let dataConnect: DataConnect;

const createAuthInternal = (auth: Auth) => ({
  getToken: () => Promise.resolve({ accessToken: '' }),
  getUid: () => auth.currentUser?.uid || null,
  addAuthTokenListener: (listener: (token: string) => void) => {
    auth.onIdTokenChanged((user) => {
      user?.getIdToken().then((token) => listener(token));
    });
  },
  removeAuthTokenListener: (listener: (token: string) => void) => {
    // Unsubscribe logic would go here
  }
});

const createAppCheckInternal = () => ({
  getToken: () => Promise.resolve({ token: '', expireTimeMillis: Date.now() + 3600000 }),
  getLimitedUseToken: () => Promise.resolve({ token: '', expireTimeMillis: Date.now() + 3600000 }),
  addTokenListener: () => {},
  removeTokenListener: () => {}
});

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
  
  const authProvider: Provider<'auth-internal'> = {
    name: 'auth-internal',
    serviceProps: {},
    component: null,
    instances: new Map(),
    getImmediate: () => createAuthInternal(auth),
    getComponent: () => null,
    setComponent: () => null,
    clearInstance: () => {},
    delete: () => Promise.resolve(),
    container: app
  };

  const appCheckProvider: Provider<'app-check-internal'> = {
    name: 'app-check-internal',
    serviceProps: {},
    component: null,
    instances: new Map(),
    getImmediate: () => createAppCheckInternal(),
    getComponent: () => null,
    setComponent: () => null,
    clearInstance: () => {},
    delete: () => Promise.resolve(),
    container: app
  };

  dataConnect = new DataConnect(app, { ...connectorConfig, projectId: firebaseConfig.projectId }, authProvider, appCheckProvider);
} else {
  app = getApp();
  auth = getAuth();
  firestore = getFirestore();
  
  const authProvider: Provider<'auth-internal'> = {
    name: 'auth-internal',
    serviceProps: {},
    component: null,
    instances: new Map(),
    getImmediate: () => createAuthInternal(auth),
    getComponent: () => null,
    setComponent: () => null,
    clearInstance: () => {},
    delete: () => Promise.resolve(),
    container: app
  };

  const appCheckProvider: Provider<'app-check-internal'> = {
    name: 'app-check-internal',
    serviceProps: {},
    component: null,
    instances: new Map(),
    getImmediate: () => createAppCheckInternal(),
    getComponent: () => null,
    setComponent: () => null,
    clearInstance: () => {},
    delete: () => Promise.resolve(),
    container: app
  };

  dataConnect = new DataConnect(app, { ...connectorConfig, projectId: firebaseConfig.projectId }, authProvider, appCheckProvider);
}

export { app, auth, firestore, dataConnect };