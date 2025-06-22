import React from 'react';
import { Box, Typography } from '@mui/joy';

interface PageHeaderProps {
  title: string;
  description?: string | React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <Box sx={{ my: 3 }} >
      <Typography level="h1" component="h1" fontWeight="bold">
        {title}
      </Typography>
      {description && (
        <Typography level="body-md" sx={{ color: 'text.tertiary', mt: 2 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}; 