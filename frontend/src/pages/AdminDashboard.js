import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { Add as AddIcon } from "@mui/icons-material";

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [customerNames, setCustomerNames] = useState({}); // Store names by userId
  const [blogs, setBlogs] = useState([]);
  const [openAddBlogDialog, setOpenAddBlogDialog] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", image: null });
const [categories, setCategories] = useState([]);
const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
const [newCategory, setNewCategory] = useState({
  CategoryName: "",
  image: null,
});

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    longDescription: "",
    price: "",
    category: "",
    stock: "",
    image: null,
    packSizes: [],
    sizes: [],
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    longDescription: "",
    price: "",
    category: "",
    stock: "",
    image: null,
    packSizes: [],
    sizes: [],
  });

  // Authentication check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
  
      try {
        // Changed getDocs to getDoc since we're fetching a single document
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
          navigate("/");
          return;
        }
  
        const role = userDoc.data()?.role;
        
        if (role !== "superAdmin" && role !== "ordermanager") {
          navigate("/");
          return;
        }
        
        setUserRole(role);
        setLoading(false);
      } catch (err) {
        console.error("Auth error:", err);
        setError("Failed to verify admin access");
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);

  //Fetch customer name
  useEffect(() => {
    const fetchCustomerNames = async () => {
      if (!orders || orders.length === 0) return; // Check if orders exist
  
      const newCustomerNames = { ...customerNames };
  
      for (const order of orders) {
        if (!order.userId || newCustomerNames[order.userId]) continue; // Skip if already fetched
  
        try {
          const userRef = doc(db, "users", order.userId);
          const userSnap = await getDoc(userRef);
  
          if (userSnap.exists()) {
            newCustomerNames[order.userId] = userSnap.data().fullName || "Unknown"; // Ensure fullName exists
          } else {
            newCustomerNames[order.userId] = "Unknown";
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          newCustomerNames[order.userId] = "Error";
        }
      }
  
      setCustomerNames(newCustomerNames);
    };
  
    fetchCustomerNames();
  }, [orders]);

  // Fetch orders and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const orderQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const orderSnapshot = await getDocs(orderQuery);
        const ordersList = orderSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersList);

        // Fetch products
        const productSnapshot = await getDocs(collection(db, "products"));
        const productsList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      }
    };

    if (!loading && userRole) {
      fetchData();
    }
  }, [loading, userRole]);

  // Product management functions
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: null,
      sizes: product.sizes || [],
    });
    setOpenProductDialog(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter(p => p.id !== productId));
      setOpenDeleteDialog(false);
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, "products", selectedProduct.id), productData);
      setProducts(products.map(p => 
        p.id === selectedProduct.id ? { ...p, ...productData } : p
      ));
      setOpenProductDialog(false);
    } catch (err) {
      setError("Failed to update product");
    }
  };

  // Order management function

  //random commit to push redeployment
  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError("Failed to update order status");
    }
  };
