import { Button } from '@mui/material';
import { usePerfumeForm } from '../perfume-form/perfume_form';
import './perfumes-grid-header.scss';

export default function PerfumesGridHeader() {
  const perfumeForm = usePerfumeForm();

  return (
    <div className="perfume-grid-header">
      <Button
        size='small'
        variant='contained'
        onClick={() => perfumeForm.open()}
      >
        New Perfume +
      </Button>
    </div>
  );
}