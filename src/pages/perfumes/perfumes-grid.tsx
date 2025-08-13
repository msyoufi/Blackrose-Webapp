import { useEffect, useState } from 'react';
import PerfumesGridHeader from './perfumes-grid-header/perfumes-grid-header';
import PerfumeItem from './perfume-item/perfume-item';
import { usePerfumes } from '../../shared/services/perfume.service';
import './perfumes-grid.scss';

export default function PerfumesGrid() {
  const initialPerfumes = usePerfumes();
  const [displayPerfumes, setDisplayPerfumes] = useState<Perfume[]>([]);

  useEffect(() => setDisplayPerfumes(initialPerfumes), [initialPerfumes]);

  function removePerfumeLocaly(id: number): void {
    const nextPerfumes = displayPerfumes.filter(p => p.id !== id);
    setDisplayPerfumes(nextPerfumes);
  }

  return (
    <div>
      <PerfumesGridHeader />

      <div className="perfumes-grid">
        {displayPerfumes.map(p =>
          <PerfumeItem
            key={p.id}
            perfume={p}
            removePerfumeLocaly={removePerfumeLocaly}
          />
        )}
      </div>

    </div>
  );
}