import Pagination from '@mui/material/Pagination';

export default function Paginator({
  count,
  page,
  onChange
}: {
  count: number,
  page: number,
  onChange: (e: any, value: number) => any
}) {
  return (
    <Pagination
      page={page}
      className='paginator'
      count={count}
      color="primary"
      shape="rounded"
      size="small"
      onChange={onChange}
    />
  );
}