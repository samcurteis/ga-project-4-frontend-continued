import React from 'react';
import { Button } from '@mui/material';

export default function CommonButton({
  children,
  onClick,
  color,
  size,
  name,
  id,
  className,
  sx
}) {
  const styles = {
    color: 'black',
    '&:hover': { color: '#ef7b45', cursor: 'pointer' }
  };
  return (
    <Button
      className={className}
      onClick={onClick}
      color={color}
      size={size}
      name={name}
      id={id}
      sx={[sx, styles]}
    >
      {children}
    </Button>
  );
}
