import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';

const FoundersStoryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h1"
          sx={{ 
            mb: 2,
            color: '#1B4332',
            fontWeight: 700,
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }
          }}
        >
          Our Founder's Story
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            maxWidth: '800px',
            mx: 'auto',
            mb: 4,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          Built from Grit, Driven by Vision: The Story of Satyanarayan G B
        </Typography>
      </Box>

      {/* Hero Section */}
      <Card 
        sx={{ 
          mb: 8,
          bgcolor: 'grey.50',
          overflow: 'hidden',
          boxShadow: 2
        }}
      >
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image="https://i.imgur.com/TRb62t6.jpeg"
              alt="Founder in a field"
              sx={{
                height: { xs: '300px', md: '500px' },
                objectFit: 'cover'
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 6 }}>
              <Typography 
                component="span"
                sx={{ 
                  color: '#2D6A4F',
                  fontWeight: 600,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  mb: 2,
                  display: 'block'
                }}
              >
                FOUNDER
              </Typography>
              <Typography 
                variant="h3"
                sx={{ 
                  mb: 3,
                  color: '#1B4332',
                  fontWeight: 700,
                  fontSize: { xs: '1.875rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.2
                }}
              >
                Satyanarayan G B
              </Typography>
              <Typography 
                sx={{ 
                  color: 'text.secondary',
                  mb: 4,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  lineHeight: 1.8
                }}
              >
                From the dusty lanes of Anjutagi to revolutionizing the agrochemical industry, 
                Satya's journey is one of resilience, vision, and unwavering commitment to empowering 
                Indian farmers with quality products at fair prices.
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Story Content */}
      <Grid container spacing={6} sx={{ mb: 8 }}>
        <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>
          <Card 
            sx={{ 
              p: { xs: 3, md: 6 },
              boxShadow: 1,
              borderRadius: 2
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                color: '#1B4332',
                fontWeight: 700
              }}
            >
              Humble Beginnings
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              In the dusty lanes of Anjutagi, a remote village in Vijaypur district, a
              young boy ran barefoot. Satyanarayan—Satya, as his loved ones called
              him grew up in a world where hardship was a daily companion. His father,
              often away serving the country, left behind lessons that shaped him:
              discipline, integrity, and resilience weren't choices; they were a way
              of life.
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              As the eldest of seven siblings, responsibility came early. The fields
              weren't just landscapes but silent teachers, whispering stories of
              struggle and survival. In their quiet defiance against hardship, a
              realization took hold—some roads are chosen, others are destined.
              Agriculture found him before he found it, and in its embrace, he saw a
              future worth fighting for.
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              Born into a humble middle-class family, Satya learned that values
              mattered more than wealth. His early education took place in a local
              school, where resources were scarce, but his determination was
              boundless. With a passion for agriculture and science, he pursued a
              B.Sc. in Agriculture at UASR, COA Raichur, laying the foundation for
              what would become a distinguished career in the agrochemical industry.
            </Typography>

            <Divider sx={{ my: 6 }} />
            
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                color: '#1B4332',
                fontWeight: 700
              }}
            >
              From Learning to Leading
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              In 1993, Satya began his journey as a Field Officer at ICI. As the
              industry evolved, so did the companies—ICI became Syngenta—and with
              each transformation, Satya adapted, climbed the corporate ladder, and
              gained invaluable experience. But his most pivotal career shift came at
              Coromandel International Ltd., where his leadership in sales and
              marketing earned him recognition, promotions, and influence.
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              Yet, as he rose through the ranks, a troubling reality became
              clear—the agrochemical industry was dominated by multinational
              corporations, dictating prices and limiting access to quality products
              for Indian farmers. After years of understanding the system, he knew it
              was time to change it.
            </Typography>

            <Divider sx={{ my: 6 }} />
            
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                color: '#1B4332',
                fontWeight: 700
              }}
            >
              A Vision Realized: Founding Aadhar Agrochemicals LLP
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              Determined to break the monopoly and empower farmers with genuine
              choices, Satya co-founded Aadhar Agrochemicals LLP with two partners. The mission was clear: to provide high-quality agrochemicals
              at fair prices and ensure accessibility for all farmers.
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              At first, everything seemed to fall into place. With his expertise and
              strong industry connections, the company quickly gained traction. But
              success has a way of testing partnerships. Over time, Satya realized
              that his co-founders didn't share the same long-term vision. Their
              involvement declined, and as challenges mounted, the COVID-19 pandemic
              struck, hitting the company hard.
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              Business slowed, debts piled up, and for the first time, the very
              foundation of Aadhar Agrochemicals seemed at risk.
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              For many, this would have been a breaking point. But Satya wasn't new to
              struggle. He had grown up shouldering responsibilities, learning to
              adapt, and moving forward despite obstacles. This was no different.
            </Typography>

            <Divider sx={{ my: 6 }} />
            
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                color: '#1B4332',
                fontWeight: 700
              }}
            >
              Rebuilding with Purpose
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              Today, he is rebuilding Aadhar Agrochemicals with a renewed sense of
              purpose. The setbacks have only strengthened his commitment—to provide
              farmers with world-class agrochemicals without the burden of unfair
              pricing.
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              This isn't just about reviving a company; it's about reshaping an
              industry. The challenges are far from over, but if Satya's journey has
              proven anything, it's that resilience, vision, and an unwavering
              commitment to fairness can stand against even the biggest forces.
            </Typography>
            
            <Typography paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
              Aadhar Agrochemicals LLP stands today as a testament to Satya's
              determination, bridging the gap between innovation and accessibility in
              the agrochemical industry.
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Quote Section */}
      <Box 
        sx={{ 
          bgcolor: '#1B4332', 
          py: 8,
          px: 4,
          borderRadius: 2,
          mb: 8,
          textAlign: 'center',
          boxShadow: 3
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'white',
            fontWeight: 700,
            fontStyle: 'italic',
            maxWidth: '800px',
            mx: 'auto',
            mb: 4
          }}
        >
          "Agriculture found me before I found it, and in its embrace, I saw a future worth fighting for."
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white',
            fontWeight: 500
          }}
        >
          — Satyanarayan G B
        </Typography>
      </Box>

      {/* Values Section */}
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 6, 
          color: '#1B4332',
          fontWeight: 700,
          textAlign: 'center'
        }}
      >
        Our Core Values
      </Typography>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {[
          {
            title: "Quality Without Compromise",
            description: "We believe every farmer deserves access to world-class agrochemicals that enhance productivity and sustainability."
          },
          {
            title: "Fair Pricing",
            description: "Breaking the monopoly of multinational corporations by offering premium products at fair and transparent prices."
          },
          {
            title: "Accessibility",
            description: "Ensuring our solutions reach farmers across India, regardless of their location or economic status."
          }
        ].map((value, index) => (
          <Grid item key={index} xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 4,
                borderTop: '4px solid #2D6A4F',
                boxShadow: 2,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)'
                }
              }}
            >
              <Typography 
                variant="h5"
                sx={{ 
                  mb: 2,
                  color: '#1B4332',
                  fontWeight: 700
                }}
              >
                {value.title}
              </Typography>
              <Typography 
                sx={{ 
                  color: 'text.secondary',
                  lineHeight: 1.8
                }}
              >
                {value.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FoundersStoryPage;