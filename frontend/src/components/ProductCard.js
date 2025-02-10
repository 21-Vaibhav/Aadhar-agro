import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  styled,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  paddingTop: '80%',
  backgroundColor: '#fff',
});

const ProductImage = styled(CardMedia)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  padding: '12px',
});

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

const ProductTitle = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.h6.fontFamily,
  fontWeight: 600,
  fontSize: '1.125rem',
  lineHeight: 1.3,
  marginBottom: theme.spacing(1),
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    marginBottom: theme.spacing(0.5),
  },
}));

const ProductDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  lineHeight: 1.5,
  marginBottom: theme.spacing(1.5),
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8125rem',
    marginBottom: theme.spacing(1),
  },
}));

const CategoryLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '0.75rem',
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

const PriceContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1),
  },
}));

const ProductPrice = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.h6.fontFamily,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.125rem',
  },
}));

const DiscountPrice = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  textDecoration: 'line-through',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8125rem',
  },
}));

const SizeButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1.5),
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: 'auto',
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

const defaultDescription = "High-quality agricultural product designed to enhance crop yield and farm productivity. Contact us for detailed specifications and usage guidelines.";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const defaultSizes = ['100ml', '200ml', '500ml'];
  const sizes = product.sizes || defaultSizes;

  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes]);

  const handleUpperHalfClick = () => {
      navigate(`/products/${product.id}`); 
  }
  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    setAddingToCart(true);
    addToCart(product, quantity, selectedSize);
    
    // Show success feedback
    setTimeout(() => {
      setAddingToCart(false);
    }, 1000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    
    addToCart(product, quantity, selectedSize);
    navigate('/cart');
  };

  const calculateDiscountedPrice = () => {
    if (product.discount) {
      const discountAmount = (product.price * product.discount) / 100;
      return Math.round(product.price - discountAmount);
    }
    return product.price;
  };

  return (
    <StyledCard>
      <div onClick={handleUpperHalfClick} style={{ cursor: "pointer" }}>
      <ImageContainer>
        <ProductImage
          component="img"
          image={product.images[0] || '/placeholder-image.jpg'}
          alt={product.name}
        />
      </ImageContainer>
      </div>
      <ContentWrapper>
        <CategoryLabel>
          {product.Category || 'General'}
        </CategoryLabel>
        <ProductTitle>
          {product.name}
        </ProductTitle>
        <ProductDescription>
          {product.description || defaultDescription}
        </ProductDescription>
        <PriceContainer>
          <ProductPrice>
            ₹{calculateDiscountedPrice()}
          </ProductPrice>
          {product.discount > 0 && (
            <DiscountPrice>
              ₹{product.price}
            </DiscountPrice>
          )}
        </PriceContainer>
  
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
                onClick={() => handleSizeSelect(size)}
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
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <RemoveIcon fontSize="small" />
            </QuantityButton>
            <QuantityText>{quantity}</QuantityText>
            <QuantityButton onClick={() => handleQuantityChange(1)}>
              <AddIcon fontSize="small" />
            </QuantityButton>
          </QuantityControl>
        </Box>

        <ActionButtons>
          <ActionButton
            variant="contained"
            onClick={handleAddToCart}
            disabled={!selectedSize || addingToCart}
            fullWidth
          >
            {addingToCart ? 'Added!' : 'Add to Cart'}
          </ActionButton>
          <ActionButton
            variant="outlined"
            onClick={handleBuyNow}
            disabled={!selectedSize}
            fullWidth
          >
            Buy Now
          </ActionButton>
        </ActionButtons>
      </ContentWrapper>
    </StyledCard>
  );
};

export default ProductCard;