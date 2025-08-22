import { db } from '../../firebase';
import { deleteDoc, doc, setDoc, updateDoc, writeBatch, type DocumentReference } from 'firebase/firestore';

export async function createPerfume(newId: string, perfume: NewPerfume): Promise<void> {
  await setDoc(getDocRef(newId), perfume);
}

export async function updatePerfume(perfume: Perfume): Promise<void> {
  const { id, ...perfumeData } = perfume;
  await updateDoc(getDocRef(perfume.id), perfumeData);
}

export async function updatePerfumesOrder(orderedPerfumes: Perfume[]): Promise<void> {
  const batch = writeBatch(db);

  orderedPerfumes.forEach((p, i) =>
    batch.update(getDocRef(p.id), { order: i + 1 })
  );

  await batch.commit();
}

export function reorderPerfumes(
  allPerfumes: Perfume[],
  movedPerfume: Perfume,
  newOrder: number,
  isDelete: boolean = false
): Perfume[] {
  const { id, collection } = movedPerfume;

  // Order the perfume each in its own collection
  const collPerfumes = allPerfumes.filter(p => p.collection === collection);

  const currIndex = collPerfumes.findIndex(p => p.id === id);
  if (currIndex < 0) throw new Error('Perfume not found');

  const [moved] = collPerfumes.splice(currIndex, 1);

  if (!isDelete) {
    // clamp newIndex
    const newIndex = Math.max(0, Math.min(newOrder - 1, collPerfumes.length));
    collPerfumes.splice(newIndex, 0, moved);
  }

  return collPerfumes;
}

export async function deletePerfume(id: string): Promise<void> {
  await deleteDoc(getDocRef(id));
}

function getDocRef(id: string): DocumentReference {
  return doc(db, 'perfumes/' + id);
}