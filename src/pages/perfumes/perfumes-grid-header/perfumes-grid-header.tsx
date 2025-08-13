import { type ChangeEvent, useEffect, useState } from 'react';
import { Button, FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';
import { capitalize, search, sortByKey } from '../../../shared/utils/utils';
import { useSnackbar } from '../../../shared/components/snackbar';
import { PerfumeSex } from '../../../shared/data/perfumes.data';
import './perfumes-grid-header.scss';
import { usePerfumeForm } from '../perfume-form/perfume_form';

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
  const [searchTarget, setSearchTarget] = useState<'brand' | 'name'>('name');
  const [lastSortingKey, setLastSortingKey] = useState<keyof Perfume>('name');
  const [reversed, setReversed] = useState(false);
  const [sexFilter, setSexFilter] = useState<PerfumeSex | 'All'>('All');

  const perfumeForm = usePerfumeForm();
  const snackbar = useSnackbar();

  useEffect(() => {
    const filtered = filterBySex(sexFilter);
    const sorted = sortByKey(filtered, lastSortingKey, reversed);
    setPerfumes(sorted);

  }, [initialPerfumes]);

  function handleSearch(query: string): void {
    setSearchValue(query);

    if (!query)
      return setPerfumes(initialPerfumes);

    const found = search(perfumes, searchTarget, query);
    setPerfumes(found);
  }

  function handleSerachTargetChange(e: ChangeEvent<HTMLInputElement>): void {
    const currTarget = e.target.value as 'brand' | 'name';
    const nextTarget = currTarget === 'brand' ? 'name' : 'brand';

    setSearchTarget(nextTarget);
  }

  function handleSort(key: keyof Perfume): void {
    const nextReversed = lastSortingKey === key && !reversed;
    const sorted = sortByKey(perfumes, key, nextReversed);

    setPerfumes(sorted);
    setReversed(nextReversed);
    setLastSortingKey(key);
  }

  function handleSexFilterChange(value: typeof sexFilter): void {
    const filtered = filterBySex(value);
    setSexFilter(value);
    setSearchValue('');
    setPerfumes(filtered);
  }

  function filterBySex(value: typeof sexFilter): Perfume[] {
    if (value === 'All')
      return initialPerfumes;

    return initialPerfumes.filter(p => p.sex === value || p.sex === 'Unisex');
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
      <div className="search-filter-wrapper">
        <div className="search-box">
          <FormControlLabel label={capitalize(searchTarget)}
            labelPlacement='start'
            control={
              <Switch id='search_target' name='search_target'
                value={searchTarget}
                checked={searchTarget === 'name'}
                onChange={handleSerachTargetChange}
              />
            }
          />

          <TextField type='search' size='small' placeholder='Search'
            value={searchValue}
            onInput={e => handleSearch((e.target as HTMLInputElement).value)}
          />
        </div>

        <div className="filters-box">
          <div>
            <span>Sort By:</span>

            {sortingKeys.map(key =>
              <Button key={key} onClick={() => handleSort(key)}>
                {key}
              </Button >
            )}
          </div>

          <TextField id='sex' name='sex' label='Filter By Sex' size='small' value={sexFilter} select required
            onChange={e => {
              const value = e.target.value as typeof sexFilter;
              handleSexFilterChange(value);
            }}
          >
            <MenuItem key={'All'} value={'All'}>ALL</MenuItem>

            {PerfumeSex.map(option =>
              <MenuItem key={option} value={option}>{option}</MenuItem>
            )}
          </TextField>
        </div>
      </div>

      <div className="header-buttons-box">
        <Button variant='contained' onClick={() => perfumeForm.open()}>
          New Perfume +
        </Button >

        <Button variant='contained' color='warning' onClick={createPDF}>
          Create PDF
        </Button >

        <p>Total: {perfumes.length} | {sexFilter}</p>
      </div>
    </div>
  );
}

const sortingKeys: (keyof Perfume)[] = ['brand', 'name', 'price'];