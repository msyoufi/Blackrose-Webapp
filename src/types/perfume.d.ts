interface Perfume {
  id: string,
  brand: string,
  name: string,
  category: PerfumeCategory,
  sex: PerfumeSex,
  concentration: FragranceConcentration,
  fragrance_type: string,
  size: number,
  price: number,
  image_url: string
}

type PerfumeSex = 'Men' | 'Women' | 'Unisex';

type PerfumeCategory = 'Designer' | 'Arabic' | 'Private';

type FragranceConcentration =
  'Eau de Toilette'
  | 'Eau de Parfum'
  | 'Parfum'
  | 'Elixir'
  | 'Eau de Cologne'
  | 'Eau Fraiche';

type NewPerfume = Omit<Perfume, 'id'>;

interface PerfumeFormData extends Perfume {
  id?: string,
  sex: string,
  category: string,
  concentration: string,
  size: string,
  price: string
}

type Override<T, U> = Omit<T, keyof U> & U;