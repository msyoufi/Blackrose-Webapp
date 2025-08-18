import { db } from '../../firebase';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, updateDoc, type DocumentReference } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useSnackbar } from '../components/snackbar';

export function usePerfumes(): [boolean, unknown, Perfume[]] {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const snackbar = useSnackbar();

  useEffect(() => {
    try {
      const q = query(collection(db, 'perfumes'), orderBy('order'));

      return onSnapshot(q, querySnapshot => {
        const nextPerfumes: Perfume[] = [];
        querySnapshot.forEach(doc => nextPerfumes.push({ ...doc.data(), id: doc.id } as Perfume));
        setPerfumes(nextPerfumes);
        setLoading(false);
      });

    } catch (err: unknown) {
      snackbar.show('Unable to load the Perfumes!', 'error');
      setError(err);
      setLoading(false);
    }
  }, []);

  return [loading, error, perfumes];
}

export async function createPerfume(newId: string, perfume: NewPerfume): Promise<void> {
  await setDoc(getDocRef(newId), perfume);
}

export async function updatePerfume(perfume: Perfume): Promise<void> {
  const { id, ...perfumeData } = perfume;
  await updateDoc(getDocRef(perfume.id), perfumeData);

}

export async function deletePerfume(id: string): Promise<void> {
  await deleteDoc(getDocRef(id));
}

function getDocRef(id: string): DocumentReference {
  return doc(db, 'perfumes/' + id);
}