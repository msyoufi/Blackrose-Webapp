import { deleteObject, getBlob, getDownloadURL, ref, uploadBytes, type StorageReference } from "firebase/storage";
import { storage } from "../../firebase";
import imageCompression from "browser-image-compression";

export async function uploadImage(img: File | Blob, perfumeId: string): Promise<string> {
  img = await toJPG(img);
  const result = await uploadBytes(getFileRef(perfumeId), img);
  return getDownloadURL(result.ref);
}

export async function deleteImage(perfumeId: string): Promise<void> {
  await deleteObject(getFileRef(perfumeId));
}

export async function downloadImage(perfumeId: string): Promise<Blob> {
  return await getBlob(getFileRef(perfumeId));
}

function getFileRef(id: string): StorageReference {
  return ref(storage, 'perfumes/' + id);
}

async function toJPG(imgFile: File | Blob): Promise<Blob> {
  const file: File = imgFile instanceof Blob
    ? new File([imgFile], 'image.webp', { type: imgFile.type })
    : imgFile;

  return await imageCompression(file, { fileType: "image/jpeg" });
}