const handleAddProduct = async (e) => {
  e.preventDefault();
  if (userRole !== "superAdmin") return;

  try {
    setLoading(true);
    let imageUrl = "";

    if (newProduct.image) {
      imageUrl = await convertImageToBase64(newProduct.image);
    }

    const productData = {
      name: newProduct.name,
      shortDescription: newProduct.shortDescription, // Added short description
      description: newProduct.description,
      category: newProduct.category,
      imageUrl: imageUrl, // Single image URL instead of an array
      createdAt: new Date(),
      availableSizes: newProduct.sizes.map((size) => ({
        size: size.size,
        price: parseFloat(size.price),
        stock: parseInt(size.stock),
      })),
    };

    const docRef = await addDoc(collection(db, "products"), productData);
    setProducts([...products, { id: docRef.id, ...productData }]);

    // Reset form and close dialog
    setNewProduct({
      name: "",
      shortDescription: "",
      description: "",
      category: "",
      sizes: [], // Reset sizes
      image: null,
    });
    setOpenAddProductDialog(false);
  } catch (err) {
    setError("Failed to add product");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

const renderProductsGrid = () => (
  <>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Product List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddProductDialog(true)}
      >
        Add New Product
      </Button>
    </Box>

    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <CardMedia
              component="img"
              height="200"
              image={product.imageUrl || "/placeholder.jpg"}
              alt={product.name}
              sx={{ objectFit: "contain", p: 2 }}
            />
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {product.shortDescription}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                ₹{Math.min(...product.availableSizes.map((s) => s.price))} - ₹
                {Math.max(...product.availableSizes.map((s) => s.price))}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Available Sizes:</strong>
                {product.availableSizes.map((size, idx) => (
                  <span key={idx}>
                    {" "}
                    {size.size} ({size.stock} in stock)
                  </span>
                ))}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  setSelectedProduct(product);
                  setOpenDeleteDialog(true);
                }}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Add Product Dialog */}
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openAddProductDialog}
      onClose={() => setOpenAddProductDialog(false)}
    >
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleAddProduct} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Short Description"
            value={newProduct.shortDescription}
            onChange={(e) =>
              setNewProduct({ ...newProduct, shortDescription: e.target.value })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            margin="normal"
            required
          />

          {/* Sizes Input */}
          <Typography
            variant="subtitle1"
            sx={{ mt: 3, mb: 1, fontWeight: "bold" }}
          >
            Available Sizes
          </Typography>
          {newProduct.sizes.map((size, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <TextField
                label="Size"
                value={size.size}
                onChange={(e) => {
                  const updatedSizes = [...newProduct.sizes];
                  updatedSizes[index].size = e.target.value;
                  setNewProduct({ ...newProduct, sizes: updatedSizes });
                }}
                required
                sx={{ flex: 1 }}
              />
              <TextField
                label="Price"
                type="number"
                value={size.price}
                onChange={(e) => {
                  const updatedSizes = [...newProduct.sizes];
                  updatedSizes[index].price = parseFloat(e.target.value);
                  setNewProduct({ ...newProduct, sizes: updatedSizes });
                }}
                required
                sx={{ flex: 1 }}
              />
              <TextField
                label="Stock"
                type="number"
                value={size.stock}
                onChange={(e) => {
                  const updatedSizes = [...newProduct.sizes];
                  updatedSizes[index].stock = parseInt(e.target.value);
                  setNewProduct({ ...newProduct, sizes: updatedSizes });
                }}
                required
                sx={{ flex: 1 }}
              />
              <IconButton
                color="error"
                onClick={() => {
                  setNewProduct({
                    ...newProduct,
                    sizes: newProduct.sizes.filter((_, i) => i !== index),
                  });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() =>
              setNewProduct({
                ...newProduct,
                sizes: [
                  ...newProduct.sizes,
                  { size: "", price: "", stock: "" },
                ],
              })
            }
          >
            + Add Size
          </Button>

          {/* Image Upload */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Product Image
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.files[0] })
              }
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => setOpenAddProductDialog(false)}>Cancel</Button>
        <Button onClick={handleAddProduct} variant="contained" color="primary">
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  </>
);



  const renderOrdersTable = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <TableRow>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>{customerNames[order.userId] || "Loading..."}</TableCell>
                <TableCell>
                  {order.createdAt?.toDate().toLocaleDateString()}
                </TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                  <Collapse in={expandedOrder === order.id}>
                    <Box sx={{ margin: 1 }}>
                      <Typography variant="h6" gutterBottom component="div">
                        Order Details
                      </Typography>
                      <Typography variant="subtitle2">
                        Shipping Address:
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingAddress?.street}<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                        {order.shippingAddress?.pinCode}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 2 }}>
                        Products:
                      </Typography>
                      {order.products?.map((product, index) => (
                        <Typography key={index} variant="body2">
                          {product.name} - Quantity: {product.quantity} - ₹{product.price}
                        </Typography>
                      ))}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  //blog admin section

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogSnapshot = await getDocs(collection(db, "articles"));
        const blogList = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogList);
      } catch (err) {
        setError("Failed to fetch blogs");
        console.error(err);
      }
    };
  
    if (!loading && userRole) {
      fetchBlogs();
    }
  }, [loading, userRole]);
  
  const handleAddBlog = async () => {
    if (userRole !== "superAdmin") return;
  
    try {
      let imageUrl = "";
      if (newBlog.image) {
        imageUrl = await convertImageToBase64(newBlog.image);
      }
  
      const blogData = {
        title: newBlog.title,
        content: newBlog.content,
        imageUrl,
        date: new Date(),
      };
  
      const docRef = await addDoc(collection(db, "articles"), blogData);
      setBlogs([...blogs, { id: docRef.id, ...blogData }]);
      setNewBlog({ title: "", content: "", image: null });
      setOpenAddBlogDialog(false);
    } catch (err) {
      setError("Failed to add blog");
      console.error(err);
    }
  };
  const renderBlogsSection = () => (
    <>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenAddBlogDialog(true)}>
          Add New Blog
        </Button>
      </Box>
  
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <Card>
              <CardMedia component="img" height="200" image={blog.imageUrl || "/placeholder.jpg"} alt={blog.title} />
              <CardContent>
                <Typography variant="h6">{blog.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {blog.content.substring(0, 100)}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="error" onClick={() => handleDeleteBlog(blog.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
  
      {/* Add Blog Dialog */}
      <Dialog open={openAddBlogDialog} onClose={() => setOpenAddBlogDialog(false)}>
        <DialogTitle>Add New Blog</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Blog Title"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            margin="normal" required
          />
          <TextField
            fullWidth label="Content"
            value={newBlog.content}
            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            margin="normal" multiline rows={4} required
          />
          <input
            type="file" accept="image/*"
            onChange={(e) => setNewBlog({ ...newBlog, image: e.target.files[0] })}
            style={{ marginTop: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddBlogDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBlog} variant="contained" color="primary">Add Blog</Button>
        </DialogActions>
      </Dialog>
    </>
  );
  const handleDeleteBlog = async (blogId) => {
    try {
      await deleteDoc(doc(db, "articles", blogId));
      setBlogs(blogs.filter(blog => blog.id !== blogId));
    } catch (err) {
      setError("Failed to delete blog");
      console.error(err);
    }
  };

  //categories section

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, "Categories"));
        const categoriesList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);
      } catch (err) {
        setError("Failed to fetch categories");
        console.error(err);
      }
    };

    if (!loading && userRole === "superAdmin") {
      fetchCategories();
    }
  }, [loading, userRole]);

  const handleAddCategory = async () => {
    if (userRole !== "superAdmin") return;

    try {
      setLoading(true);
      let imageUrl = "";

      if (newCategory.image) {
        imageUrl = await convertImageToBase64(newCategory.image);
      }

      const categoryData = {
        CategoryName: newCategory.CategoryName,
        imageUrl: imageUrl,
      };

      const docRef = await addDoc(collection(db, "Categories"), categoryData);
      setCategories([...categories, { id: docRef.id, ...categoryData }]);

      // Reset form and close dialog
      setNewCategory({ CategoryName: "", image: null });
      setOpenAddCategoryDialog(false);
    } catch (err) {
      setError("Failed to add category");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle deleting a category
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(db, "Categories", categoryId));
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    } catch (err) {
      setError("Failed to delete category");
      console.error(err);
    }
  };
