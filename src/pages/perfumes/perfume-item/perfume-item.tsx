import { useConfirmationDialog } from '../../../shared/components/confirmation-dialog';
import { deletePerfume, updatePerfume } from '../../../shared/services/perfume.service';
import { useSnackbar } from '../../../shared/components/snackbar';
import { Button } from '@mui/material';
import { usePerfumeForm } from '../perfume-form/perfume_form';
import './perfume-item.scss';
import { deleteImage } from '../../../shared/services/images.service';

export default function PerfumeItem({ perfume }: { perfume: Perfume }) {
  const { id, brand, name, sex, size, price, concentration, image_url, in_stock } = perfume;
  const confirmDialog = useConfirmationDialog();
  const perfumeForm = usePerfumeForm();
  const snackbar = useSnackbar();

  async function handleRemove(): Promise<void> {
    const confirm = await confirmDialog.ask(
      `Remove ${name}`,
      `Remove ${name} - ${brand} permanently?`,
      'Remove'
    );

    if (!confirm) return;

    try {
      await deleteImage(id);
      await deletePerfume(id);

      snackbar.show('Perfume removed');

    } catch (err: unknown) {
      snackbar.show('Unable to remove the perfume!', 'error');
    }
  }

  async function handleImageDelete(): Promise<void> {
    const confirm = await confirmDialog.ask(
      `Remove Image`,
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

  return (
    <div className={'perfume-item' + (in_stock ? '' : ' out-of-stock')}>
      <div className="perfume-image-box">
        <img src={image_url
          ? image_url
          : 'images/perfume-icon.png'
        }
          alt={image_url
            ? 'Image of the perfume ' + name + ' by ' + brand
            : 'Genereic perfume image'
          }
        />

        {image_url && <button
          className='img-remove-button'
          onClick={handleImageDelete}
        >
          X
        </button>}
      </div>


      <div className="perfume-infos-box">
        <p>ID: {id}</p>
        <p>{name} - {brand}</p>
        <p>{concentration} - {sex}</p>
        {/* TODO: set the price unit */}
        <p>{size} ml | {price} USh</p>
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
      </div>
    </div>
  );
}