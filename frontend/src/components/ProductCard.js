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
  paddingTop: '80%', // Keeps aspect ratio
  backgroundColor: '#fff',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '12px', // Keeps it neat
});

const ProductImage = styled("img")({
  width: '100%', // Keeps it within bounds
  height: '100%', // Ensures no overflow
  objectFit: 'contain', // Prevents cropping and overflow
  position: 'absolute',
  top: '0',
  left: '0',
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
  const [addingToCart, setAddingToCart] = useState(false);

  const availableSizes = product.availableSizes || [];
  const initialSize = availableSizes.length > 0 
    ? availableSizes[0].size 
    : null;
  
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedSizeStock, setSelectedSizeStock] = useState(
    availableSizes.length > 0 
      ? availableSizes[0].stock 
      : 0
  );
  const handleUpperHalfClick = () => {
      navigate(`/products/${product.id}`); 
  }
  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const selectedSizeDetails = availableSizes.find(s => s.size === size);
    setSelectedSizeStock(selectedSizeDetails ? selectedSizeDetails.stock : 0);
  };
  
  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    const selectedSizeData = product.availableSizes.find(
      option => option.size === selectedSize
    );
    
    if (!selectedSizeData || parseInt(selectedSizeData.stock) < quantity) {
      // Handle out of stock scenario
      return;
    }
    
    setAddingToCart(true);
    addToCart({
      ...product, 
      price: selectedSizeData.price
    }, quantity, selectedSize);
    
    setTimeout(() => {
      setAddingToCart(false);
    }, 1000);
  };

const handleBuyNow = () => {
  if (!selectedSize) return;
  
  // Find the selected size option
  const selectedSizeData = product.availableSizes.find(
    option => option.size === selectedSize
  );
  
  // Validate size and stock
  if (!selectedSizeData) {
    // Handle error: selected size not found
    return;
  }
  
  // Check if requested quantity is available
  const availableStock = parseInt(selectedSizeData.stock);
  if (quantity > availableStock) {
    // Optional: Show an error message about insufficient stock
    return;
  }
  
  // Prepare product object with selected size details
  const productToAdd = {
    ...product,
    price: selectedSizeData.price, // Use size-specific price
    selectedSize: selectedSize, // Include selected size
    stock: selectedSizeData.stock // Include size-specific stock
  };
  
  // Add to cart and navigate to cart
  addToCart(productToAdd, quantity, selectedSize);
  navigate('/cart');
};
// Update price calculation
  const calculateDiscountedPrice = () => {
    const selectedSizeData = product.availableSizes.find(
      option => option.size === selectedSize
    );
    const basePrice = selectedSizeData ? selectedSizeData.price : product.price;
    
    if (product.discount) {
      const discountAmount = (basePrice * product.discount) / 100;
      return Math.round(basePrice - discountAmount);
    }
    return basePrice;
  };
  console.log("Available Sizes:", availableSizes);

  return (
<StyledCard onClick={handleUpperHalfClick}>
<div style={{ cursor: "pointer" }}>
  <ImageContainer>
    <ProductImage
      src={product.imageUrl || '/placeholder-image.jpg'}
      alt={product.name}
    />
  </ImageContainer>
</div>
  <ContentWrapper>
    <CategoryLabel>
      {product.category || 'General'}
    </CategoryLabel>
    <ProductTitle>
      {product.name}
    </ProductTitle>
    <ProductDescription>
      {product.shortDescription || defaultDescription}
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
  {availableSizes.map((sizeOption) => (
    <SizeButton
      key={sizeOption.size}
      selected={selectedSize === sizeOption.size}
      onClick={(e) => {
        e.stopPropagation();
        handleSizeSelect(sizeOption.size);
        setSelectedSizeStock(sizeOption.stock);
      }}
      disabled={parseInt(sizeOption.stock) <= 0}
    >
      {sizeOption.size}
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
          e.stopPropagation(); // Prevent handleUpperHalfClick from being triggered
          handleAddToCart();
        }}
  disabled={addingToCart || selectedSizeStock <= 0}
        fullWidth
      >
        {addingToCart ? 'Added!' : 'Add to Cart'}
      </ActionButton>
      <ActionButton
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation(); // Prevent handleUpperHalfClick from being triggered
          handleBuyNow();
        }}
        disabled={addingToCart || selectedSizeStock <= 0}
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