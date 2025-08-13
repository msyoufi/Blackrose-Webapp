import { useEffect, useState } from 'react';
import { usePerfumes } from '../../shared/services/perfume.service';
import PerfumesGridHeader from './perfumes-grid-header/perfumes-grid-header';
import PerfumeItem from './perfume-item/perfume-item';
import Paginator from '../../shared/components/paginator';
import { matchString } from '../../shared/utils/utils';
import './perfumes-grid.scss';

const PER_PAGE = 15;

export default function PerfumesGrid() {
  const allPerfumes = usePerfumes();
  const [displayPerfumes, setDisplayPerfumes] = useState<Perfume[]>([]);
  const [pagesCount, setPagesCount] = useState(Math.ceil(allPerfumes.length / PER_PAGE));
  const [searchValue, setSearchValue] = useState<string>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const found = allPerfumes.filter(({ brand, name }) =>
      matchString(brand, searchValue) || matchString(name, searchValue)
    );

    const start = (page - 1) * PER_PAGE;
    const paginated = found.slice(start, start + PER_PAGE);

    setDisplayPerfumes(paginated);
    setPagesCount(Math.ceil(found.length / PER_PAGE));

  }, [page, allPerfumes, searchValue]);

  return (
    <div>
      <PerfumesGridHeader
        allPerfumes={allPerfumes}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setPage={setPage}
      />

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

      <Paginator
        page={page}
        count={pagesCount}
        onChange={(_, val) => setPage(val)}
      />
    </div>
  );
}