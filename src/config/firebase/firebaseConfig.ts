import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAX3SxbXvlg6ANInO4mNlLUeTWbX-QZRp4',
  authDomain: 'triviaapp-330cc.firebaseapp.com',
  projectId: 'triviaapp-330cc',
  storageBucket: 'triviaapp-330cc.firebasestorage.app',
  messagingSenderId: '842850050310',
  appId: '1:842850050310:web:5efd0f3da409ea66d6be87'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
