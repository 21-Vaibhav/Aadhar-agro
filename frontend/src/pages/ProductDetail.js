import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { ShoppingCart } from "@mui/icons-material"; // If using Material-UI icons
import { Avatar } from "@mui/material"; // If using Material-UI components
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
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const defaultSizes = ['100ml', '200ml', '500ml'];
  const sizes = product && product.packSizes ? product.packSizes : defaultSizes;
  console.log("Product data:", product);


  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes]);


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

  const ActionButton = styled(Button)(({ variant }) => ({
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    ...(variant === 'contained' ? {
      backgroundColor: '#2e7d32',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#1b5e20',
      },
    } : {
      borderColor: '#2e7d32',
      color: '#2e7d32',
      '&:hover': {
        borderColor: '#1b5e20',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
      },
    }),
  }));


  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };
  const QuantityControl = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '2px',
    width: 'fit-content',
  });
  
  const QuantityButton = styled(IconButton)({
    padding: '2px',
    color: '#2e7d32',
    '&:hover': {
      backgroundColor: 'rgba(46, 125, 50, 0.1)',
    },
  });
  
  const QuantityText = styled(Typography)({
    minWidth: '32px',
    textAlign: 'center',
    fontWeight: 600,
  });
  

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    setAddingToCart(true);
    addToCart(product, quantity, selectedSize);
    
    // Show success feedback
    setTimeout(() => {
      setAddingToCart(false);
    }, 1000);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
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
  const SizeButtonsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1.5),
    },
  }));
  const SizeButton = styled(Button)(({ selected }) => ({
    minWidth: '64px',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '2px solid #2e7d32',
    backgroundColor: selected ? '#2e7d32' : 'transparent',
    color: selected ? '#fff' : '#2e7d32',
    fontSize: '0.813rem',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: selected ? '#1b5e20' : 'rgba(46, 125, 50, 0.1)',
    },
    '&.Mui-disabled': {
      borderColor: '#ccc',
      color: '#999',
    },
  }));

  const ActionButtons = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: 'auto',
  }));

  const handleBuyNow = () => {
    if (!selectedSize) return;
    
    addToCart(product, quantity, selectedSize);
    navigate('/cart');
  };

  //tabs styling

  // Add these styled components at the top
const CustomTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: '#2e7d32',
    height: 3,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    color: '#666',
    '&.Mui-selected': {
      color: '#2e7d32',
      fontWeight: 600,
    },
  },
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#333',
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: '2px solid #eee',
}));

const SpecsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
}));

const SpecItem = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  borderBottom: '1px solid #eee',
  '&:last-child': {
    borderBottom: 'none',
  },
});

const ReviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const ReviewHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '8px',
});


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

          <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          color: 'text.secondary',
          mb: 0.5,
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
      >
        Select Size
      </Typography>
      <SizeButtonsContainer>
        {sizes.map((size) => (
          <SizeButton
            key={size}
            selected={selectedSize === size}
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from triggering handleUpperHalfClick
              handleSizeSelect(size);
            }}
          >
            {size}
          </SizeButton>
        ))}
      </SizeButtonsContainer>
    </Box>

    <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          color: 'text.secondary',
          mb: 0.5,
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
      >
        Quantity
      </Typography>
      <QuantityControl>
        <QuantityButton 
          onClick={(e) => {
            e.stopPropagation();
            handleQuantityChange(-1);
          }}
          disabled={quantity <= 1}
        >
          <RemoveIcon fontSize="small" />
        </QuantityButton>
        <QuantityText>{quantity}</QuantityText>
        <QuantityButton 
          onClick={(e) => {
            e.stopPropagation();
            handleQuantityChange(1);
          }}
        >
          <AddIcon fontSize="small" />
        </QuantityButton>
      </QuantityControl>
    </Box>

    <ActionButtons>
      <ActionButton
        variant="contained"
        onClick={(e) => {
          handleAddToCart();
        }}
        disabled={!selectedSize || addingToCart}
        fullWidth
      >
        {addingToCart ? 'Added!' : 'Add to Cart'}
      </ActionButton>
      <ActionButton
        variant="outlined"
        onClick={(e) => {
          handleBuyNow();
        }}
        disabled={!selectedSize}
        fullWidth
      >
        Buy Now
      </ActionButton>
    </ActionButtons>


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
  <CustomTabs
    value={activeTab}
    onChange={(e, newValue) => setActiveTab(newValue)}
    variant="fullWidth"
  >
    <Tab label="Product Details" icon={<AssignmentIcon fontSize="small" />} iconPosition="start" />
    <Tab label="Specifications" icon={<SecurityIcon fontSize="small" />} iconPosition="start" />
    <Tab label="Reviews" icon={<ShoppingCart fontSize="small" />} iconPosition="start" />
  </CustomTabs>

  <Box sx={{ p: 3, mt: 2 }}>
    {activeTab === 0 && (
      <Box>
        <SectionTitle variant="h6">About this product</SectionTitle>
        <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
  {product.longDescription || product.description}
</Typography>

      </Box>
    )}

    {activeTab === 1 && (
      <Box>
        <SectionTitle variant="h6">Technical Specifications</SectionTitle>
        <SpecsGrid>
          {product.specifications?.map((spec, index) => (
            <SpecItem key={index}>
              <Typography variant="body2" color="text.secondary">
                {spec.name}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {spec.value}
              </Typography>
            </SpecItem>
          ))}
        </SpecsGrid>
      </Box>
    )}

    {activeTab === 2 && (
      <Box>
        <SectionTitle variant="h6">
          Customer Reviews ({product.reviews?.length || 0})
        </SectionTitle>
        
        {product.reviews?.map((review, index) => (
          <ReviewCard key={index}>
            <ReviewHeader>
              <Avatar sx={{ bgcolor: '#2e7d32' }}>
                {review.userName[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography fontWeight={600}>{review.userName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
              <Rating value={review.rating} readOnly size="small" sx={{ ml: 'auto' }} />
            </ReviewHeader>
            <Typography variant="body2" sx={{ pl: 6 }}>
              {review.comment}
            </Typography>
          </ReviewCard>
        ))}

        {!product.reviews?.length && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No reviews yet. Be the first to review this product!
          </Typography>
        )}
      </Box>
    )}
  </Box>
</Box>
    </Container>
  );
};

export default ProductDetail;
