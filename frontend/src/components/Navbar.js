import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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
        <ListItem 
          component={RouterLink} 
          to="/login"
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
            textDecoration: 'none',
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

            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                flexGrow: { xs: 1, md: 0 },
              }}
            >
              AADHAR AGRO
            </Typography>

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
          keepMounted: true, // Better open performance on mobile.
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