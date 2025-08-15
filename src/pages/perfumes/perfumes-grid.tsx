import { useEffect, useState } from 'react';
import { usePerfumes } from '../../shared/services/perfume.db.service';
import PerfumesGridHeader from './perfumes-grid-header/perfumes-grid-header';
import PerfumeItem from './perfume-item/perfume-item';
import Paginator from '../../shared/components/paginator';
import { matchString } from '../../shared/utils/utils';
import './perfumes-grid.scss';

const PER_PAGE = 20;

export default function PerfumesGrid() {
  const allPerfumes = usePerfumes();
  const [displayPerfumes, setDisplayPerfumes] = useState<Perfume[]>([]);
  const [pagesCount, setPagesCount] = useState(Math.ceil(allPerfumes.length / PER_PAGE));
  const [searchValue, setSearchValue] = useState<string>('');
  const [collection, setCollection] = useState<PerfumeCollection | 'All'>('All');
  const [perfumesCount, setPerfumesCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const collectionPerfumes = collection === 'All'
      ? allPerfumes.slice()
      : allPerfumes.filter(p => p.collection === collection);

    const foundPerfumes = searchValue === ''
      ? collectionPerfumes.slice()
      : collectionPerfumes.filter(({ brand, name }) =>
        matchString(brand, searchValue) || matchString(name, searchValue)
      );

    const start = (page - 1) * PER_PAGE;
    const paginated = foundPerfumes.slice(start, start + PER_PAGE);

    setDisplayPerfumes(paginated);
    setPerfumesCount(foundPerfumes.length);
    setPagesCount(Math.ceil(foundPerfumes.length / PER_PAGE));

  }, [page, allPerfumes, searchValue, collection]);

  return (
    <div>
      <PerfumesGridHeader
        allPerfumes={allPerfumes}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        collection={collection}
        setCollection={setCollection}
        setPage={setPage}
        perfumesCount={perfumesCount}
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

        : <p className='empty-list'>No Perfumes Here</p>
      }

      <Paginator
        page={page}
        count={pagesCount}
        onChange={(_, val) => { setPage(val); scroll(0, 0); }}
      />
    </div>
  );
}