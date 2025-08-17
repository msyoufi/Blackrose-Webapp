import { useEffect, useState } from 'react';
import { usePerfumes } from '../../shared/services/perfume.db.service';
import PerfumesGridHeader from './perfumes-grid-header/perfumes-grid-header';
import PerfumeItem from './perfume-item/perfume-item';
import Paginator from '../../shared/components/paginator';
import { matchString } from '../../shared/utils/utils';
import { CollectionSelectProvider } from '../../shared/components/collection-select-form';
import { CircularProgress } from '@mui/material';
import './perfumes-grid.scss';

const PER_PAGE = 20;

export default function PerfumesGrid() {
  const [loadingPerfumes, error, allPerfumes] = usePerfumes();

  const [displayPerfumes, setDisplayPerfumes] = useState<Perfume[]>([]);
  const [pagesCount, setPagesCount] = useState(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [collection, setCollection] = useState<PerfumeCollection | 'All'>('All');
  const [sex, setSex] = useState<PerfumeSex | 'All'>('All');
  const [perfumesCount, setPerfumesCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // handle collection selection
    const collectionPerfumes = collection === 'All'
      ? allPerfumes.slice()
      : allPerfumes.filter(p => p.collection === collection);

    // handle sex selection
    const sexFiltered = sex === 'All'
      ? collectionPerfumes
      : collectionPerfumes.filter(p => p.sex === sex);

    // handle search query
    const foundPerfumes = searchValue === ''
      ? sexFiltered
      : sexFiltered.filter(({ brand, name, fragrance_type }) =>
        [brand, name, fragrance_type]
          .map(val => matchString(val, searchValue))
          .some(result => result)
      );

    const start = (page - 1) * PER_PAGE;
    const paginated = foundPerfumes.slice(start, start + PER_PAGE);

    setDisplayPerfumes(paginated);
    setPerfumesCount(foundPerfumes.length);
    setPagesCount(Math.ceil(foundPerfumes.length / PER_PAGE));

  }, [page, allPerfumes, searchValue, collection, sex]);

  return (
    <div>
      <CollectionSelectProvider>
        <PerfumesGridHeader
          allPerfumes={allPerfumes}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          collection={collection}
          setCollection={setCollection}
          sex={sex}
          setSex={setSex}
          setPage={setPage}
          perfumesCount={perfumesCount}
        />
      </CollectionSelectProvider>

      {loadingPerfumes

        ? <div className="empty-list">
          <CircularProgress size={40} />
        </div>

        : displayPerfumes.length

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