type Override<T, U> = Omit<T, keyof U> & U;

interface PDFConfig {
  collection: PerfumeCollection | 'All',
  sex: PerfumeSex | 'All'
}
