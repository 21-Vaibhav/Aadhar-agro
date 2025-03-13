import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const BlogArticlePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // For demo purposes - replace with actual data fetching
  useEffect(() => {
    // Simulate fetching article data
    const fetchArticle = async () => {
      setLoading(true);
      
      // Sample article data - replace with your actual data fetching logic
      const sampleArticle = {
        id: id || '1',
        title: "Empowering Farmers Through Sustainable Practices",
        category: "Farming",
        date: "February 20, 2024",
        author: {
          name: "Rahul Sharma",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
          role: "Agricultural Scientist"
        },
        image: "https://kj1bcdn.b-cdn.net/media/99488/nanofertiliser.jpg",
        content: `
          <p>Sustainable farming is revolutionizing agriculture in India, offering solutions to some of our most pressing challenges. As climate change and resource scarcity become increasingly urgent issues, farmers are turning to innovative methods that balance productivity with environmental stewardship.</p>
          
          <h2>The Evolution of Sustainable Farming</h2>
          
          <p>Traditional agricultural practices in India have long emphasized harmony with nature. However, the Green Revolution, while increasing yields, also introduced practices that have led to soil degradation, water pollution, and biodiversity loss. Today's sustainable farming movement seeks to combine traditional wisdom with modern scientific innovations.</p>
          
          <p>One of the key approaches gaining traction is regenerative agriculture, which focuses on rebuilding soil organic matter and restoring degraded soil biodiversity. This not only improves carbon sequestration but also enhances the water cycle and increases yields over time.</p>
          
          <h2>Key Sustainable Practices</h2>
          
          <p>Several sustainable farming techniques are making a significant impact across India:</p>
          
          <ul>
            <li><strong>Crop Rotation:</strong> Planting different crops in sequence to improve soil health and reduce pest pressure</li>
            <li><strong>Organic Farming:</strong> Eliminating synthetic inputs in favor of natural alternatives</li>
            <li><strong>Water Conservation:</strong> Implementing drip irrigation and rainwater harvesting</li>
            <li><strong>Agroforestry:</strong> Integrating trees and shrubs into crop and animal farming systems</li>
          </ul>
          
          <p>These practices not only benefit the environment but also often reduce input costs for farmers, improving their financial resilience in the face of market fluctuations.</p>
          
          <h2>Technology and Sustainable Farming</h2>
          
          <p>Modern technology is playing an increasingly important role in sustainable agriculture. Precision farming tools allow farmers to apply inputs more efficiently, reducing waste and environmental impact. Mobile applications help farmers monitor weather patterns, soil conditions, and market prices, enabling more informed decision-making.</p>
          
          <p>Innovations in biotechnology are also contributing to sustainability goals. For example, drought-resistant crop varieties help farmers adapt to changing climate conditions without increasing their reliance on irrigation.</p>
          
          <h2>The Road Ahead</h2>
          
          <p>While progress has been made, challenges remain in scaling sustainable practices across India's diverse agricultural landscape. Access to information, appropriate technologies, and financial resources continue to be barriers for many farmers, particularly smallholders.</p>
          
          <p>Government policies supporting sustainable agriculture, along with private sector investments and NGO initiatives, will be crucial in overcoming these challenges. By working together, we can create a more resilient and sustainable food system that benefits farmers, consumers, and the planet.</p>
        `,
        tags: ["Sustainable Farming", "Organic Agriculture", "Food Security", "Climate Resilience"]
      };
      
      setArticle(sampleArticle);

      const spraySmartArticle = {
        id: '3',
        title: "Spray Smart, Protect More: The Science Behind Effective Pesticide & Fungicide Use",
        category: "Farming",
        date: "March 12, 2025",
        author: {
          name: "Dr. Arjun Patel",
          image: "https://randomuser.me/api/portraits/men/45.jpg",
          role: "Agricultural Specialist"
        },
        image: "https://kj1bcdn.b-cdn.net/media/99488/nanofertiliser.jpg",
        content: `
          <p>Spraying pesticides and fungicides is essential for protecting crops, but improper spraying can reduce effectiveness, waste chemicals, and harm plants, soil, and health. By following the right time, method, and safety precautions, farmers can maximize protection and minimize losses.</p>
          
          <h2>Ideal Time for Spraying</h2>
          
          <p>Timing is crucial when it comes to effective pesticide and fungicide application. Agricultural experts recommend specific timeframes for optimal results:</p>
          
          <ul>
            <li><strong>Early morning (6-9 AM) or late afternoon (4-7 PM)</strong> — This prevents chemical evaporation and ensures better absorption.</li>
            <li><strong>Avoid spraying during strong wind or rain</strong> — Wind causes drift, wasting chemicals, while rain washes them off before they can be effective.</li>
          </ul>
          
          <p>Following these timing guidelines ensures that valuable agricultural inputs aren't wasted and that crops receive maximum protection from pests and diseases.</p>
          
          <h2>Correct Spraying Technique</h2>
          
          <p>The method of application is just as important as the timing. Proper technique ensures uniform coverage and maximum effectiveness:</p>
          
          <ul>
            <li><strong>Use a fine-mist sprayer</strong> for uniform coverage across plant surfaces</li>
            <li><strong>Maintain a 30 cm distance</strong> from the crop to prevent runoff and waste</li>
            <li><strong>Use crisscross spraying patterns</strong> to ensure every part of the plant is covered</li>
            <li><strong>Wear protective gear</strong> — gloves, masks, and goggles to prevent harmful exposure</li>
          </ul>
          
          <p>These techniques not only improve the effectiveness of crop protection products but also reduce waste and minimize environmental impact.</p>
          
          <h2>Choosing the Right Sprays</h2>
          
          <p>Different pests and diseases require specific treatments. Using the right product for each problem ensures effective control:</p>
          
          <p><strong>For sucking pests (aphids, whiteflies, jassids):</strong><br>
          ACETAPRID (Acetamiprid 20% SP) or OPTIMA (Thiamethoxam 25% WG) are highly effective against these soft-bodied pests.</p>
          
          <p><strong>For soil-borne pests (termites, root grubs):</strong><br>
          RECENT (Fipronil 5% SC) provides long-lasting soil protection against these destructive pests.</p>
          
          <p><strong>For caterpillars & borers:</strong><br>
          BENZO (Emamectin Benzoate 5% SG) delivers a quick knockdown effect on these crop-damaging insects.</p>
          
          <p><strong>For fungal diseases:</strong><br>
          HEXA PLUS (Hexaconazole 5% SC) and TWILT (Propiconazole 25% EC) effectively prevent and cure fungal infections like powdery mildew, rust, and leaf spot.</p>
          
          <h2>Common Mistakes to Avoid</h2>
          
          <p>Even experienced farmers can make mistakes that reduce the effectiveness of pesticides and fungicides:</p>
          
          <ul>
            <li><strong>Spraying in extreme heat</strong> — Chemicals evaporate before absorption, wasting product and money</li>
            <li><strong>Using an incorrect dose</strong> — Overuse harms plants and reduces soil health without improving results</li>
            <li><strong>Mixing incompatible products</strong> — Can cause crop damage or reduced effectiveness of both products</li>
          </ul>
          
          <h2>Conclusion</h2>
          
          <p>Using scientifically developed pesticides and fungicides with the right spraying techniques helps increase crop protection, reduce waste, and improve productivity. By following these guidelines, farmers can ensure their crops receive maximum protection while minimizing environmental impact and preserving their own health and safety.</p>
        `,
        tags: ["Pest Management", "Crop Protection", "Sustainable Farming", "Agricultural Chemicals"]
      };
      
      setArticle(spraySmartArticle);

      const sowItRightArticle = {
        id: '2',
        title: "Sow It Right, Reap It Big: Proven Techniques for Maximum Yield",
        category: "Farming",
        date: "March 12, 2025",
        author: {
          name: "Priya Desai",
          image: "https://randomuser.me/api/portraits/women/28.jpg",
          role: "Agronomy Expert"
        },
        image: "https://kj1bcdn.b-cdn.net/media/99488/nanofertiliser.jpg",
        content: `
          <p>Sowing is the foundation of a good harvest. If done incorrectly, it can lead to uneven germination, weak plants, and lower yields. Using scientific sowing techniques with plant growth regulators (PGRs) ensures better root strength, faster growth, and maximum yield.</p>
          
          <h2>Best Time to Sow</h2>
          
          <p>Timing is everything when it comes to successful crop establishment. Different crop categories have specific optimal sowing windows:</p>
          
          <ul>
            <li><strong>Kharif crops (paddy, ragi, jowar):</strong> June-July</li>
            <li><strong>Rabi crops (wheat, mustard, Bengal gram):</strong> October-November</li>
          </ul>
          
          <p>Planting within these windows allows crops to take advantage of seasonal rainfall patterns and temperature conditions, giving them the best chance for healthy development.</p>
          
          <h2>Steps for Better Germination</h2>
          
          <p>Proper germination is crucial for establishing a strong crop stand. Follow these scientific approaches to ensure optimal results:</p>
          
          <p><strong>Pre-sowing seed treatment:</strong> Soak seeds in BERLINN (Gibberellic Acid) at 2-5 ppm for 12 hours to improve germination rates and early growth vigor.</p>
          
          <p><strong>Proper sowing depth:</strong></p>
          <ul>
            <li>Cereals (ragi, maize): 3-5 cm deep, 20-25 cm row spacing</li>
            <li>Pulses (tur dal, moong dal): 3-4 cm deep, 30 cm row spacing</li>
          </ul>
          
          <p><strong>Moisture management:</strong> Ensure soil moisture is at an optimum level—not too dry or too wet—to support uniform germination.</p>
          
          <p>These practices help establish a strong foundation for your crop, leading to healthier plants and improved yields.</p>
          
          <h2>Common Mistakes to Avoid</h2>
          
          <p>Even experienced farmers sometimes make errors during the sowing process that can impact final yields:</p>
          
          <ul>
            <li><strong>Sowing too deep</strong> — This delays germination and produces weak seedlings that struggle to emerge</li>
            <li><strong>Overcrowding</strong> — When plants are too close together, they compete for nutrients, light, and water, reducing overall yield</li>
            <li><strong>Ignoring soil preparation</strong> — Poor soil structure and fertility lead to weak plant growth from the beginning</li>
          </ul>
          
          <p>Avoiding these common mistakes can significantly improve crop establishment and subsequent yield potential.</p>
          
          <h2>The Role of Plant Growth Regulators</h2>
          
          <p>Modern agriculture has benefited significantly from the scientific application of plant growth regulators (PGRs). These substances, when used correctly, can enhance various aspects of plant development:</p>
          
          <ul>
            <li>Improved germination rates and uniformity</li>
            <li>Enhanced root development for better nutrient uptake</li>
            <li>More vigorous early growth, leading to stronger plants</li>
            <li>Increased resistance to environmental stresses</li>
          </ul>
          
          <p>Products like BERLINN can make a significant difference in crop establishment when used as part of a comprehensive sowing strategy.</p>
          
          <h2>Conclusion</h2>
          
          <p>By using scientifically designed PGRs like BERLINN and following proper sowing techniques, farmers can ensure faster seed germination, stronger roots, and healthier crops for a higher yield and profit. The foundation of a successful harvest begins with proper sowing—get it right, and you're already on your way to maximum productivity.</p>
        `,
        tags: ["Seed Treatment", "Crop Management", "Agricultural Techniques", "Plant Growth Regulators"]
      };
      
      setArticle(sowItRightArticle);

      const hiddenCostArticle = {
        id: '3',
        title: "The Hidden Cost of Wrong Spraying: How Misuse of Chemicals Can Destroy Your Crop",
        category: "Farming",
        date: "March 12, 2025",
        author: {
          name: "Dr. Vikram Singh",
          image: "https://randomuser.me/api/portraits/men/52.jpg",
          role: "Agricultural Toxicologist"
        },
        image: "https://kj1bcdn.b-cdn.net/media/99488/nanofertiliser.jpg",
        content: `
          <p>Using pesticides, fungicides, and herbicides without proper knowledge can harm crops, soil, and human health. Following a scientific approach ensures maximum efficiency and minimal risks while protecting your investment and the environment.</p>
          
          <h2>Why Unscientific Use is Dangerous</h2>
          
          <p>The improper use of agricultural chemicals carries significant risks that many farmers may not immediately recognize:</p>
          
          <ul>
            <li><strong>Overuse of chemicals damages soil fertility</strong> — Excessive application can kill beneficial microorganisms and reduce soil health over time</li>
            <li><strong>Incorrect mixing leads to chemical reactions</strong> — Some combinations can neutralize each other or create compounds that are harmful to crops</li>
            <li><strong>Spraying at the wrong time increases pest resistance</strong> — Improper timing can lead to pests developing immunity to chemicals, making future control more difficult</li>
          </ul>
          
          <p>These issues not only waste expensive inputs but can also lead to long-term productivity decline and environmental damage.</p>
          
          <h2>Safe and Effective Usage</h2>
          
          <p>Following scientific guidelines for chemical application ensures better results while minimizing risks:</p>
          
          <p><strong>Follow recommended dosage</strong> — Overuse doesn't mean better results; it often leads to waste and damage</p>
          
          <p><strong>Use the right chemical for the specific pest or disease:</strong></p>
          <ul>
            <li>For sucking pests: SHAKTH (Quinalphos 25% EC)</li>
            <li>For caterpillars & borers: BENZO (Emamectin Benzoate 5% SG)</li>
            <li>For fungal infections: TWILT (Propiconazole 25% EC)</li>
            <li>For weed control: GLYPHO (Glyphosate 41% SL)</li>
          </ul>
          
          <p>Using targeted solutions for specific problems ensures maximum effectiveness while minimizing chemical usage.</p>
          
          <h2>Common Mistakes to Avoid</h2>
          
          <p>Even experienced farmers can make errors that reduce the effectiveness of crop protection chemicals:</p>
          
          <ul>
            <li><strong>Spraying during hot hours</strong> — High temperatures lead to rapid evaporation, reducing absorption and effectiveness</li>
            <li><strong>Using expired products</strong> — Chemical degradation over time can significantly reduce effectiveness</li>
            <li><strong>Not wearing protective gear</strong> — Exposure to agricultural chemicals can cause both acute and chronic health issues</li>
          </ul>
          
          <h2>The Economic Impact</h2>
          
          <p>The misuse of agricultural chemicals has significant economic consequences:</p>
          
          <ul>
            <li>Wasted inputs that provide no benefit but still cost money</li>
            <li>Reduced yields due to crop damage or inadequate pest control</li>
            <li>Long-term productivity decline from soil degradation</li>
            <li>Potential health costs from improper handling and exposure</li>
          </ul>
          
          <p>By following proper application protocols, farmers can avoid these hidden costs and maximize their return on investment.</p>
          
          <h2>Conclusion</h2>
          
          <p>By following scientific practices and using tested solutions, farmers can protect their crops while maintaining soil health and ensuring safety. The proper use of agricultural chemicals is not just about immediate pest control—it's an investment in long-term farm productivity and sustainability.</p>
        `,
        tags: ["Chemical Safety", "Crop Protection", "Sustainable Agriculture", "Farm Management"]
      };
      
      setArticle(hiddenCostArticle);
      const stopWeedsArticle = {
        id: '4',
        title: "Stop Weeds, Save Crops: The Right Way to Use Herbicides for a Bumper Harvest",
        category: "Farming",
        date: "March 12, 2025",
        author: {
          name: "Ananya Verma",
          image: "https://randomuser.me/api/portraits/women/36.jpg",
          role: "Weed Management Specialist"
        },
        image: "https://kj1bcdn.b-cdn.net/media/99488/nanofertiliser.jpg",
        content: `
          <p>Weeds compete with crops for nutrients, water, and sunlight, reducing yield. Using scientifically formulated herbicides helps keep fields clean and productive, but timing and application methods are crucial for success.</p>
          
          <h2>The Weed Challenge</h2>
          
          <p>Weeds are more than just an eyesore in agricultural fields—they're serious competitors that can significantly impact crop productivity:</p>
          
          <ul>
            <li>They can reduce crop yields by 10-80% if left uncontrolled</li>
            <li>Some weeds serve as hosts for pests and diseases</li>
            <li>Weeds can interfere with harvesting operations</li>
            <li>They can reduce the quality and value of harvested products</li>
          </ul>
          
          <p>Effective weed management is therefore essential for maximizing agricultural productivity and profitability.</p>
          
          <h2>Best Time for Herbicide Application</h2>
          
          <p>Timing is critical when it comes to herbicide application. Different approaches are needed depending on the crop's growth stage and the weed population:</p>
          
          <ul>
            <li><strong>Pre-emergence application:</strong> Herbicides should be applied before weeds germinate to prevent them from emerging.</li>
            <li><strong>Post-emergence application:</strong> If weeds have already sprouted, apply herbicides when they are young (below 4 inches) for maximum effectiveness.</li>
          </ul>
      
          <h2>Best Herbicides for Maximum Effectiveness</h2>
      
          <p>Selecting the right herbicide is key to effective weed control. Here are some scientifically proven options:</p>
      
          <ul>
            <li><strong>For general weed control:</strong> Use <em>GLYPHO (Glyphosate 41% SL)</em> to eliminate a broad spectrum of weeds.</li>
            <li><strong>For paddy fields:</strong> Apply <em>WEEDOUT (Pretilachlor 50% EC)</em> to target weeds specific to rice crops.</li>
            <li><strong>For non-selective control:</strong> Use <em>SWATCH (Paraquat Dichloride 24% SL)</em> for areas requiring complete vegetation clearance.</li>
          </ul>
      
          <h2>Mistakes to Avoid</h2>
      
          <p>Even with the right herbicides, mistakes in application can lead to poor results:</p>
      
          <ul>
            <li>❌ <strong>Spraying when weeds are too mature</strong> – Older weeds develop resistance, making herbicides less effective.</li>
            <li>❌ <strong>Applying in dry soil</strong> – Herbicides require adequate soil moisture for proper absorption.</li>
            <li>❌ <strong>Using incorrect doses</strong> – Overuse can harm crops and reduce soil health, while underuse may not control weeds effectively.</li>
          </ul>
      
          <h2>Conclusion</h2>
      
          <p>By using scientifically formulated herbicides and applying them at the right time, farmers can effectively control weeds and boost their crop yields. A well-managed field free of weeds leads to healthier plants, higher productivity, and increased profitability.</p>
        `
      };
    
      setArticle(stopWeedsArticle);

      
      // Sample related posts
      const sampleRelatedPosts = [
        {
          id: '2',
          title: "Science-Driven Approaches to Better Yields",
          excerpt: "Discover how our research-backed methods are helping farmers achieve better crop yields sustainably.",
          image: "https://media.istockphoto.com/id/1028041762/photo/farmer-harrowing-agricultural-field-by-a-large-harrowing-machine.jpg?s=612x612&w=0&k=20&c=4wltUeKKvYr88Z_D7g2RCPzAHG6grCZ7iXRt69eehKM=",
          category: "Research",
          date: "Feb 18, 2024"
        },
        {
          id: '3',
          title: "Water Conservation Techniques for Modern Farming",
          excerpt: "Learn effective strategies to optimize water usage while maintaining crop quality and yield.",
          image: "https://www.researchgate.net/publication/338423569/figure/fig2/AS:970373928189954@1608293875676/Drip-irrigation-system-for-the-high-density-apple-orchard.png",
          category: "Water Management",
          date: "Feb 15, 2024"
        },
        {
          id: '4',
          title: "Traditional Wisdom in Modern Agriculture",
          excerpt: "How ancient farming techniques are being rediscovered and integrated with contemporary practices.",
          image: "https://im.indiatimes.in/content/2023/May/farmers_6459be0e4b151.jpg",
          category: "Traditional Farming",
          date: "Feb 12, 2024"
        }
      ];
      
      setRelatedPosts(sampleRelatedPosts);
      setLoading(false);
    };
    
    fetchArticle();
  }, [id]);

  const handleBack = () => {
    navigate('/blog');
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading article...</Typography>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <Typography>Article not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link color="inherit" href="/" underline="hover">
          Home
        </Link>
        <Link color="inherit" href="/blog" underline="hover">
          Blog
        </Link>
        <Typography color="text.primary">{article.title}</Typography>
      </Breadcrumbs>
      
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 4, color: '#2D6A4F' }}
      >
        Back to Articles
      </Button>
      
      {/* Article Header */}
      <Box sx={{ mb: 6 }}>
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
          {article.category}
        </Typography>
        <Typography 
          variant="h1" 
          sx={{ 
            mb: 3,
            color: '#1B4332',
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
            lineHeight: 1.2
          }}
        >
          {article.title}
        </Typography>
        
        {/* Article Meta */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item>
            <Avatar src={article.author.image} alt={article.author.name} />
          </Grid>
          <Grid item xs>
            <Typography fontWeight={600}>{article.author.name}</Typography>
            <Typography variant="body2" color="text.secondary">{article.author.role}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="text.secondary">{article.date}</Typography>
          </Grid>
        </Grid>
        
        {/* Tags */}
        <Box sx={{ mb: 4 }}>
          {article.tags.map(tag => (
            <Chip 
              key={tag} 
              label={tag} 
              sx={{ 
                mr: 1, 
                mb: 1, 
                backgroundColor: '#E8F5E9', 
                color: '#2D6A4F',
                '&:hover': {
                  backgroundColor: '#C8E6C9'
                }
              }} 
            />
          ))}
        </Box>
      </Box>
      
      {/* Featured Image */}
      <Box 
        sx={{ 
          width: '100%', 
          height: { xs: '300px', md: '500px' }, 
          mb: 6,
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3
        }}
      >
        <img 
          src={article.image} 
          alt={article.title}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
        />
      </Box>
      
      {/* Article Content */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 6, p: { xs: 2, md: 4 } }}>
            <CardContent sx={{ p: 0 }}>
              <div dangerouslySetInnerHTML={{ __html: article.content }} style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#333',
              }} />
            </CardContent>
          </Card>
          
          {/* Share and Save Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
            <Button startIcon={<ShareIcon />} variant="outlined" sx={{ borderColor: '#2D6A4F', color: '#2D6A4F' }}>
              Share Article
            </Button>
            <Button startIcon={<BookmarkBorderIcon />} variant="outlined" sx={{ borderColor: '#2D6A4F', color: '#2D6A4F' }}>
              Save for Later
            </Button>
          </Box>
          
          {/* Author Card */}
          <Card sx={{ mb: 6, p: { xs: 3, md: 4 }, bgcolor: '#F8F9FA' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={3} md={2}>
                <Avatar 
                  src={article.author.image} 
                  alt={article.author.name}
                  sx={{ width: { xs: 80, md: 100 }, height: { xs: 80, md: 100 }, mx: 'auto' }}
                />
              </Grid>
              <Grid item xs={12} sm={9} md={10}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{article.author.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{article.author.role}</Typography>
                <Typography variant="body2">
                  An agricultural expert with over 15 years of experience in sustainable farming practices. 
                  Passionate about helping Indian farmers adopt eco-friendly methods while improving their yields and livelihoods.
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Related Articles */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  fontWeight: 700,
                  color: '#1B4332',
                  borderBottom: '2px solid #2D6A4F',
                  paddingBottom: 1
                }}
              >
                Related Articles
              </Typography>
              
              {relatedPosts.map(post => (
                <Box key={post.id} sx={{ mb: 3, pb: 3, borderBottom: '1px solid #E0E0E0' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <img 
                        src={post.image} 
                        alt={post.title}
                        style={{ 
                          width: '100%', 
                          height: '80px', 
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Typography 
                        variant="subtitle2"
                        sx={{ 
                          fontWeight: 600,
                          mb: 1,
                          color: '#1B4332',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.date}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: '#2D6A4F',
                  color: '#2D6A4F',
                  '&:hover': {
                    backgroundColor: '#E8F5E9',
                    borderColor: '#1B4332'
                  }
                }}
              >
                View All Articles
              </Button>
            </CardContent>
          </Card>
          
  {/* Newsletter Signup */}
  <Card sx={{ bgcolor: '#E8F5E9', mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  fontWeight: 700,
                  color: '#1B4332'
                }}
              >
                Subscribe to Our Newsletter
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Get the latest farming tips, research insights, and agricultural news straight to your inbox.
              </Typography>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: '1px solid #2D6A4F',
                    fontSize: '16px'
                  }}
                />
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: '#2D6A4F', color: '#fff', '&:hover': { bgcolor: '#1B4332' } }}
                >
                  Subscribe
                </Button>
              </Box>
            </CardContent>
          </Card>
          </Grid> 
      </Grid>
    </Container>
  );
};

export default BlogArticlePage; 