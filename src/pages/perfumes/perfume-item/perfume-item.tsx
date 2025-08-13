import { useConfirmationDialog } from '../../../shared/components/confirmation-dialog';
import { deletePerfume } from '../../../shared/components/services/perfume.service';
import { useSnackbar } from '../../../shared/components/snackbar';
import { Button } from '@mui/material';
import './perfume-item.scss';

export default function PerfumeItem({
  perfume,
  removePerfumeLocaly
}: {
  perfume: Perfume,
  removePerfumeLocaly: (id: number) => void
}) {
  const { id, brand, name, sex, size, price, type, image_url, in_stock } = perfume;
  const confirmDialog = useConfirmationDialog();
  const snackbar = useSnackbar();

  async function handleRemove(): Promise<void> {
    const confirm = await confirmDialog.ask(
      `Remove ${name}`,
      `Remove ${name} - ${brand} permanently?`,
      'Remove'
    );

    if (!confirm) return;

    try {
      await deletePerfume(id);
      removePerfumeLocaly(id);
      snackbar.show('Perfume removed');

    } catch (err: unknown) {
      snackbar.show('Unable to remove the perfume!', 'error');
    }
  }

  return (
    <div className={'perfume-item' + (in_stock ? '' : ' out-of-stock')}>
      <img src={image_url
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
        <p>{type} - {sex}</p>
        {/* TODO: set the price unit */}
        <p>{size} ml | {price} USh</p>
      </div>

      <div className="perfume-buttons-box">
        <Button
          size='small'
          variant='outlined'
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