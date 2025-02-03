import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
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

const StyledCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: '#fff',
  position: 'relative',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  },
});

const ImageContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  paddingTop: '80%', // Reduced from 100% to 80% for less vertical space
  backgroundColor: '#fff',
});

const ProductImage = styled(CardMedia)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  padding: '12px', // Reduced from 20px
});

const ContentWrapper = styled(CardContent)({
  padding: '12px', // Reduced from 16px
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px', // Reduced from 12px
});

const ProductName = styled(Typography)({
  fontSize: '1.25rem', // Reduced from 1.5rem
  fontWeight: 700,
  color: '#1a1a1a',
  lineHeight: 1.2,
  marginBottom: 0,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minHeight: '3rem', // Reduced from 3.6rem
});

const ProductDescription = styled(Typography)({
  fontSize: '0.875rem',
  color: '#666',
  marginBottom: '4px', // Reduced from 8px
  lineHeight: 1.3, // Reduced from 1.4
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minHeight: '2.3rem', // Reduced from 2.8rem
});

const PriceWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px', // Reduced from 8px
});

const CurrentPrice = styled(Typography)({
  fontSize: '1.5rem', // Reduced from 1.75rem
  fontWeight: 700,
  color: '#1a1a1a',
  lineHeight: 1,
});

const OriginalPrice = styled(Typography)({
  fontSize: '1rem', // Reduced from 1.1rem
  color: '#999',
  textDecoration: 'line-through',
  lineHeight: 1,
});

const SizeButtonsContainer = styled(Box)({
  display: 'flex',
  gap: '4px', // Reduced from 6px
  flexWrap: 'wrap',
  marginBottom: '4px',
});

const SizeButton = styled(Button)(({ selected }) => ({
  minWidth: '64px', // Reduced from 72px
  padding: '4px 10px', // Reduced from 6px 12px
  borderRadius: '6px',
  border: '2px solid #2e7d32',
  backgroundColor: selected ? '#2e7d32' : 'transparent',
  color: selected ? '#fff' : '#2e7d32',
  fontSize: '0.813rem', // Reduced from 0.875rem
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
  gap: '4px', // Reduced from 6px
  border: '1px solid #ddd',
  borderRadius: '6px',
  padding: '2px',
  width: 'fit-content',
});

const QuantityButton = styled(IconButton)({
  padding: '2px', // Reduced from 4px
  color: '#2e7d32',
  '&:hover': {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
});

const QuantityText = styled(Typography)({
  minWidth: '32px', // Reduced from 36px
  textAlign: 'center',
  fontWeight: 600,
});

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: '6px', // Reduced from 8px
  marginTop: '8px',
});

const ActionButton = styled(Button)(({ variant }) => ({
  flex: 1,
  padding: '8px', // Reduced from 10px
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem', // Reduced from 0.9375rem
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
      <ImageContainer>
        <ProductImage
          component="img"
          image={product.images?.[0] || '/placeholder-image.jpg'}
          alt={product.name}
        />
      </ImageContainer>
      <ContentWrapper>
        <Box>
          <ProductName variant="h1">
            {product.name}
          </ProductName>
          <ProductDescription>
            {product.description || 'Boosts plant growth and yields with key nutrients.'}
          </ProductDescription>
        </Box>

        <Box>
          <PriceWrapper>
            <CurrentPrice>₹{calculateDiscountedPrice()}</CurrentPrice>
            {product.discount > 0 && (
              <OriginalPrice>₹{product.price}</OriginalPrice>
            )}
          </PriceWrapper>
          
          <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.875rem' }}>
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

        <Box>
          <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.875rem' }}>
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
          >
            {addingToCart ? 'Added!' : 'Add to Cart'}
          </ActionButton>
          <ActionButton
            variant="outlined"
            onClick={handleBuyNow}
            disabled={!selectedSize}
          >
            Buy Now
          </ActionButton>
        </ActionButtons>
      </ContentWrapper>
    </StyledCard>
  );
};

export default ProductCard;