import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  Slider,
  Typography,
  InputAdornment,
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category: urlCategory } = useParams() || {};
  const [category, setCategory] = useState(urlCategory || 'all');
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [categories, setCategories] = useState(['all']);
  const [fuse, setFuse] = useState(null);
  const productsPerPage = 12;



  // Initialize Fuse.js for fuzzy search
  useEffect(() => {
    if (products.length > 0) {
      const fuseOptions = {
        keys: ['name', 'description'],
        threshold: 0.3,
        distance: 100
      };
      setFuse(new Fuse(products, fuseOptions));
    }
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Extract unique categories and price range, filter out undefined/null values
        const uniqueCategories = ['all', ...new Set(productsList.map(p => p.Category).filter(Boolean))];
        const prices = productsList.map(p => p.price || 0);
        const maxPrice = Math.max(...prices);
        
        setCategories(uniqueCategories);
        setPriceRange([0, maxPrice || 10000]);
        setProducts(productsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setCategory(urlCategory || 'all');
    setPage(1);
  }, [urlCategory]);

  const handleCategoryChange = (event) => {
  const newCategory = event.target.value;
  navigate(newCategory === 'all' ? '/products' : `/category/${newCategory}`);
  setCategory(newCategory);
  setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Apply search if query exists
    if (searchQuery && fuse) {
      const searchResults = fuse.search(searchQuery);
      filtered = searchResults.map(result => result.item);
    }

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(product => product.Category && product.Category === category);
    }

    // Apply price filter
    filtered = filtered.filter(product => 
      product.price && product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ 
                backgroundColor: 'background.paper',
                px: 1,
                transform: 'translate(14px, -6px) scale(0.75)'
              }}>
                Category
              </InputLabel>
              <Select value={category} onChange={handleCategoryChange}>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ 
                backgroundColor: 'background.paper',
                px: 1,
                transform: 'translate(14px, -6px) scale(0.75)'
              }}>
                Sort By
              </InputLabel>
              <Select value={sortBy} onChange={handleSortChange}>
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Products"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={Math.max(...products.map(p => p.price))}
              valueLabelFormat={(value) => `₹${value}`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">₹{priceRange[0]}</Typography>
              <Typography variant="body2">₹{priceRange[1]}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {displayedProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default Products;