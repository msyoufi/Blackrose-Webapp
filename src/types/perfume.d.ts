interface Perfume {
  id: number,
  brand: string,
  name: string,
  sex: PerfumeSex,
  concentration: FragranceConcentration,
  fragrance_type: string,
  size: number,
  price: number,
  in_stock: boolean,
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
  id?: number,
  sex: string,
  concentration: string,
  size: string,
  price: string
}