import { useLoaderData } from 'react-router';
import { useState } from 'react';
import PerfumesGridHeader from './perfumes-grid-header/perfumes-grid-header';
import PerfumeItem from './perfume-item/perfume-item';
import './perfumes-grid.scss';

export default function PerfumesGrid() {
  const initialPerfumes = useLoaderData<Perfume[]>();
  const [perfumes, setPerfumes] = useState<Perfume[]>(initialPerfumes);

  return (
    <div>
      <PerfumesGridHeader />

      {perfumes.map(p =>
        <PerfumeItem perfume={p} />
      )}
    </div>
  );
}