import { getDownloadURL, ref, uploadBytes, type StorageReference } from "firebase/storage";
import { storage } from "../../firebase";

export async function uploadImage(img: File, perfumeId: string): Promise<string> {
  const result = await uploadBytes(getFileRef(perfumeId), img);
  return getDownloadURL(result.ref);
}

function getFileRef(id: string): StorageReference {
  return ref(storage, 'perfumes/' + id);
}