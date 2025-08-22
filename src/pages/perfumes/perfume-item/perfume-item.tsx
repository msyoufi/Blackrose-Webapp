import { useState } from 'react';
import { useConfirmationDialog } from '../../../shared/components/confirmation-dialog';
import { deletePerfume, reorderPerfumes, updatePerfume, updatePerfumesOrder } from '../../../shared/services/perfume.db.service';
import { useSnackbar } from '../../../shared/components/snackbar';
import { Button, CircularProgress } from '@mui/material';
import { usePerfumeForm } from '../perfume-form/perfume_form';
import { deleteImage, uploadImage } from '../../../shared/services/images.storage.service';
import { formatCurrency } from '../../../shared/utils/utils';
import { downloadFileFromUrl, findImageUrl } from '../../../shared/services/image.search.service';
import { usePerfumeOrderForm } from './perfume_order_form';
import './perfume-item.scss';
import { usePerfumes } from '../../../shared/context/perfumes.provider';

export default function PerfumeItem({ perfume }: { perfume: Perfume }) {
  const { id, brand, name, sex, size, price, concentration, collection, image_url, order } = perfume;
  const [searching, setSearching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingImg, setLoadingImg] = useState(true);
  const [allPerfumes] = usePerfumes();

  const confirmDialog = useConfirmationDialog();
  const perfumeForm = usePerfumeForm();
  const perfumeOrderForm = usePerfumeOrderForm();
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

      // Reorder perfumes if deleted perfume is not the last one
      const lastOrder = allPerfumes.filter(p => p.collection === collection).length;

      if (order !== lastOrder) {
        const orderedPerfumes = reorderPerfumes(allPerfumes, perfume, order, true);
        await updatePerfumesOrder(orderedPerfumes);
      }

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

    setLoadingImg(true);

    try {
      await deleteImage(id);

      perfume.image_url = '';
      await updatePerfume(perfume);

      snackbar.show('Image removed');

    } catch (err: unknown) {
      snackbar.show('Unable to remove the image!', 'error');

    } finally {
      setLoadingImg(false);
    }
  }

  async function handleImageSearch(): Promise<void> {
    setSearching(true);
    setLoadingImg(true);

    try {
      const imgUrl = await findImageUrl(perfume);
      const imgBlob = await downloadFileFromUrl(imgUrl);
      const downloadUrl = await uploadImage(imgBlob, id);
      const newPerfume = { ...perfume, image_url: downloadUrl };

      await updatePerfume(newPerfume);

      snackbar.show('Image added');

    } catch (err: unknown) {
      let message = 'Image search failed';

      if (err instanceof Error) {
        message = err.message;
      }

      snackbar.show(message, 'error');

    } finally {
      setSearching(false);
      setLoadingImg(false);
    }
  }

  return (
    <div className='perfume-item'>
      <button
        className='order-button'
        onClick={() => perfumeOrderForm.open(perfume)}
      >
        {order}
      </button>

      {image_url
        ? <div className='image-box'>
          <img className='perfume-image'
            src={image_url}
            alt={'Image of the perfume ' + name + ' by ' + brand}
            onLoad={() => setLoadingImg(false)}
            onError={() => setLoadingImg(false)}
          />

          <button
            className='img-remove-button'
            onClick={handleImageDelete}
          >
            X
          </button>

          {loadingImg && <CircularProgress size={32} sx={{ position: "absolute" }} />}
        </div>

        : <img
          className='perfume-image'
          src='images/perfume-icon.png'
          alt='Genereic perfume image'
        />
      }

      <div className="perfume-infos-box">
        <p>ID: {id}</p>
        <p>{name} - {brand}</p>
        <p>{concentration} - {sex}</p>
        <p>{size} ml | {formatCurrency(price)} UGX</p>
      </div>

      <div className="perfume-buttons-box">
        <Button
          size='small'
          variant='outlined'
          onClick={() => perfumeForm.open(perfume)}
          disabled={searching}
        >
          Edit
        </Button>

        <Button
          size='small'
          variant='outlined'
          color='error'
          onClick={handleRemove}
          disabled={searching}
        >
          Remove
        </Button>

        {!image_url && <Button
          size='small'
          variant='outlined'
          color='secondary'
          onClick={handleImageSearch}
          disabled={searching}
        >
          {searching ? <CircularProgress size={25} color='secondary' /> : 'Image'}
        </Button>}
      </div>

      {deleting && <div className="delete-overlay">
        <CircularProgress size={20} />
      </div>}

    </div >
  );
}