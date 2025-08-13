interface Perfume {
  id: number,
  brand: string,
  name: string,
  sex: PerfumeSex,
  type: PerfumeType,
  size: number,
  price: number,
  in_stock: boolean,
  image_url: string
}

type PerfumeSex = 'Men' | 'Women' | 'Unisex';

type PerfumeType =
  'Eau de Toilette'
  | 'Eau de Parfum'
  | 'Parfum'
  | 'Elixir'
  | 'Eau de Cologne'
  | 'Eau Fraiche';

type NewPerfume = Omit<Perfume, 'id'>;