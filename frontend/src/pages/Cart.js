import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Box,
  TextField,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, total } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleQuantityChange = (itemId, selectedSize, change) => {
    const item = cartItems.find(i => i.id === itemId && i.selectedSize === selectedSize);
    if (item) {
      updateQuantity(itemId, selectedSize, item.quantity + change);
    }
  };

  const handleRemoveItem = (itemId, selectedSize) => {
    removeFromCart(itemId, selectedSize);
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: 'transparent'
          }}
        >
          <CartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Add items to your cart to see them here
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ backgroundColor: '#2e7d32' }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1a1a1a' }}>
        Shopping Cart
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card 
              key={`${item.id}-${item.selectedSize}`}
              sx={{ 
                mb: 2,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <CardMedia
                component="img"
                sx={{ 
                  width: isMobile ? '100%' : 200,
                  height: isMobile ? 200 : 'auto',
                  objectFit: 'contain',
                  backgroundColor: '#fff',
                  p: 2
                }}
                image={item.images?.[0]}
                alt={item.name}
              />
              <CardContent sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                p: 3
              }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1a1a1a' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Size: {item.selectedSize}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                    ₹{item.discount 
                      ? Math.round(item.price * (1 - item.discount / 100))
                      : item.price
                    }
                    {item.discount > 0 && (
                      <Typography 
                        component="span" 
                        sx={{ 
                          ml: 1,
                          color: '#999',
                          textDecoration: 'line-through',
                          fontSize: '0.9rem'
                        }}
                      >
                        ₹{item.price}
                      </Typography>
                    )}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    mt: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      onClick={() => handleQuantityChange(item.id, item.selectedSize, -1)}
                      disabled={item.quantity <= 1}
                      sx={{ color: '#2e7d32' }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      size="small"
                      value={item.quantity}
                      InputProps={{
                        readOnly: true,
                        sx: { 
                          width: '60px', 
                          textAlign: 'center',
                          '& .MuiOutlinedInput-input': {
                            textAlign: 'center'
                          }
                        }
                      }}
                    />
                    <IconButton 
                      onClick={() => handleQuantityChange(item.id, item.selectedSize, 1)}
                      sx={{ color: '#2e7d32' }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <IconButton 
                    onClick={() => handleRemoveItem(item.id, item.selectedSize)}
                    sx={{ color: '#666' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            p: 3, 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a1a1a' }}>
              Order Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography sx={{ color: '#1a1a1a' }}>₹{total}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography sx={{ color: '#1a1a1a' }}>Free</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#1a1a1a' }}>Total</Typography>
              <Typography variant="h6" sx={{ color: '#2e7d32' }}>₹{total}</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              sx={{
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
                borderRadius: '8px',
                py: 1.5,
              }}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
