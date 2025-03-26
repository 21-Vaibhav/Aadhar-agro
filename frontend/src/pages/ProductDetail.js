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
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  styled,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedSizeData, setSelectedSizeData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'products', id));
        if (productDoc.exists()) {
          const productData = { id: productDoc.id, ...productDoc.data() };
          setProduct(productData);
          
          // Auto-select first available size
          if (productData.availableSizes && productData.availableSizes.length > 0) {
            const firstSize = productData.availableSizes[0];
            setSelectedSize(firstSize.size);
            setSelectedSizeData(firstSize);
            setQuantity(1);
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

  const handleQuantityChange = (delta) => {
    if (!selectedSizeData) return;
    
    const stock = parseInt(selectedSizeData.stock);
    const newQuantity = Math.max(1, Math.min(quantity + delta, stock));
    setQuantity(newQuantity);
  };

  const handleSizeSelect = (sizeOption) => {
    setSelectedSize(sizeOption.size);
    setSelectedSizeData(sizeOption);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedSizeData) return;

    setAddingToCart(true);
    
    const productToAdd = {
      ...product,
      price: selectedSizeData.price,
      selectedSize: selectedSize
    };

    addToCart(productToAdd, quantity, selectedSize);
    
    setTimeout(() => {
      setAddingToCart(false);
    }, 1000);
  };

  const handleBuyNow = () => {
    if (!selectedSizeData) return;

    const productToAdd = {
      ...product,
      price: selectedSizeData.price,
      selectedSize: selectedSize
    };

    addToCart(productToAdd, quantity, selectedSize);
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

  // Calculate total stock across all sizes
  const totalStock = product.availableSizes 
    ? product.availableSizes.reduce((sum, size) => sum + parseInt(size.stock), 0)
    : 0;

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
                ₹{selectedSizeData?.price || 'N/A'}
              </Typography>
              
              {totalStock > 0 ? (
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
              
              {selectedSizeData && parseInt(selectedSizeData.stock) <= 5 && (
                <Typography color="error" variant="body2">
                  Only {selectedSizeData.stock} left in stock!
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Product Description */}
            <Typography 
              variant="body1" 
              color="text.secondary" 
              paragraph 
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Size Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Size
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {product.availableSizes?.map((sizeOption) => (
                  <Button
                    key={sizeOption.size}
                    variant={selectedSize === sizeOption.size ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleSizeSelect(sizeOption)}
                    disabled={parseInt(sizeOption.stock) <= 0}
                    sx={{ minWidth: '80px' }}
                  >
                    {sizeOption.size}
                    {parseInt(sizeOption.stock) <= 0 && " (Out of Stock)"}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Quantity Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{quantity}</Typography>
                <IconButton
                  onClick={() => handleQuantityChange(1)}
                  disabled={
                    !selectedSizeData || 
                    quantity >= parseInt(selectedSizeData.stock)
                  }
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
                disabled={
                  !selectedSizeData || 
                  parseInt(selectedSizeData.stock) === 0
                }
                fullWidth
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleBuyNow}
                disabled={
                  !selectedSizeData || 
                  parseInt(selectedSizeData.stock) === 0
                }
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
          <Tab label="Size & Stock" />
          <Tab label="Shipping & Returns" />
        </Tabs>

        <Box sx={{ py: 3 }}>
          {activeTab === 0 && (
            <Typography 
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
          
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Available Sizes
              </Typography>
              {product.availableSizes?.map((sizeOption, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 1,
                    p: 1,
                    bgcolor: selectedSize === sizeOption.size ? 'action.selected' : 'transparent',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2">
                    {sizeOption.size}
                  </Typography>
                  <Typography variant="body2">
                    Price: ₹{sizeOption.price} | Stock: {sizeOption.stock}
                  </Typography>
                </Box>
              ))}
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
    </Container>
  );
};

export default ProductDetail;