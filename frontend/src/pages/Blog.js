import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Pagination,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const BlogPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const postsPerPage = 6;

  // Sample blog post data - replace with your actual data fetching logic
  const samplePosts = [
    {
      id: 1,
      title: "Empowering Farmers Through Sustainable Practices",
      excerpt: "Learn how modern farming techniques are revolutionizing agriculture while maintaining environmental balance.",
      image: "https://kj1bcdn.b-cdn.net/media/99488/nanofertiliser.jpg",
      category: "Farming",
      date: "Feb 20, 2024"
    },
    {
      id: 2,
      title: "Science-Driven Approaches to Better Yields",
      excerpt: "Discover how our research-backed methods are helping farmers achieve better crop yields sustainably.",
      image: "https://media.istockphoto.com/id/1028041762/photo/farmer-harrowing-agricultural-field-by-a-large-harrowing-machine.jpg?s=612x612&w=0&k=20&c=4wltUeKKvYr88Z_D7g2RCPzAHG6grCZ7iXRt69eehKM=",
      category: "Research",
      date: "Feb 18, 2024"
    }
  ];

  useEffect(() => {
    setPosts(samplePosts);
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h1"
          sx={{ 
            mb: 2,
            color: '#1B4332',
            fontWeight: 700,
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }
          }}
        >
          Listen to what farmers have to say
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            maxWidth: '800px',
            mx: 'auto',
            mb: 4,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          Stay informed with our latest agricultural insights, farming tips, and success stories
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 6, maxWidth: 500, mx: 'auto' }}>
        <TextField
          fullWidth
          placeholder="Search articles..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Featured Post */}
      <Card 
        sx={{ 
          mb: 8,
          bgcolor: 'grey.50',
          overflow: 'hidden',
          boxShadow: 2
        }}
      >
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image="https://t4.ftcdn.net/jpg/03/87/17/53/360_F_387175334_Dyk2K4IFKkelEgpCjD380CfIJBI0tVRx.jpg"
              alt="Featured post"
              sx={{
                height: { xs: '300px', md: '500px' },
                objectFit: 'cover'
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 6 }}>
              <Typography 
                component="span"
                sx={{ 
                  color: '#2D6A4F',
                  fontWeight: 600,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  mb: 2,
                  display: 'block'
                }}
              >
                FEATURED
              </Typography>
              <Typography 
                variant="h3"
                sx={{ 
                  mb: 3,
                  color: '#1B4332',
                  fontWeight: 700,
                  fontSize: { xs: '1.875rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.2
                }}
              >
                Transforming Agriculture with Innovation
              </Typography>
              <Typography 
                sx={{ 
                  color: 'text.secondary',
                  mb: 4,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  lineHeight: 1.8
                }}
              >
                Explore how our commitment to innovation and sustainability is helping farmers across India achieve better yields while preserving natural resources.
              </Typography>
              <Button 
                variant="outlined"
                sx={{
                  borderColor: '#2D6A4F',
                  color: '#2D6A4F'
                }}
              >
                Read More
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Blog Posts Grid */}
      <Grid container spacing={4}>
        {posts.map(post => (
          <Grid item key={post.id} xs={12} sm={6} lg={4}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={post.image}
                alt={post.title}
              />
              <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Typography 
                  component="span"
                  sx={{ 
                    color: '#2D6A4F',
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    mb: 1,
                    display: 'block'
                  }}
                >
                  {post.category}
                </Typography>
                <Typography 
                  variant="h5"
                  sx={{ 
                    mb: 2,
                    color: '#1B4332',
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  {post.title}
                </Typography>
                <Typography 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 2,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    lineHeight: 1.8
                  }}
                >
                  {post.excerpt}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                  {post.date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(posts.length / postsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size={isMobile ? 'small' : 'medium'}
        />
      </Box>
    </Container>
  );
};

export default BlogPage;