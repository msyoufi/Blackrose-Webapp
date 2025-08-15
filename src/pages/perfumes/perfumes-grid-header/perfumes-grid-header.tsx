import { useState, type ChangeEvent } from 'react';
import { Button, CircularProgress, MenuItem, TextField } from '@mui/material';
import { useSnackbar } from '../../../shared/components/snackbar';
import { usePerfumeForm } from '../perfume-form/perfume_form';
import { downloadAllImagesAsDataUrl, generatePerfumesPDF } from '../../../shared/services/pdf.service';
import { PerfumeCollection } from '../../../shared/data/perfumes.data';
import './perfumes-grid-header.scss';

export default function PerfumesGridHeader({
  allPerfumes,
  searchValue,
  displayCount,
  setSearchValue,
  setPage
}: {
  allPerfumes: Perfume[],
  searchValue: string,
  displayCount: number,
  setSearchValue: (val: string) => void,
  setPage: (val: number) => void,
}) {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [collection, setCollection] = useState<PerfumeCollection | 'All'>('All');
  const perfumeForm = usePerfumeForm();
  const snackbar = useSnackbar();

  function handleSearch(e: ChangeEvent<HTMLInputElement>): void {
    const query = e.target.value;
    setSearchValue(query);
    setPage(1);
  }

  function handlecollectionChange(e: ChangeEvent<HTMLInputElement>): void {
    const nextCollection = e.target.value as PerfumeCollection | 'All';
    setCollection(nextCollection);
  }

  async function createPDF(): Promise<void> {
    setLoadingPDF(true);

    try {
      const perfumesWithImages = await downloadAllImagesAsDataUrl(allPerfumes);
      await generatePerfumesPDF(perfumesWithImages);

      snackbar.show('PDF created successfully');

    } catch (err: unknown) {
      snackbar.show('Unable to create a PDF file!', 'error');

    } finally {
      setLoadingPDF(false);
    }
  }

  return (
    <div className="perfumes-grid-header">
      <div className="header-buttons-box">
        <Button variant='contained' onClick={() => perfumeForm.open()}>
          New Perfume +
        </Button >

        <Button
          variant='contained'
          color='warning'
          disabled={loadingPDF}
          onClick={createPDF}
        >
          {loadingPDF ? <CircularProgress size={24} /> : 'Create PDF'}
        </Button >
      </div>

      <div className="search-filter-wrapper">
        <TextField type='search' size='small' placeholder='Search Name or Brand'
          value={searchValue}
          onInput={handleSearch}
        />

        <div className="collection-display-box">
          <TextField
            id='collection'
            name='collection'
            label='Collection'
            size='small'
            value={collection}
            onChange={handlecollectionChange}
            select required
          >
            <MenuItem key='All' value='All'>ALL</MenuItem>
            {PerfumeCollection.map(option =>
              <MenuItem key={option} value={option}>{option}</MenuItem>
            )}
          </TextField>

          <span className='counter-display'>
            {searchValue
              ? `"${searchValue}" : ${displayCount}`
              : `All: ${allPerfumes.length}`}
          </span>
        </div>
      </div>
    </div>
  );
}