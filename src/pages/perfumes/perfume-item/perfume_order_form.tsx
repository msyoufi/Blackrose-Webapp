import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { usePerfumes } from "../../../shared/context/perfumes.provider";
import { useSnackbar } from "../../../shared/components/snackbar";

const PerfumeOrderFormContext = createContext<PerfumeOrderFormContext | null>(null);

export function usePerfumeOrderForm(): PerfumeOrderFormContext {
  const context = useContext(PerfumeOrderFormContext);
  if (!context) throw new Error('Perfume Order Form musst be used in a context');

  return context;
}

export function PerfumeOrderFormProvider({ children }: { children: ReactNode }) {
  const [formOpen, setFormOpen] = useState(false);
  const [perfumeId, setPerfumeId] = useState('');
  const [order, setOrder] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);
  const [allPerfumes] = usePerfumes();
  const snackbar = useSnackbar();

  useEffect(() => {

  }, [order]);

  function handleChange(e: ChangeEvent<any>): void {
    const nextOrder = e.target.value;

    setOrder(nextOrder);
    setFormValid(formRef.current?.checkValidity() ?? false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(perfumeId)
      console.log(order)

      snackbar.show('New Order Saved');
      close();

    } catch (err: unknown) {
      console.log(err);
      snackbar.show('Cannot reorder the perfumes', 'error', 4000);

    } finally {
      setIsLoading(false);
    }
  }

  const open = useCallback((perfumeId: string, order: number) => {
    setPerfumeId(perfumeId);
    setOrder(order);
    setFormOpen(true);
  }, []);

  const close = useCallback(() => {
    setFormOpen(false);
    setPerfumeId('');
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
            <p>Select Order</p>

            <Button type='reset' onClick={close} disabled={isLoading}>
              X
            </Button>
          </div>

          <TextField
            id='order'
            name='order'
            type='number'
            label='Order'
            size='small'
            value={order || ''}
            slotProps={{
              htmlInput: {
                min: 1,
                max: allPerfumes.length + 1
              }
            }}
            onChange={handleChange}
            required
          />

          <div className="buttons-bar">
            <Button type='submit' disabled={!formValid || isLoading}>
              {isLoading ? <CircularProgress size={20} /> : 'Save'}
            </Button>

            <Button type='reset' onClick={close} disabled={isLoading}>
              Cancle
            </Button>
          </div>
        </form>
      </div>}

    </PerfumeOrderFormContext >
  );
}