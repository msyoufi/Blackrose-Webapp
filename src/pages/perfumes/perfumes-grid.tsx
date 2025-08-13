import { useEffect, useState } from 'react';
import PerfumesGridHeader from './perfumes-grid-header/perfumes-grid-header';
import PerfumeItem from './perfume-item/perfume-item';
import { usePerfumes } from '../../shared/services/perfume.service';
import './perfumes-grid.scss';

export default function PerfumesGrid() {
  const initialPerfumes = usePerfumes();
  const [displayPerfumes, setDisplayPerfumes] = useState<Perfume[]>([]);

  useEffect(() => setDisplayPerfumes(initialPerfumes), [initialPerfumes]);

  return (
    <div>
      <PerfumesGridHeader />
      {displayPerfumes.length

        ? <div className="perfumes-grid">
          {displayPerfumes.map(p =>
            <PerfumeItem
              key={p.id}
              perfume={p}
            />
          )}
        </div>

        : <p className='empty-list'>No Perfuems Here</p>
      }
    </div>
  );
}