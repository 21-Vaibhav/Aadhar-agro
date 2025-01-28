import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const BannerContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '400px',
  background: `linear-gradient(rgba(46, 125, 50, 0.9), rgba(46, 125, 50, 0.7)), url('/banner-bg.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    height: '300px',
    padding: theme.spacing(2),
  },
}));

const Banner = () => {
  const theme = useTheme();

  return (
    <BannerContainer>
      <Box sx={{ maxWidth: '600px', color: 'white' }}>
        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            fontWeight: 700,
            mb: 2,
            [theme.breakpoints.down('md')]: { fontSize: '2rem' }
          }}
        >
          Premium Agricultural Solutions
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ mb: 3, fontSize: '1.2rem' }}
        >
          Quality Seeds • Organic Fertilizers • Smart Farming Tools
        </Typography>
        <Button 
          variant="contained" 
          color="secondary"
          size="large"
          sx={{ 
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: '8px'
          }}
        >
          Shop Now
        </Button>
      </Box>
    </BannerContainer>
  );
};

export default Banner;