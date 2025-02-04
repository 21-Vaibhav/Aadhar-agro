import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const StyledHeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '80vh',
  [theme.breakpoints.down('sm')]: {
    height: '70vh',
  },
  '& .swiper': {
    height: '100%',
  },
  '& .swiper-pagination-bullet': {
    backgroundColor: '#fff',
    opacity: 0.7,
    '&.swiper-pagination-bullet-active': {
      opacity: 1,
    },
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  height: 280,
  [theme.breakpoints.down('sm')]: {
    height: 220,
  },
  '&:hover': {
    '& .MuiCardMedia-root': {
      transform: 'scale(1.1)',
    },
    '& .overlay': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
}));

const slides = [
  {
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80",
    title: "WELCOME TO AADHAR AGRO",
    heading: "ದೇಶದ ಕೃಷಿಯ ಆಧಾರ",
    description: "Rooted in expertise,driven by innovation"
  },
  {
    image: "https://images.unsplash.com/photo-1606768666857-978d8f7f6c1f?auto=format&fit=crop&w=1920&q=80",
    title: "SPECIAL OFFER",
    heading: "Premium NPK Fertilizers",
    description: "Get 20% off on our premium range of fertilizers."
  },
  {
    image: "https://images.unsplash.com/photo-1597589827583-448c374bb9b6?auto=format&fit=crop&w=1920&q=80",
    title: "NEW ARRIVAL",
    heading: "Eco-Friendly Solutions",
    description: "Sustainable products for a greener tomorrow."
  }
];

const features = [
  {
    title: "We're using a tech to improve fertilizer access to remote places!",
    image: 'https://images.unsplash.com/photo-1655130944281-072e0644db75?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZlcnRpbGl6ZXJ8ZW58MHx8MHx8fDI%3D',
    description: "Advanced Web-app for easy access to fertilizers"
  },
  {
    title: "100% legit products available",
    image: "https://images.unsplash.com/photo-1558906307-1a1c52b5ac8a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVydGlsaXplcnxlbnwwfHwwfHx8Mg%3D%3D",
    description: "Certified products which produce good yields"
  },
  {
    title: "Reforming in the systems",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=60",
    description: "Innovative agricultural solutions"
  }
];

const categories = [
  {
    title: 'Fungicides',
    image: 'https://media.gettyimages.com/id/968398890/photo/a-bottle-of-luna-fungicide-produced-by-bayer-cropscience-ag-stands-beside-farm-buildings-in.jpg?s=612x612&w=gi&k=20&c=nR8xQmfmGQl27L-z8zJNytwsBXKdUMfngSQi63oy8i4=',
    description: 'Combat plant diseases'
  },
  {
    title: 'Pesticides',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/12/366454992/GF/WW/XI/74067162/pesticide-packaging-box-make-in-india.jpg',
    description: 'Combat plant diseases'
  },
  {
    title: 'Herbicides',
    image: 'https://media.istockphoto.com/id/958953510/photo/agricultural-worker-takes-care-of-his-estate.jpg?s=612x612&w=0&k=20&c=asNVXLUWqkGa5DKVFo9Z3WWoTu9Hj5DCUuIPbvcpPOQ=',
    description: 'Smart weed control solutions for-fresh vegetables'
  },
  {
    title: 'Growth Regulators',
    image: 'https://media.istockphoto.com/id/958953510/photo/agricultural-worker-takes-care-of-his-estate.jpg?s=612x612&w=0&k=20&c=asNVXLUWqkGa5DKVFo9Z3WWoTu9Hj5DCUuIPbvcpPOQ=',
    description: 'Growth regulators for optimal crop growth'
  },
];

const stats = [
  { label: 'Agriculture Products', value: '500+' },
  { label: 'Orders Completed', value: '20000+' },
  { label: 'Satisfied Farmers', value: '1000+' },
  { label: 'Certified product companies', value: '50+' },
];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {/* Hero Section */}
      <StyledHeroSection>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  '&::before': {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3))",
                    zIndex: 1,
                  }
                }}
              >
                <Container sx={{ position: "relative", zIndex: 2, color: '#ffffff' }}>
                  <Box maxWidth={{ xs: '100%', md: '600px' }}>
                    <Typography
                      variant="h6"
                      sx={{ 
                        mb: 2, 
                        color: theme.palette.secondary.main,
                        fontSize: { xs: '1rem', md: '1.25rem' }
                      }}
                    >
                      {slide.title}
                    </Typography>
                    <Typography 
                      variant="h1" 
                      sx={{ 
                        mb: 3, 
                        fontWeight: 700,
                        color: '#ffffff',
                        fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }
                      }}
                    >
                      {slide.heading}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 4, 
                        opacity: 0.9,
                        color: '#ffffff',
                        fontSize: { xs: '1rem', md: '1.25rem' }
                      }}
                    >
                      {slide.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size={isMobile ? "medium" : "large"}
                      sx={{ mr: 2 }}
                    >
                      Discover More
                    </Button>
                  </Box>
                </Container>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </StyledHeroSection>

      {/* Features Section */}
      <Container sx={{ py: { xs: 4, md: 8 } }}>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard>
                <CardMedia
                  component="img"
                  height={isMobile ? "160" : "200"}
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: { xs: 4, md: 8 } }}>
        <Container>
          <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1920&q=80"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                color="primary"
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                Our Introduction
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >

              Fertilizers & Growth Solutions
              <br />
              Nurturing Soil, Growing Prosperity
              </Typography>
              <Typography 
                color="text.secondary" 
                sx={{ 
                  mb: 4,
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
              Aadhar Agro is your trusted one-stop store for high-quality fertilizers, offering sustainable solutions to boost crop yields and support farmers in achieving prosperous harvests.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size={isMobile ? "medium" : "large"}
                endIcon={<PlayArrowIcon />}
              >
                Discover More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant="subtitle1"
          color="primary"
          align="center"
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          Our Range of Products
        </Typography>
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ 
            mb: { xs: 3, md: 6 },
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          What We Offer
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <CategoryCard>
                <StyledCardMedia
                  image={category.image}
                  title={category.title}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    p: { xs: 2, md: 3 },
                    transition: 'background-color 0.3s',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white', 
                      mb: 1,
                      fontSize: { xs: '1.1rem', md: '1.25rem' }
                    }}
                  >
                    {category.title}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                  >
                    Read More
                  </Button>
                </Box>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: theme.palette.primary.main, color: 'white', py: { xs: 4, md: 6 } }}>
        <Container>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 700,
                      fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;