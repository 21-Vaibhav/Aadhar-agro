import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
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
  IconButton,
  styled,
  Chip,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'products', id));
        if (productDoc.exists()) {
          const productData = { id: productDoc.id, ...productDoc.data() };
          setProduct(productData);
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error loading product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (action) => {
    if (action === 'increase' && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    try {
      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        size: selectedSize,
        imageUrl: product.imageUrl,
      };

      await addToCart(cartItem);
      
      setSnackbarMessage('Product added to cart successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setSnackbarMessage('Failed to add product to cart');
      setSnackbarOpen(true);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
              }}
            />
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                ₹{product.price}
              </Typography>
              {product.stock > 0 ? (
                <Chip
                  label="In Stock"
                  color="success"
                  size="small"
                  sx={{ mr: 1 }}
                />
              ) : (
                <Chip
                  label="Out of Stock"
                  color="error"
                  size="small"
                  sx={{ mr: 1 }}
                />
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <Typography color="error" variant="body2">
                  Only {product.stock} left in stock!
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Product Description */}
            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description}
            </Typography>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Size
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => setSelectedSize(size)}
                      sx={{ minWidth: '80px' }}
                    >
                      {size}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {/* Quantity Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{quantity}</Typography>
                <IconButton
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= product.stock}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={!product.stock}
                fullWidth
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleBuyNow}
                disabled={!product.stock}
                fullWidth
              >
                Buy Now
              </Button>
            </Box>

            {/* Product Features */}
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShippingIcon color="primary" />
                    <Typography variant="body2">Free Delivery</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon color="primary" />
                    <Typography variant="body2">Secure Payment</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon color="primary" />
                    <Typography variant="body2">Quality Assured</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Additional Information Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Description" />
          <Tab label="Additional Information" />
          <Tab label="Shipping & Returns" />
        </Tabs>

        <Box sx={{ py: 3 }}>
          {activeTab === 0 && (
            <Typography>{product.description}</Typography>
          )}
          {activeTab === 1 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Product Specifications
              </Typography>
              <Grid container spacing={2}>
                {product.specifications?.map((spec, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {spec.label}:
                      </Typography>
                      <Typography variant="body2">{spec.value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          {activeTab === 2 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Shipping Information
              </Typography>
              <Typography paragraph>
                Free shipping on orders above ₹499. Standard delivery within 5-7 business days.
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Returns Policy
              </Typography>
              <Typography>
                Easy returns within 7 days of delivery. Please ensure the product is unused and in original packaging.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default ProductDetail;
