import { MenuItem, TextField } from "@mui/material";
import { PerfumeCollection } from "../data/perfumes.data";

export default function CollectionSelectMenu({
  collection,
  onChange,
}: {
  collection: PerfumeCollection | 'All',
  onChange: (val: PerfumeCollection | 'All') => void,
}) {
  return (
    <TextField
      id='collection'
      name='collection'
      label='Collection'
      size='small'
      value={collection}
      onChange={e => onChange(e.target.value as PerfumeCollection | 'All')}
      select required
    >
      <MenuItem key='All' value='All'>ALL</MenuItem>
      {PerfumeCollection.map(option =>
        <MenuItem key={option} value={option}>{option}</MenuItem>
      )}
    </TextField>
  );
}