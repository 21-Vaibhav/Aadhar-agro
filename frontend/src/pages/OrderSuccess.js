import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  maxWidth: 600,
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
  },
}));

const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
}));

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <Container sx={{ py: 8 }}>
      <StyledPaper>
        <SuccessIcon />
        <Typography variant="h4" gutterBottom sx={{ color: '#1a1a1a', fontWeight: 600 }}>
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
          Thank you for your order. We'll send you a confirmation email with your order details.
        </Typography>
        {orderId && (
          <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
            Order ID: {orderId}
          </Typography>
        )}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            sx={{
              borderColor: '#2e7d32',
              color: '#2e7d32',
              '&:hover': {
                borderColor: '#1b5e20',
                backgroundColor: 'rgba(46, 125, 50, 0.08)',
              },
              borderRadius: '8px',
              px: 4,
            }}
          >
            Continue Shopping
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/orders')}
            sx={{
              backgroundColor: '#2e7d32',
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
              borderRadius: '8px',
              px: 4,
            }}
          >
            View Orders
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default OrderSuccess;
