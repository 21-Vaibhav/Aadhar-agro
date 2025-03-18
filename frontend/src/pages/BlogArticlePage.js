// Updated BlogArticlePage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Avatar, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById } from '../services/blogService';

const BlogArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await getArticleById(id);
        setArticle(fetchedArticle);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  if (loading) return <Typography>Loading article...</Typography>;
  if (!article) return <Typography>Article not found</Typography>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button onClick={() => navigate('/blog')}>Back to Articles</Button>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>{article.title}</Typography>
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid item>
            <Avatar src={article.authorImage} alt={article.authorName} />
          </Grid>
          <Grid item>
            <Typography>{article.authorName}</Typography>
            <Typography variant="body2" color="text.secondary">{article.date}</Typography>
          </Grid>
        </Grid>
      </Box>
      <img src={article.imageUrl} alt={article.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }} />
      <Typography dangerouslySetInnerHTML={{ __html: article.content }} sx={{ fontSize: '1.1rem', lineHeight: 1.8 }} />
    </Container>
  );
};

export default BlogArticlePage;
