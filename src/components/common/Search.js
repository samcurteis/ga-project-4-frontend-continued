import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

export default function Search({ handleSearchChange }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => setQuery(e.target.value);

  useEffect(() => {
    if (query) {
      handleSearchChange(query);
    }
  }, [query, handleSearchChange]);

  return (
    <div>
      <TextField value={query} onChange={handleChange} />
    </div>
  );
}
