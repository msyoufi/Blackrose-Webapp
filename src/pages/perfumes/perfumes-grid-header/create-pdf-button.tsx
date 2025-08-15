import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useSnackbar } from '../../../shared/components/snackbar';
import { downloadAllImagesAsDataUrl, generatePerfumesPDF } from '../../../shared/services/pdf.service';
import { useCollectionSelect } from '../../../shared/components/collection-select-form';

export default function CreatePDFButton({ allPerfumes }: { allPerfumes: Perfume[] }) {
  const [loading, setLoading] = useState(false);

  const collectionSelectForm = useCollectionSelect();
  const snackbar = useSnackbar();

  async function handleClick(): Promise<void> {
    const collection = await collectionSelectForm.ask();
    if (!collection) return;

    setLoading(true);

    const perfumes = collection === 'All'
      ? allPerfumes
      : allPerfumes.filter(p => p.collection === collection);

    try {
      const perfumesWithImages = await downloadAllImagesAsDataUrl(perfumes);
      await generatePerfumesPDF(perfumesWithImages);

      snackbar.show('PDF created successfully');

    } catch (err: unknown) {
      snackbar.show('Unable to create a PDF file!', 'error');

    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant='contained'
      color='warning'
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? <CircularProgress size={24} /> : 'Create PDF'}
    </Button >
  );
}