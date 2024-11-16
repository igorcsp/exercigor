import '@testing-library/jest-dom';

global.process.env = {
    VITE_API_KEY: 'mock-api-key',
    VITE_AUTH_DOMAIN: 'mock-domain.firebaseapp.com',
    VITE_PROJECT_ID: 'mock-project',
    VITE_STORAGE_BUCKET: 'mock-bucket.appspot.com',
    VITE_MESSAGING_SENDER_ID: 'mock-sender-id',
    VITE_APP_ID: 'mock-app-id'
};