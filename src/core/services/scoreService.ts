import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

export const saveUserScore = async (score: number) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, 'scores'), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    score,
    createdAt: serverTimestamp()
  });
};
