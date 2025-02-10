import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Rating,
  Divider,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = doc(db, 'products', id);
        const productSnapshot = await getDoc(productDoc);
        
        if (productSnapshot.exists()) {
          setProduct({ id: productSnapshot.id, ...productSnapshot.data() });
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error loading product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    const auth = getAuth();
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    try {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, {
        cart: arrayUnion({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.images[0],
          quantity: quantity
        })
      });

      // Show success message or navigate to cart
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2}>
            <img
              src={product.images[0]}
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'contain',
              }}
            />
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Rating value={product.rating || 0} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary">
              ({product.reviews?.length || 0} reviews)
            </Typography>
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            ₹{product.price}
          </Typography>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{ width: 100 }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<CartIcon />}
                  onClick={handleAddToCart}
                  size="large"
                >
                  Add to Cart
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Product Features */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <ShippingIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="body2">Free Shipping</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <SecurityIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="body2">Secure Payment</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="body2">Quality Guarantee</Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
        >
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label="Reviews" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Typography>
              {product.longDescription || product.description}
            </Typography>
          )}
          {activeTab === 1 && (
            <Box>
              {product.specifications?.map((spec, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Grid container>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        {spec.name}:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{spec.value}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          )}
          {activeTab === 2 && (
            <Box>
              {product.reviews?.map((review, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {review.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    By {review.userName} on {new Date(review.date).toLocaleDateString()}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetail;
