import { db } from '../../firebase';
import { deleteDoc, doc, setDoc, updateDoc, writeBatch, type DocumentReference } from 'firebase/firestore';

export async function createPerfume(newId: string, perfume: NewPerfume): Promise<void> {
  await setDoc(getDocRef(newId), perfume);
}

export async function updatePerfume(perfume: Perfume): Promise<void> {
  const { id, ...perfumeData } = perfume;
  await updateDoc(getDocRef(perfume.id), perfumeData);
}

export async function savePerfumeOrder(perfumes: Perfume[]): Promise<void> {
  const batch = writeBatch(db);

  perfumes.forEach((p, i) =>
    batch.update(getDocRef(p.id), { order: i })
  );

  await batch.commit();
}


export async function deletePerfume(id: string): Promise<void> {
  await deleteDoc(getDocRef(id));
}

function getDocRef(id: string): DocumentReference {
  return doc(db, 'perfumes/' + id);
}