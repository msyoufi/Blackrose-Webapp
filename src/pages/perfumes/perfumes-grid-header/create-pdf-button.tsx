import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useSnackbar } from '../../../shared/components/snackbar';
import { downloadAllImagesAsDataUrl, generatePerfumesPDF } from '../../../shared/services/pdf.service';
import { usePDFConfigForm } from '../../../shared/components/pdf-config-form';

export default function CreatePDFButton({ perfumes }: { perfumes: Perfume[] }) {
  const [loading, setLoading] = useState(false);

  const collectionSelectForm = usePDFConfigForm();
  const snackbar = useSnackbar();

  async function handleClick(): Promise<void> {
    const pdfConfig = await collectionSelectForm.ask();
    if (!pdfConfig) return;

    const { sex, collection } = pdfConfig;

    if (collection !== 'All')
      perfumes = perfumes.filter(p => p.collection === collection);

    if (sex !== 'All')
      perfumes = perfumes.filter(p => p.sex === 'Unisex' || p.sex === sex);

    if (!perfumes.length) {
      return snackbar.show(`${collection} collection for ${sex} is empty`, 'warning');
    }

    setLoading(true);

    try {
      const perfumesWithImages = await downloadAllImagesAsDataUrl(perfumes);
      await generatePerfumesPDF(perfumesWithImages, collection, sex);

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