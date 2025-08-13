import { type ChangeEvent } from 'react';
import { Button, TextField } from '@mui/material';
import { useSnackbar } from '../../../shared/components/snackbar';
import { usePerfumeForm } from '../perfume-form/perfume_form';
import './perfumes-grid-header.scss';

export default function PerfumesGridHeader({
  allPerfumes,
  searchValue,
  setSearchValue,
  setPage
}: {
  allPerfumes: Perfume[],
  searchValue: string,
  setSearchValue: (val: string) => void,
  setPage: (val: number) => void,
}) {
  const perfumeForm = usePerfumeForm();
  const snackbar = useSnackbar();

  function handleSearch(e: ChangeEvent<HTMLInputElement>): void {
    const query = e.target.value;
    setSearchValue(query);
    setPage(1);
  }

  async function createPDF(): Promise<void> {
    try {
      // TODO
      console.log('PDF for: ', allPerfumes);
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
        <TextField type='search' size='small' placeholder='Search Name or Brand'
          value={searchValue}
          onInput={handleSearch}
        />

        <p>Total: {allPerfumes.length}</p>
      </div>
    </div>
  );
}