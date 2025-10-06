import { createContext, useCallback, useContext, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { usePerfumes } from "../../../shared/context/perfumes.provider";
import { useSnackbar } from "../../../shared/components/snackbar";
import { reorderPerfumes, updatePerfumesOrder } from "../../../shared/services/perfume.db.service";

const PerfumeOrderFormContext = createContext<PerfumeOrderFormContext | null>(null);

export function usePerfumeOrderForm(): PerfumeOrderFormContext {
  const context = useContext(PerfumeOrderFormContext);
  if (!context) throw new Error('Perfume Order Form musst be used in a context');

  return context;
}

export function PerfumeOrderFormProvider({ children }: { children: ReactNode }) {
  const [formOpen, setFormOpen] = useState(false);
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [order, setOrder] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);
  const [allPerfumes] = usePerfumes();
  const snackbar = useSnackbar();

  function handleChange(e: ChangeEvent<any>): void {
    const nextOrder = e.target.valueAsNumber;

    setOrder(nextOrder);
    setFormValid(formRef.current?.checkValidity() ?? false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!perfume) return;

    setIsLoading(true);

    try {
      const orderedPerfumes = reorderPerfumes(allPerfumes, perfume, order);
      await updatePerfumesOrder(orderedPerfumes);

      snackbar.show('New Order Saved');
      close();

    } catch (err: unknown) {
      snackbar.show('Cannot reorder the perfumes', 'error', 4000);

    } finally {
      setIsLoading(false);
    }
  }

  const open = useCallback((perfume: Perfume) => {
    setPerfume(perfume);
    setOrder(perfume.order);
    setFormOpen(true);
  }, []);

  const close = useCallback(() => {
    setFormOpen(false);
    setPerfume(null);
    setOrder(0);
    setFormValid(false);
  }, []);

  const contextValue = useMemo(() => ({ open, close }), [open, close]);

  return (
    <PerfumeOrderFormContext value={contextValue}>
      {children}

      {formOpen && <div className="overlay">
        <form className='overlay-content-container'
          ref={formRef}
          onSubmit={handleSubmit}
          style={{
            maxWidth: '400px',
            gap: '1rem'
          }}
        >
          <div className="form-header">
            <p>Set a New Order</p>

            <Button type='reset' onClick={close} disabled={isLoading}>
              X
            </Button>
          </div>

          <TextField
            id='order'
            name='order'
            type='number'
            label='New Order'
            size='small'
            value={order || ''}
            slotProps={{
              htmlInput: {
                min: 1,
                max: allPerfumes.length
              }
            }}
            onChange={handleChange}
            required autoFocus
          />

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
              variant='contained'
              color='success'
              disabled={!formValid || isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>}

    </PerfumeOrderFormContext >
  );
}