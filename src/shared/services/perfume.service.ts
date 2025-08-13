import { db } from '../../firebase';
import { collection, doc, onSnapshot, query, setDoc, updateDoc, type DocumentReference } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export function usePerfumes(): Perfume[] {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);

  useEffect(() => {
    try {
      const q = query(collection(db, 'perfumes'));

      const unsubscribe = onSnapshot(q, querySnapshot => {
        const nextPerfumes: Perfume[] = [];
        querySnapshot.forEach(doc => nextPerfumes.push({ ...doc.data(), id: Number(doc.id) } as Perfume));
        setPerfumes(nextPerfumes);
      });

      return unsubscribe;

    } catch (err: unknown) {
      console.log(err);
    }
  }, []);

  return perfumes;
}

export async function createPerfume(perfume: NewPerfume): Promise<void> {
  const id = new Date().getTime();
  await setDoc(getDocRef(id), perfume);
}

export async function updatePerfume(perfume: Perfume): Promise<void> {
  const { id, ...perfumeData } = perfume;
  console.log(perfumeData)
  await updateDoc(getDocRef(perfume.id), perfumeData);

}

export async function deletePerfume(id: number): Promise<void> {
  // TODO
  console.log(id);
}

function getDocRef(id: number): DocumentReference {
  return doc(db, 'perfumes/' + id);
}