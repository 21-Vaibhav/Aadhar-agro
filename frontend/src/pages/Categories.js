import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Card,
  CardMedia,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // Adjust path as needed

// Styled components
const CategoryCard = styled(Card)(({ theme }) => ({
  position: "relative",
  height: 280,
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  transition: "transform 0.3s",
  boxShadow: theme.shadows[4],
  "&:hover": {
    transform: "translateY(-8px)",
    "& .overlay": {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, "Categories");
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          CategoryName: doc.data().CategoryName,
          imageUrl: doc.data().imageUrl,
        }));

        setCategories(categoriesList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again later.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: { xs: 5, md: 10 } }}>
      <Typography
        variant="h2"
        align="center"
        sx={{
          mb: { xs: 3, md: 5 },
          fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
          fontWeight: 700,
        }}
      >
        Product Categories
      </Typography>

      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        sx={{
          mb: { xs: 4, md: 6 },
          maxWidth: "800px",
          mx: "auto",
          fontSize: { xs: "1rem", md: "1.2rem" },
        }}
      >
        Explore our comprehensive range of agricultural solutions designed to
        optimize crop yield and quality
      </Typography>

      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <CategoryCard>
              <StyledCardMedia
                image={category.imageUrl}
                title={category.CategoryName}
              />
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: { xs: 2.5, md: 3 },
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  transition: "background-color 0.3s",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    mb: 2,
                    fontWeight: 600,
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                  }}
                >
                  {category.CategoryName}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  onClick={() => navigate(`/category/${category.CategoryName}`)}
                  sx={{ fontWeight: 500, px: 3 }}
                >
                  View Products
                </Button>
              </Box>
            </CategoryCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Categories;
