import { useState, type ChangeEvent } from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useSnackbar } from '../../../shared/components/snackbar';
import { usePerfumeForm } from '../perfume-form/perfume_form';
import { downloadAllImagesAsDataUrl, generatePerfumesPDF } from '../../../shared/services/pdf.service';
import CollectionSelectMenu from '../../../shared/components/collection-select-menu';
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
  const [loadingPDF, setLoadingPDF] = useState(false);
  const perfumeForm = usePerfumeForm();
  const snackbar = useSnackbar();

  function handleSearch(e: ChangeEvent<HTMLInputElement>): void {
    const query = e.target.value;
    setSearchValue(query);
    setPage(1);
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
          <CollectionSelectMenu
            collection={collection}
            setCollection={setCollection}
          />

          <span className='counter-display'>
            {(searchValue ? `"${searchValue}": ` : 'All: ') + perfumesCount}
          </span>
        </div>
      </div>
    </div>
  );
}