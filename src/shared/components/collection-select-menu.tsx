import { MenuItem, TextField } from "@mui/material";
import { PerfumeCollection } from "../data/perfumes.data";

export default function CollectionSelectMenu({
  value,
  onChange,
  required = false
}: {
  value: PerfumeCollection | 'All',
  onChange: (val: PerfumeCollection | 'All') => void,
  required?: boolean
}) {
  return (
    <TextField
      id='collection'
      name='collection'
      label='Collection'
      size='small'
      value={value}
      onChange={e => onChange(e.target.value as PerfumeCollection | 'All')}
      required={required}
      select
    >
      <MenuItem key='All' value='All'>ALL</MenuItem>
      {PerfumeCollection.map(option =>
        <MenuItem key={option} value={option}>{option}</MenuItem>
      )}
    </TextField>
  );
}