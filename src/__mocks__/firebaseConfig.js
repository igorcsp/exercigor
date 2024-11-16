import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'mock-api-key',
    authDomain: 'mock-domain.firebaseapp.com',
    projectId: 'mock-project',
    storageBucket: 'mock-bucket.appspot.com',
    messagingSenderId: 'mock-sender-id',
    appId: 'mock-app-id'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);