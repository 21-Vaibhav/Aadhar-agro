import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCart } from '../context/CartContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  createRazorpayOrder, 
  verifyRazorpayPayment, 
  loadRazorpayScript 
} from '../services/razorpayService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const PaymentMethodCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  boxShadow: selected ? '0 2px 12px rgba(46, 125, 50, 0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const auth = getAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script when component mounts
    loadRazorpayScript()
      .then(() => setRazorpayLoaded(true))
      .catch((error) => console.error('Failed to load Razorpay:', error));
  }, []);

  // Add authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login', { 
          state: { 
            from: '/checkout',
            message: 'Please sign in to complete your purchase' 
          } 
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const isFormValid = () => {
    return (
      shippingAddress.street &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.pinCode &&
      paymentMethod
    );
  };

  // Function to handle Razorpay payment
  const initiateRazorpayPayment = async (orderId) => {
    try {
      setLoading(true);
      
      // Create Razorpay order
      const razorpayOrderData = await createRazorpayOrder(total, orderId);
      
      // Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: 'Your Shop Name',
        description: 'Purchase Payment',
        order_id: razorpayOrderData.id,
        handler: async function(response) {
          try {
            // Verify payment on server
            const verificationResult = await verifyRazorpayPayment(response, orderId);
            
            if (verificationResult.success) {
              // Update order status in Firestore
              await updateDoc(doc(db, 'orders', orderId), {
                paymentStatus: 'completed',
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                updatedAt: serverTimestamp()
              });
              
              // Clear cart and redirect to success page
              clearCart();
              navigate('/order-success', { state: { orderId } });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Error processing payment:', error);
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: auth.currentUser?.displayName || '',
          email: auth.currentUser?.email || '',
          contact: ''  // You might want to collect phone number separately
        },
        notes: {
          orderId: orderId
        },
        theme: {
          color: '#2e7d32'
        }
      };
      
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function(response) {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      
      rzp.open();
    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
      setError('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    if (!isFormValid()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        orderStatus: 'processing',
        paymentMethod: paymentMethod,
        paymentStatus: 'pending',
        products: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize || 'N/A'
        })),
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pinCode: shippingAddress.pinCode
        },
        totalAmount: total
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      const orderId = orderRef.id;

      // Handle different payment methods
      if (paymentMethod === 'COD') {
        clearCart();
        navigate('/order-success', { state: { orderId } });
      } else if (paymentMethod === 'RAZORPAY') {
        // Initiate Razorpay payment
        await initiateRazorpayPayment(orderId);
        // Note: Loading state and navigation will be handled by the Razorpay callback
      } else if (paymentMethod === 'UPI') {
        // Redirect to UPI payment gateway
        navigate('/upi-payment', { 
          state: { 
            orderId,
            amount: total
          } 
        });
      } else if (paymentMethod === 'CARD') {
        // Redirect to card payment gateway
        navigate('/card-payment', { 
          state: { 
            orderId,
            amount: total
          } 
        });
      }
    } catch (error) {
      setError('Error creating order. Please try again.');
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1a1a1a', mb: 3 }}>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <StyledPaper component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a1a1a', mb: 3 }}>
              Shipping Address
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Street Address"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="State"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="PIN Code"
                  name="pinCode"
                  value={shippingAddress.pinCode}
                  onChange={handleAddressChange}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, mb: 3 }}>
              <Divider />
            </Box>

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ color: '#1a1a1a', mb: 2 }}>
                Payment Method
              </FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <PaymentMethodCard selected={paymentMethod === 'COD'}>
                      <CardContent>
                        <FormControlLabel
                          value="COD"
                          control={<Radio />}
                          label="Cash on Delivery"
                        />
                      </CardContent>
                    </PaymentMethodCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <PaymentMethodCard selected={paymentMethod === 'RAZORPAY'}>
                      <CardContent>
                        <FormControlLabel
                          value="RAZORPAY"
                          control={<Radio />}
                          label="Razorpay"
                          disabled={!razorpayLoaded}
                        />
                        {!razorpayLoaded && (
                          <Box display="flex" alignItems="center" mt={1}>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                            <Typography variant="caption">Loading...</Typography>
                          </Box>
                        )}
                      </CardContent>
                    </PaymentMethodCard>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <PaymentMethodCard selected={paymentMethod === 'UPI'}>
                      <CardContent>
                        <FormControlLabel
                          value="UPI"
                          control={<Radio />}
                          label="UPI Payment"
                        />
                      </CardContent>
                    </PaymentMethodCard>
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || !isFormValid() || (paymentMethod === 'RAZORPAY' && !razorpayLoaded)}
                sx={{
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#1b5e20',
                  },
                  borderRadius: '8px',
                  py: 1.5,
                }}
              >
                {loading ? 'Processing...' : `Pay ₹${total}`}
              </Button>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a1a1a' }}>
              Order Summary
            </Typography>
            <Box sx={{ mt: 2 }}>
              {cartItems.map((item) => (
                <Box
                  key={`${item.id}-${item.selectedSize}`}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {item.name} ({item.selectedSize || 'N/A'}) × {item.quantity}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1a1a1a' }}>
                    ₹{item.price * item.quantity}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#666' }}>Subtotal</Typography>
                <Typography sx={{ color: '#1a1a1a' }}>₹{total}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#666' }}>Shipping</Typography>
                <Typography sx={{ color: '#1a1a1a' }}>Free</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ color: '#1a1a1a' }}>Total</Typography>
                <Typography variant="h6" sx={{ color: '#2e7d32' }}>₹{total}</Typography>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;