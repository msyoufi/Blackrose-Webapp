import { useEffect, useState, type ChangeEvent } from 'react';
import { Button, TextField } from '@mui/material';
import { usePerfumeForm } from '../perfume-form/perfume_form';
import CollectionSelectMenu from '../../../shared/components/collection-select-menu';
import CreatePDFButton from './create-pdf-button';
import './perfumes-grid-header.scss';

export default function PerfumesGridHeader({
  allPerfumes,
  searchValue,
  setSearchValue,
  collection,
  setCollection,
  perfumesCount,
  setPage
}: {
  allPerfumes: Perfume[],
  searchValue: string,
  setSearchValue: (val: string) => void,
  collection: PerfumeCollection | 'All',
  setCollection: (val: PerfumeCollection | 'All') => void,
  perfumesCount: number,
  setPage: (val: number) => void,
}) {
  const [query, setQuery] = useState('');
  const perfumeForm = usePerfumeForm();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchValue(query);
      setPage(1);

    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query])

  function handleCollectionChange(collection: PerfumeCollection | "All"): void {
    setPage(1);
    setCollection(collection);
  }

  return (
    <div className="perfumes-grid-header">
      <div className="header-buttons-box">
        <Button variant='contained' onClick={() => perfumeForm.open()}>
          New Perfume +
        </Button >

        <CreatePDFButton allPerfumes={allPerfumes} />
      </div>

      <div className="search-filter-wrapper">
        <TextField type='search' size='small' placeholder='Name, Brand or Fragrance type'
          value={query}
          onInput={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        />

        <div className="collection-display-box">
          <CollectionSelectMenu
            collection={collection}
            onChange={handleCollectionChange}
          />

          <span className='counter-display'>
            {(searchValue ? `"${searchValue}": ` : 'All: ') + perfumesCount}
          </span>
        </div>
      </div>
    </div>
  );
}