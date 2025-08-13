import allPerfumes from '../../../mock/BR_perfumes_2025-08-13_100000.json';

export async function getAllPerfumes(): Promise<Perfume[]> {
  try {
    // TODO
    return allPerfumes as Perfume[];

  } catch (err: unknown) {
    console.log(err);
    return [];
  }
}

export async function deletePerfume(id: number): Promise<void> {
  // TODO
  console.log(id);
}