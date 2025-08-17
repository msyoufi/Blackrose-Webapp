import { API_KEY, SEARCH_ENGINE_ID } from "../../secrets/search-engine.api-key";

const baseURL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=`;

export async function findImageUrl(perfume: Perfume): Promise<string> {
  const { brand, name, concentration, sex } = perfume;

  const query = [name, brand, concentration, sex].join(' ');
  const searchUrl = baseURL + encodeURIComponent(query);

  const response = await fetch(searchUrl);
  if (!response.ok) {
    throw new Error('Unable to search for an image');
  }

  const data = (await response.json()).items;

  if (!data || !data.length) {
    throw new Error('No image found!');
  }

  for (const item of data) {
    const imgUrl = item.pagemap?.hproduct?.[0]?.photo;
    if (imgUrl) return imgUrl;
  }

  throw new Error('No image found!');
}

export async function downloadFileFromUrl(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to download the file from URL');
  }

  return await response.blob();
}