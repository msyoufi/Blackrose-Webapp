import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { db } from "../../firebase";

const PerfumesContext = createContext<PerfumesContext | null>(null);

export function usePerfumes(): PerfumesContext {
  const context = useContext<PerfumesContext | null>(PerfumesContext);
  if (!context) throw new Error('Perfuems must be used inside a context!');

  return context;
}

export function PerfumesProvider({ children }: { children: ReactNode }) {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    try {
      const q = query(collection(db, 'perfumes'), orderBy('order'));

      return onSnapshot(q, querySnapshot => {
        const nextPerfumes: Perfume[] = [];
        querySnapshot.forEach(doc => nextPerfumes.push({ ...doc.data(), id: doc.id } as Perfume));

        setPerfumes(nextPerfumes);
        setLoading(false);
      });

    } catch (err: unknown) {
      setError(err);
      setLoading(false);
    }
  }, []);

  return (
    <PerfumesContext value={[perfumes, error, loading]}>
      {children}
    </PerfumesContext>
  );
}