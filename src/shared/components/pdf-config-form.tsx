import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Button } from '@mui/material';
import CollectionSelectMenu from './collection-select-menu';
import SexSelectMenu from './sex-select-menu';

const PDFConfigContext = createContext<PDFConfigContext | null>(null);

export function usePDFConfigForm(): PDFConfigContext {
  const context = useContext(PDFConfigContext);
  if (!context) throw new Error('PDF config form must be used inside a context');

  return context;
}

export function PDFConfigFormProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collection, setCollection] = useState<PerfumeCollection | 'All'>('All');
  const [sex, setSex] = useState<PerfumeSex | 'All'>('All');
  const [resolvePromise, setResolvePromise] = useState<((answer: PDFConfig | null) => void) | null>(null);

  const ask = useCallback(() => {
    setOpen(true);

    return new Promise<PDFConfig>(resolve => {
      setResolvePromise(() => resolve);
    });
  }, []);

  function handleClose(answer: PDFConfig | null): void {
    resolvePromise && resolvePromise(answer);

    setOpen(false);
    setCollection('All');
    setSex('All');
    setResolvePromise(null);
  }

  return (
    <PDFConfigContext value={{ ask }} >
      {children}

      {open && <div className="overlay">
        <form
          className='overlay-content-container'
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            maxWidth: '400px'
          }}
        >
          <p>
            Please Select a Collection
          </p>

          <CollectionSelectMenu
            value={collection}
            onChange={setCollection}
            required={true}
          />

          <SexSelectMenu
            value={sex}
            onChange={setSex}
            required={true}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '.5rem',
            }}>
            <Button
              type='button'
              variant='contained'
              onClick={() => handleClose({ sex, collection })}
            >
              Create PDF
            </Button >

            <Button
              type='reset'
              variant='outlined'
              color='warning'
              onClick={() => handleClose(null)}
            >
              Cancle
            </Button >
          </div>
        </form>
      </div >}
    </PDFConfigContext>
  );
}