import React from 'react';
import { Typography } from '@mui/material';

export default function CommonTypography({
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
    <Typography
      className={className}
      onClick={onClick}
      color={color}
      size={size}
      id={id}
      name={name}
      sx={[sx, styles]}
    >
      {children}
    </Typography>
  );
}
