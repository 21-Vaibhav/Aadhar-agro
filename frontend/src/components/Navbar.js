import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Badge,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  borderBottom: '1px solid rgba(0,0,0,0.08)',
}));

const TopBar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: '8px 0',
  fontSize: '0.875rem',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontSize: '0.95rem',
  padding: '6px 12px',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  padding: '8px',
  marginRight: theme.spacing(2),
  '& .line': {
    width: '24px',
    height: '2px',
    backgroundColor: theme.palette.primary.main,
    margin: '4px 0',
    transition: 'all 0.3s ease',
    display: 'block',
  },
}));

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Products', icon: <StoreIcon />, path: '/products' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
  { text: 'About', icon: <InfoIcon />, path: '/about' },
  { text: 'Contact', icon: <ContactIcon />, path: '/contact' },
];

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const cartCount = 0; // Replace with actual cart count

  const drawer = (
    <Box sx={{ width: 280 }}>
      <DrawerHeader>
        <Typography variant="h6" component="div">
          AADHAR AGRO
        </Typography>
        <IconButton 
          color="inherit" 
          onClick={handleDrawerToggle}
          sx={{ 
            '&:hover': { 
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)' 
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      {user && (
        <Box sx={{ p: 2, bgcolor: 'rgba(46, 125, 50, 0.1)' }}>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'primary.main',
              fontWeight: 500,
            }}
          >
            <PersonIcon color="primary" />
            {user.displayName || 'User'}
          </Typography>
        </Box>
      )}
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem 
          component={RouterLink} 
          to="/cart"
          onClick={handleDrawerToggle}
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          <ListItemIcon sx={{ color: theme.palette.primary.main }}>
            <Badge badgeContent={cartCount} color="primary">
              <CartIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Cart" />
        </ListItem>
        {user ? (
          <ListItem 
            button
            onClick={() => {
              handleLogout();
              handleDrawerToggle();
            }}
            sx={{
              color: 'inherit',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        ) : (
          <>
            <ListItem 
              component={RouterLink} 
              to="/login"
              onClick={handleDrawerToggle}
              sx={{
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem 
              component={RouterLink} 
              to="/register"
              onClick={handleDrawerToggle}
              sx={{
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <TopBar>
        <Container>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={3}>
              <Typography variant="body2">
                Call anytime: +98 (000) - 9630
              </Typography>
              <Typography variant="body2">
                aadharagro@gmail.com
              </Typography>
            </Stack>
            <Typography variant="body2">
              Raichur, Karnataka
            </Typography>
          </Stack>
        </Container>
      </TopBar>
      <StyledAppBar position="sticky">
        <Container>
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Mobile Menu Icon */}
            {isMobile && (
              <MenuButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <Box>
                  <span className="line" />
                  <span className="line" />
                  <span className="line" />
                </Box>
              </MenuButton>
            )}

            {/* Logo and User Info Container for Mobile */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: { xs: 1, md: 0 },
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
              >
                AADHAR AGRO
              </Typography>

              {/* Mobile User Name */}
              {isMobile && user && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(45deg, rgba(46, 125, 50, 0.08), rgba(46, 125, 50, 0.15))',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    ml: 2,
                    border: '1px solid rgba(46, 125, 50, 0.1)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, rgba(46, 125, 50, 0.12), rgba(46, 125, 50, 0.2))',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <PersonIcon 
                    sx={{ 
                      fontSize: '1rem',
                      color: 'primary.main',
                      opacity: 0.9,
                      mr: 0.7,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      letterSpacing: '0.2px',
                      textShadow: '0 1px 1px rgba(255,255,255,0.5)',
                    }}
                  >
                    {user.displayName || 'User'}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Desktop Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {menuItems.map((item) => (
                <NavButton
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                >
                  {item.text}
                </NavButton>
              ))}
            </Box>

            {/* Desktop Cart and Auth Buttons */}
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <Button
                component={RouterLink}
                to="/cart"
                color="primary"
                startIcon={
                  <Badge badgeContent={cartCount} color="primary">
                    <CartIcon />
                  </Badge>
                }
                sx={{ 
                  borderRadius: '8px',
                  fontWeight: 500,
                }}
              >
                Cart
              </Button>
              
              {user ? (
                <>
                  <Typography
                    sx={{
                      color: 'text.primary',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <PersonIcon color="primary" />
                    {user.displayName || 'User'}
                  </Typography>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{ 
                      borderRadius: '8px',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="primary"
                    variant="outlined"
                    startIcon={<PersonIcon />}
                    sx={{ 
                      borderRadius: '8px',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      }
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    startIcon={<PersonIcon />}
                    sx={{ borderRadius: '8px' }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;