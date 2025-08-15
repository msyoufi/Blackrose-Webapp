interface Perfume {
  id: string,
  brand: string,
  name: string,
  sex: PerfumeSex,
  concentration: FragranceConcentration,
  fragrance_type: string,
  size: number,
  price: number,
  image_url: string
}

type PerfumeSex = 'Men' | 'Women' | 'Unisex';

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
  concentration: string,
  size: string,
  price: string
}

type Override<T, U> = Omit<T, keyof U> & U;