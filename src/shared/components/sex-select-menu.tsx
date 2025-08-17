import { MenuItem, TextField } from "@mui/material";
import { PerfumeSex } from "../data/perfumes.data";

export default function SexSelectMenu({
  value,
  onChange,
  required = false
}: {
  value: PerfumeSex | 'All',
  onChange: (val: PerfumeSex | 'All') => void,
  required?: boolean
}) {
  return (
    <TextField
      id='sex'
      name='sex'
      label='Sex'
      size='small'
      value={value}
      onChange={e => onChange(e.target.value as PerfumeSex | 'All')}
      required={required}
      select
    >
      <MenuItem key='All' value='All'>ALL</MenuItem>
      {PerfumeSex.map(option =>
        <MenuItem key={option} value={option}>{option}</MenuItem>
      )}
    </TextField>
  );
}