const renderCategoriesSection = () => (
  <>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        mt: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Product Categories
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpenAddCategoryDialog(true)}
      >
        Add New Category
      </Button>
    </Box>

    <Grid container spacing={3}>
      {categories.map((category) => (
        <Grid item xs={12} sm={6} md={4} key={category.id}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 4,
              },
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={category.imageUrl || "/placeholder.jpg"}
              alt={category.CategoryName}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold" align="center">
                {category.CategoryName}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteCategory(category.id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Add Category Dialog */}
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openAddCategoryDialog}
      onClose={() => setOpenAddCategoryDialog(false)}
    >
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategory.CategoryName}
            onChange={(e) =>
              setNewCategory({ ...newCategory, CategoryName: e.target.value })
            }
            margin="normal"
            required
          />

          {/* Image Upload */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Category Image
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewCategory({ ...newCategory, image: e.target.files[0] })
              }
            />
            {newCategory.image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {newCategory.image.name}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => setOpenAddCategoryDialog(false)}>Cancel</Button>
        <Button
          onClick={handleAddCategory}
          variant="contained"
          color="primary"
          disabled={!newCategory.CategoryName || !newCategory.image}
        >
          Add Category
        </Button>
      </DialogActions>
    </Dialog>
  </>
);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
          >
            <Tab label="orders" />
            {userRole === "superAdmin" && <Tab label="Products" />}
            {userRole === "superAdmin" && <Tab label="Blogs" />}
            {userRole === "superAdmin" && <Tab label="Categories" />}
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {activeTab === 0 && renderOrdersTable()}
          {activeTab === 1 && userRole === "superAdmin" && renderProductsGrid()}
          {activeTab === 2 && userRole === "superAdmin" && renderBlogsSection()}
          {activeTab === 3 &&
            userRole === "superAdmin" &&
            renderCategoriesSection()}

          {/* Product Edit Dialog */}
          <Dialog
            open={openProductDialog}
            onClose={() => setOpenProductDialog(false)}
          >
            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Name"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                margin="normal"
              />
              {/* Add other product form fields */}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenProductDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleProductSubmit} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this product?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
              <Button
                onClick={() => handleDeleteProduct(selectedProduct?.id)}
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;