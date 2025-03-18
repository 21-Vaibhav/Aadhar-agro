// Updated BlogPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Box, Typography, Card, CardContent, CardMedia,
  Button, TextField, Pagination, InputAdornment, useTheme, useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getArticles } from '../services/blogService';

const BlogPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const postsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const articles = await getArticles({ sortBy: 'date', sortOrder: 'desc' });
        setPosts(articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchPosts();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" sx={{ mb: 2, color: '#1B4332', fontWeight: 700 }}>
          Listen to what farmers have to say
        </Typography>
        <TextField
          fullWidth
          placeholder="Search articles..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
      </Box>
      <Grid container spacing={4}>
        {posts.map(post => (
          <Grid item key={post.id} xs={12} sm={6} lg={4}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => handleBlogClick(post.id)}>
              <CardMedia component="img" height="200" image={post.imageUrl} alt={post.title} />
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{post.title}</Typography>
                <Typography variant="body2" color="text.secondary">{post.date}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={Math.ceil(posts.length / postsPerPage)} page={page} onChange={handlePageChange} color="primary" />
      </Box>
    </Container>
  );
};

export default BlogPage;