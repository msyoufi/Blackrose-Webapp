import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export async function login(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}