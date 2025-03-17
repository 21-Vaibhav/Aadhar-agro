import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, useTheme, useMediaQuery, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { text: 'Products', href: '/products' },
        { text: 'About Us', href: '/about' },
        { text: 'Contact', href: '/contact' },
        { text: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { text: 'Shipping Information', href: '/shipping' },
        { text: 'Refund Policy', href: '/refund-policy.pdf' },
        { text: 'Privacy Policy', href: '/privacy-statement.pdf' },
        { text: 'Terms of Service', href:'/terms-of-service.pdf' },
        { text: 'Principal Certificate', href:'/Principle ceretficate PC.pdf' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: 'https://facebook.com' },
    { icon: <TwitterIcon />, href: 'https://twitter.com' },
    { icon: <InstagramIcon />, href: 'https://instagram.com' },
    { icon: <YouTubeIcon />, href: 'https://youtube.com' },
  ];

  const MobileFooter = () => (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Aadhar Agro
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Your trusted partner in agriculture, providing quality products
          and expert guidance to farmers across India.
        </Typography>
      </Box>

      {footerSections.map((section, index) => (
        <Accordion
          key={index}
          sx={{
            backgroundColor: 'transparent',
            color: 'inherit',
            '&:before': { display: 'none' },
            boxShadow: 'none',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            sx={{ px: 0 }}
          >
            <Typography variant="subtitle1">{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0 }}>
            <Box display="flex" flexDirection="column" gap={1}>
              {section.links.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  href={link.href}
                  color="inherit"
                  underline="hover"
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body2" gutterBottom>
          Email: aadharagroindia@gmail.com
        </Typography>
        <Typography variant="body2" gutterBottom>
          Phone: +91 1234567890
        </Typography>
      </Box>
    </>
  );

  const DesktopFooter = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h6" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body2">
          Aadhar Agro is your trusted partner in agriculture, providing quality products
          and expert guidance to farmers across India.
        </Typography>
      </Grid>
      
      {footerSections.map((section, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Typography variant="h6" gutterBottom>
            {section.title}
          </Typography>
          <Box>
            {section.links.map((link, linkIndex) => (
              <Link
                key={linkIndex}
                href={link.href}
                color="inherit"
                display="block"
                sx={{ 
                  mb: 1,
                  '&:hover': { 
                    color: 'primary.light',
                    textDecoration: 'none',
                    opacity: 0.8 
                  }
                }}
              >
                {link.text}
              </Link>
            ))}
          </Box>
        </Grid>
      ))}
      
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h6" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Email: info@aadhar-agro.com
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Phone: +91 1234567890
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        width: '100%',
        position: 'relative',
        bottom: 0,
        left: 0,
      }}
    >
      <Container 
        maxWidth={false}
        sx={{ 
          maxWidth: { xl: '1600px' },
          py: { xs: 3, sm: 6 },
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {isMobile ? <MobileFooter /> : <DesktopFooter />}
        
        <Box
          sx={{
            mt: { xs: 3, sm: 4 },
            pt: { xs: 2, sm: 3 },
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'center', sm: 'flex-start' },
                mb: { xs: 2, sm: 0 }
              }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    sx={{ 
                      mr: 1,
                      '&:hover': { 
                        color: 'primary.light',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography 
                variant="body2" 
                align={isMobile ? "center" : "right"}
                sx={{ opacity: 0.8 }}
              >
                {new Date().getFullYear()} Aadhar Agro. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
