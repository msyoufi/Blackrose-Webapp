interface Perfume {
  id: string,
  brand: string,
  name: string,
  collection: PerfumeCollection,
  sex: PerfumeSex,
  concentration: FragranceConcentration,
  fragrance_type: string,
  inspired_by: string,
  size: number,
  price: number,
  image_url: string
}

type PerfumeSex = 'Men' | 'Women' | 'Unisex';

type PerfumeCollection = 'Designer' | 'Arabic' | 'Private';

type FragranceConcentration =
  ''
  | 'Eau de Toilette'
  | 'Eau de Parfum'
  | 'Parfum'
  | 'Intense'
  | 'Elixir'
  | 'Eau de Cologne'
  | 'Eau Fraiche';

type NewPerfume = Omit<Perfume, 'id'>;

interface PerfumeFormData extends Perfume {
  id?: string,
  sex: string,
  collection: string,
  size: string,
  price: string
}