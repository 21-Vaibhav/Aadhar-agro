import React from 'react';
import { Box, Typography, Grid, useTheme, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Spa, Grass, BugReport, TrendingUp } from '@mui/icons-material';

const CategoryCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '350px',
  borderRadius: '20px',
  overflow: 'hidden',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10],
    '& .category-image': {
      transform: 'scale(1.1)',
    },
    '& .category-content': {
      transform: 'translateY(-20px)',
    },
    '& .category-button': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  },
  [theme.breakpoints.down('md')]: {
    height: '300px'
  },
}));

const categories = [
  { 
    name: 'Pesticides', 
    image: '/pesticides.jpg',
    icon: <BugReport sx={{ fontSize: '2.5rem' }} />,
    description: 'Protect your crops effectively'
  },
  { 
    name: 'Fungicides', 
    image: '/fungicides.jpg',
    icon: <Grass sx={{ fontSize: '2.5rem' }} />,
    description: 'Combat plant diseases'
  },
  { 
    name: 'Herbicides', 
    image: '/herbicides.jpg',
    icon: <Spa sx={{ fontSize: '2.5rem' }} />,
    description: 'Smart weed control solutions'
  },
  { 
    name: 'Growth Regulators', 
    image: '/growth-regulators.jpg',
    icon: <TrendingUp sx={{ fontSize: '2.5rem' }} />,
    description: 'Optimize plant development'
  },
];

const CategorySection = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      py: 10,
      px: { xs: 2, md: 6 }, 
      background: `linear-gradient(45deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Typography 
        variant="h2" 
        component="h2"
        sx={{ 
          textAlign: 'center',
          mb: 2,
          fontWeight: 900,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          position: 'relative',
          zIndex: 1,
        }}
      >
        Cultivation Essentials
      </Typography>

      <Typography 
        variant="subtitle1"
        sx={{
          textAlign: 'center',
          mb: 6,
          color: theme.palette.text.secondary,
          fontSize: '1.2rem',
          maxWidth: '800px',
          mx: 'auto',
          px: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Premium solutions for modern agriculture
      </Typography>

      <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.name}>
            <CategoryCard>
              <Box
                className="category-image"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(45deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              
              <Box className="category-content" sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 4,
                color: 'white',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'center',
              }}>
                <Box sx={{
                  mb: 2,
                  transform: 'translateY(20px)',
                  transition: 'transform 0.3s ease',
                  color: theme.palette.primary.light
                }}>
                  {category.icon}
                </Box>
                
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    mb: 1,
                    textShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    transform: 'scale(1)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {category.name}
                </Typography>
                
                <Typography 
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    mb: 2,
                    transform: 'translateY(10px)',
                    transition: 'all 0.3s ease',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {category.description}
                </Typography>

                <Button
                  className="category-button"
                  variant="contained"
                  size="small"
                  sx={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: 'all 0.3s ease',
                    borderRadius: '8px',
                    px: 3,
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'translateY(20px) scale(1.05)'
                    }
                  }}
                >
                  Explore Now →
                </Button>
              </Box>
            </CategoryCard>
          </Grid>
        ))}
      </Grid>

      {/* Decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: '-50%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: `radial-gradient(${theme.palette.primary.light} 0%, transparent 70%)`,
        opacity: 0.1,
        zIndex: 0,
      }} />
    </Box>
  );
};

export default CategorySection;