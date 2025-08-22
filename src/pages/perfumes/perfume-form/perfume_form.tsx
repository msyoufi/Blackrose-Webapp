import { type ChangeEvent, createContext, type FormEvent, type ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { MenuItem, TextField, Button, FormControlLabel, CircularProgress } from '@mui/material';
import { useSnackbar } from '../../../shared/components/snackbar';
import { FragranceConcentrations, PerfumeCollection, PerfumeSex } from '../../../shared/data/perfumes.data';
import { createPerfume, updatePerfume } from '../../../shared/services/perfume.db.service';
import { uploadImage } from '../../../shared/services/images.storage.service';
import { usePerfumes } from '../../../shared/context/perfumes.provider';
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
  const [formValid, setFormValid] = useState(false);
  const [allPerfumes] = usePerfumes();

  const formRef = useRef<HTMLFormElement | null>(null);
  const snackbar = useSnackbar();

  const formMode = formData.hasOwnProperty('id') ? 'edit' : 'add';

  const { id, brand, name, collection, sex, concentration, fragrance_type, inspired_by, size, price } = formData;

  function handleChange(e: ChangeEvent<any>): void {
    let { name, value, valueAsNumber, type } = e.target;

    if (type === 'number') {
      value = Number.isNaN(valueAsNumber) ? '' : valueAsNumber;
    }

    if (type === 'file') {
      const file = getImageFile(e);
      return setImgFile(file);
    }

    setFormValid(formRef.current?.checkValidity() ?? false);
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
        formData.order = allPerfumes.filter(p => p.collection === formData.collection).length + 1;
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
    setFormValid(false);
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
              id='name'
              name='name'
              label='Name'
              size='small'
              value={name}
              required autoFocus
            />

            <div className="half-input-wrapper">
              <TextField
                id='brand'
                name='brand'
                label='Brand'
                size='small'
                value={brand}
                required
              />

              <TextField
                id='inspired_by'
                name='inspired_by'
                label='Inspired By'
                size='small'
                value={inspired_by}
              />
            </div>

            <div className="half-input-wrapper">
              <TextField
                id='collection'
                name='collection'
                label='Collection'
                size='small'
                value={collection}
                onChange={handleChange}
                select required
              >
                <MenuItem key={0} value='' disabled hidden></MenuItem>
                {PerfumeCollection.map(option =>
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                )}
              </TextField>

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
            </div>

            <TextField
              id='concentration'
              name='concentration'
              label='Fragrance Concentration'
              size='small'
              value={concentration}
              onChange={handleChange}
              select
            >
              {FragranceConcentrations.map((option, i) =>
                <MenuItem key={i} value={option}>{option || 'N/A'}</MenuItem>
              )}
            </TextField>

            <TextField
              id='fragrance_type'
              name='fragrance_type'
              label='Fragrance Type'
              size='small'
              value={fragrance_type}
            />

            <div className="half-input-wrapper">
              <TextField
                id='size'
                name='size'
                type='number'
                label='Size (ml)'
                size='small'
                value={size || ''}
                slotProps={{ htmlInput: { min: 1 } }}
                required
              />

              <TextField
                id='price'
                name='price'
                type='number'
                label='Price (1000 UGX)'
                size='small'
                value={price || ''}
                slotProps={{ htmlInput: { min: 1 } }}
                required
              />
            </div>

            <FormControlLabel
              label="Image"
              labelPlacement='start'
              style={{ margin: 0, paddingLeft: '.5rem' }}
              control={
                <TextField
                  id="image"
                  name='image'
                  type='file'
                  size='small'
                  style={{ marginLeft: 'auto', paddingLeft: '.5rem' }}
                  slotProps={{ htmlInput: { accept: 'image/*' } }}
                />
              }
            />
          </div>

          <div className="buttons-bar">
            <Button
              type='reset'
              variant='outlined'
              onClick={close} disabled={isLoading}
            >
              Cancle
            </Button>

            <Button
              type='submit'
              color='success'
              variant='contained'
              disabled={!formValid || isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : 'Save'}
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
  collection: '',
  concentration: '',
  fragrance_type: '',
  inspired_by: '',
  size: '',
  price: '',
  image_url: '',
  order: 0
};