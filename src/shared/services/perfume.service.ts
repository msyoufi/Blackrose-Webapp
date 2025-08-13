import { db } from '../../firebase';
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, updateDoc, type DocumentReference } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export function usePerfumes(): Perfume[] {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);

  useEffect(() => {
    try {
      const q = query(collection(db, 'perfumes'));

      const unsubscribe = onSnapshot(q, querySnapshot => {
        const nextPerfumes: Perfume[] = [];
        querySnapshot.forEach(doc => nextPerfumes.push({ ...doc.data(), id: doc.id } as Perfume));
        setPerfumes(nextPerfumes);
      });

      return unsubscribe;

    } catch (err: unknown) {
      console.log(err);
    }
  }, []);

  return perfumes;
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