import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Button } from '@mui/material';
import CollectionSelectMenu from './collection-select-menu';

const CollectionSelectContext = createContext<CollectionSelectContext | null>(null);

export function useCollectionSelect(): CollectionSelectContext {
  const context = useContext(CollectionSelectContext);
  if (!context) throw new Error('Collection select form must be used inside a context');

  return context;
}

export function CollectionSelectProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collection, setCollection] = useState<PerfumeCollection | 'All'>('All');
  const [resolvePromise, setResolvePromise] = useState<((answer: PerfumeCollection | 'All' | null) => void) | null>(null);

  const ask = useCallback(() => {
    setOpen(true);

    return new Promise<PerfumeCollection | 'All'>(resolve => {
      setResolvePromise(() => resolve);
    });
  }, []);

  function handleClose(answer: PerfumeCollection | 'All' | null): void {
    resolvePromise && resolvePromise(answer);

    setOpen(false);
    setCollection('All');
    setResolvePromise(null);
  }

  return (
    <CollectionSelectContext value={{ ask }} >
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
            collection={collection}
            setCollection={setCollection}
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
              onClick={() => handleClose(collection)}
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
    </CollectionSelectContext>
  );
}