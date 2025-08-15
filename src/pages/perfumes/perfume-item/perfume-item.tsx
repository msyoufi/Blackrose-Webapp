import { useState } from 'react';
import { useConfirmationDialog } from '../../../shared/components/confirmation-dialog';
import { deletePerfume, updatePerfume } from '../../../shared/services/perfume.db.service';
import { useSnackbar } from '../../../shared/components/snackbar';
import { Button, CircularProgress } from '@mui/material';
import { usePerfumeForm } from '../perfume-form/perfume_form';
import { deleteImage, uploadImage } from '../../../shared/services/images.storage.service';
import { formatCurrency } from '../../../shared/utils/utils';
import { downloadFileFromUrl, findImageUrl } from '../../../shared/services/image.search.service';
import './perfume-item.scss';

export default function PerfumeItem({ perfume }: { perfume: Perfume }) {
  const { id, brand, name, sex, size, price, concentration, image_url, in_stock } = perfume;
  const [searching, setSearching] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const confirmDialog = useConfirmationDialog();
  const perfumeForm = usePerfumeForm();
  const snackbar = useSnackbar();

  async function handleRemove(): Promise<void> {
    const confirm = await confirmDialog.ask(
      'Remove Perfume',
      `Remove ${name} - ${brand}?`,
      'Remove'
    );

    if (!confirm) return;

    setDeleting(true);

    try {
      if (image_url)
        await deleteImage(id);

      await deletePerfume(id);

      snackbar.show('Perfume removed');

    } catch (err: unknown) {
      snackbar.show('Unable to remove the perfume!', 'error');

    } finally {
      setDeleting(false);
    }
  }

  async function handleImageDelete(): Promise<void> {
    const confirm = await confirmDialog.ask(
      'Remove Image',
      `Remove the image for ${name}?`,
      'Remove'
    );

    if (!confirm) return;

    try {
      await deleteImage(id);

      perfume.image_url = '';
      await updatePerfume(perfume);

      snackbar.show('Image removed');

    } catch (err: unknown) {
      snackbar.show('Unable to remove the image!', 'error');
    }
  }

  async function handleImageSearch(): Promise<void> {
    setSearching(true);

    try {
      const imgUrl = await findImageUrl(perfume);
      const imgBlob = await downloadFileFromUrl(imgUrl);
      const downloadUrl = await uploadImage(imgBlob, id);
      const newPerfume = { ...perfume, image_url: downloadUrl };

      await updatePerfume(newPerfume);

      snackbar.show('Image found and uploaded to the database');

    } catch (err: unknown) {
      let message = 'Image search failed';

      if (err instanceof Error) {
        message = err.message;
      }

      snackbar.show(message, 'error');

    } finally {
      setSearching(false);
    }
  }

  return (
    <div className={'perfume-item' + (in_stock ? '' : ' out-of-stock')}>
      {image_url && <button
        className='img-remove-button'
        onClick={handleImageDelete}
      >
        X
      </button>}

      <img className='perfume-image' src={image_url
        ? image_url
        : 'images/perfume-icon.png'
      }
        alt={image_url
          ? 'Image of the perfume ' + name + ' by ' + brand
          : 'Genereic perfume image'
        }
      />

      <div className="perfume-infos-box">
        <p>ID: {id}</p>
        <p>{name} - {brand}</p>
        <p>{concentration} - {sex}</p>
        <p>{size} ml | {formatCurrency(price)} USh</p>
      </div>

      <div className="perfume-buttons-box">
        <Button
          size='small'
          variant='outlined'
          onClick={() => perfumeForm.open(perfume)}
        >
          Edit
        </Button>

        <Button
          size='small'
          variant='outlined'
          color='error'
          onClick={handleRemove}
        >
          Remove
        </Button>

        <Button
          size='small'
          variant='outlined'
          color='secondary'
          onClick={handleImageSearch}
          disabled={searching}
        >
          {searching ? <CircularProgress size={25} color='secondary' /> : 'Image'}
        </Button>
      </div>

      {deleting && <div className="delete-overlay">
        <CircularProgress size={20} />
      </div>
      }

    </div>
  );
}