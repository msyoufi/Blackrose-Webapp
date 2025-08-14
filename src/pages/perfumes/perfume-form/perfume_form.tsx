import { type ChangeEvent, createContext, type FormEvent, type ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { MenuItem, TextField, Button, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { useSnackbar } from '../../../shared/components/snackbar';
import { FragranceConcentrations, PerfumeSex } from '../../../shared/data/perfumes.data';
import { createPerfume, updatePerfume } from '../../../shared/services/perfume.service';
import { uploadImage } from '../../../shared/services/images.service';
import './perfume_form.scss';

const PerfumeFormContext = createContext<PerfumeFormContext | null>(null);

export function usePerfumeForm(): PerfumeFormContext {
  const context = useContext(PerfumeFormContext);
  if (!context) throw new Error('Perfume Form musst be used in a context');

  return context;
}

export function PerfumeFormProvider({ children }: { children: ReactNode }) {
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<Perfume | PerfumeFormData>(NewPerfume);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const formRef = useRef<HTMLFormElement | null>(null);
  const snackbar = useSnackbar();

  const formMode = formData.hasOwnProperty('id') ? 'edit' : 'add';
  const { id, brand, name, sex, concentration, fragrance_type, size, price, in_stock } = formData;

  function handleChange(e: ChangeEvent<any>): void {
    let { name, value, valueAsNumber, type } = e.target;

    if (type === 'checkbox') {
      // The onchange event fires with the "current" checkbox value -value gets changed at the end of this function ;)-
      value = value === 'false';
    }

    if (type === 'number') {
      value = Number.isNaN(valueAsNumber) ? '' : valueAsNumber;
    }

    if (type === 'file') {
      const file = getImageFile(e);
      return setImgFile(file);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function getImageFile(e: any): File | null {
    const file = e.target.files[0] as File | undefined;
    if (!file) return null;

    if (!file.type.startsWith('image/')) {
      snackbar.show('Please select an image file!', 'error');
      return null;
    }

    return file;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    let message = 'Changes Saved';

    let perfumeId = formMode === 'add'
      ? new Date().getTime().toString()
      : formData.id as string;

    setIsLoading(true);

    try {
      if (imgFile) {
        formData.image_url = await uploadImage(imgFile, perfumeId);
      }

      if (formMode === 'add') {
        await createPerfume(perfumeId, formData as NewPerfume);
        message = 'New perfume added';

      } else {
        await updatePerfume(formData as Perfume);
      }

      snackbar.show(message);
      close();

    } catch (err: unknown) {
      snackbar.show('Unable to save the perfume to the database!', 'error', 5000);

    } finally {
      setIsLoading(false);
    }
  }

  const open = useCallback((perfume?: Perfume) => {
    const nextPerfume = perfume ?? NewPerfume;
    setFormData(nextPerfume);
    setFormOpen(true);
  }, []);

  const close = useCallback(() => {
    setFormOpen(false);
    setImgFile(null);
  }, []);

  const contextValue = useMemo(() => ({ open, close }), [open, close]);

  return (
    <PerfumeFormContext value={contextValue}>
      {children}

      {formOpen && <div className="overlay">
        <form className='overlay-content-container'
          ref={formRef}
          onSubmit={handleSubmit}
          onChange={handleChange}
        >
          <div className="form-header">
            <p>
              {formMode === 'add' ? 'New Perfume' : name}
            </p>

            <Button type='reset' onClick={close} disabled={isLoading}>
              X
            </Button>
          </div>

          {id && <input type="hidden" name="id" id="id" value={id} />}

          <div className="controls-grid">
            <TextField
              id='brand'
              name='brand'
              label='Brand'
              size='small'
              value={brand}
              required autoFocus
            />

            <TextField
              id='name'
              name='name'
              label='Name'
              size='small'
              value={name}
              required
            />

            <TextField
              id='sex'
              name='sex'
              label='Sex'
              size='small'
              value={sex}
              onChange={handleChange}
              select required
            >
              <MenuItem key={0} value='' disabled hidden></MenuItem>
              {PerfumeSex.map(option =>
                <MenuItem key={option} value={option}>{option}</MenuItem>
              )}
            </TextField>

            <TextField
              id='concentration'
              name='concentration'
              label='Fragrance Concentration'
              size='small'
              value={concentration}
              onChange={handleChange}
              select required
            >
              <MenuItem key={0} value='' disabled hidden></MenuItem>
              {FragranceConcentrations.map(option =>
                <MenuItem key={option} value={option}>{option}</MenuItem>
              )}
            </TextField>

            <TextField
              id='size'
              name='size'
              type='number'
              label='Size (ml)'
              size='small'
              value={size}
              slotProps={{ htmlInput: { min: 1, value: size === 0 ? '' : size } }}
              required
            />

            <TextField
              id='price'
              name='price'
              type='number'
              label='Price (1000 USh)'
              size='small'
              value={price}
              slotProps={{ htmlInput: { min: 1, value: price === 0 ? '' : price } }}
              required
            />

            <TextField
              id='fragrance_type'
              name='fragrance_type'
              label='Fragrance Type'
              size='small'
              value={fragrance_type}
            />

            <FormControlLabel
              label="Image"
              labelPlacement='start'
              style={{ margin: 0 }}
              control={
                <TextField
                  id="image"
                  name='image'
                  type='file'
                  size='small'
                  style={{ marginLeft: 'auto', paddingLeft: '1rem' }}
                  slotProps={{ htmlInput: { accept: 'image/*' } }}
                />
              }
            />

            <FormControlLabel
              label="In stock"
              className='in-stock-checkbox'
              control={
                <Switch
                  id='in_stock'
                  name='in_stock'
                  value={in_stock}
                  checked={in_stock}
                  onChange={handleChange}
                />
              }
            />
          </div>

          <div className="buttons-bar">
            <Button type='submit' disabled={!formRef.current?.checkValidity() || isLoading}>
              {isLoading ? <CircularProgress size={20} /> : 'Save'}
            </Button>

            <Button type='reset' onClick={close} disabled={isLoading}>
              Cancle
            </Button>
          </div>

        </form>
      </div>
      }

    </PerfumeFormContext>
  );
}

const NewPerfume: PerfumeFormData = {
  brand: '',
  name: '',
  sex: '',
  concentration: '',
  fragrance_type: '',
  size: '',
  price: '',
  in_stock: true,
  image_url: ''
};