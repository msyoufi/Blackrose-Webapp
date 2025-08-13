import { type ChangeEvent, useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { matchString, sortByKey } from '../../../shared/utils/utils';
import { useSnackbar } from '../../../shared/components/snackbar';
import { usePerfumeForm } from '../perfume-form/perfume_form';
import './perfumes-grid-header.scss';

export default function PerfumesGridHeader({
  perfumes,
  initialPerfumes,
  setPerfumes
}: {
  perfumes: Perfume[],
  initialPerfumes: Perfume[],
  setPerfumes: (perfumes: Perfume[]) => void,
}) {
  const [searchValue, setSearchValue] = useState<string>('');
  const [lastSortingKey, setLastSortingKey] = useState<keyof Perfume>('name');
  const [reversed, setReversed] = useState(false);

  const perfumeForm = usePerfumeForm();
  const snackbar = useSnackbar();

  useEffect(() => {
    const sorted = sortByKey(initialPerfumes, lastSortingKey, reversed);
    setPerfumes(sorted);

  }, [initialPerfumes]);

  function handleSearch(e: ChangeEvent<HTMLInputElement>): void {
    const query = e.target.value
    setSearchValue(query);

    if (!query)
      return setPerfumes(initialPerfumes);

    const found = perfumes.filter(({ brand, name }) =>
      matchString(brand, query) || matchString(name, query)
    );

    setPerfumes(found);
  }

  function handleSort(key: keyof Perfume): void {
    const nextReversed = lastSortingKey === key && !reversed;
    const sorted = sortByKey(perfumes, key, nextReversed);

    setPerfumes(sorted);
    setReversed(nextReversed);
    setLastSortingKey(key);
  }

  async function createPDF(): Promise<void> {
    try {
      // TODO
      snackbar.show('PDF created successfully');

    } catch (err: unknown) {
      snackbar.show('Unable to create a PDF file!', 'error');
    }
  }

  return (
    <div className="perfumes-grid-header">
      <div className="header-buttons-box">
        <Button variant='contained' onClick={() => perfumeForm.open()}>
          New Perfume +
        </Button >

        <Button variant='contained' color='warning' onClick={createPDF}>
          Create PDF
        </Button >
      </div>

      <div className="search-filter-wrapper">
        <TextField type='search' size='small' placeholder='Search'
          value={searchValue}
          onInput={handleSearch}
        />

        <div className="sort-box">
          <p>Total: {perfumes.length} |</p>
          <p>Sort By:</p>

          {sortingKeys.map(key =>
            <a key={key} onClick={() => handleSort(key)}>
              {key}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const sortingKeys: (keyof Perfume)[] = ['name', 'sex'];