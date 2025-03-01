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
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        stock: parseInt(newProduct.stock),
        images: [imageUrl],
        createdAt: new Date(),
        sizes: newProduct.sizes,
      };
  
      const docRef = await addDoc(collection(db, "products"), productData);
      setProducts([...products, { id: docRef.id, ...productData }]);
  
      // Reset form and close dialog
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: null,
        sizes: [],
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

  // Render functions
  const renderProductsGrid = () => (
    <>
    <Box sx={{ mb: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddProductDialog(true)}
      >
        Add New Product
      </Button>
    </Box>
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={product.images?.[0] || "/placeholder.jpg"}
              alt={product.name}
            />
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                ₹{product.price}
              </Typography>
              <Typography variant="body2">
                Stock: {product.stock}
              </Typography>
            </CardContent>
            <CardActions>
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
    <Dialog open={openAddProductDialog} onClose={() => setOpenAddProductDialog(false)}>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleProductSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            margin="normal"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
            style={{ marginTop: 16 }}
          />
          <TextField
            fullWidth
            label="Available Sizes (comma-separated)"
            value={newProduct.sizes.join(", ")}
            onChange={(e) => setNewProduct({ 
              ...newProduct, 
              sizes: e.target.value.split(",").map(s => s.trim()) 
            })}
            margin="normal"
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
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
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {activeTab === 0 && renderOrdersTable()}
          {activeTab === 1 && userRole === "superAdmin" && renderProductsGrid()}

          {/* Product Edit Dialog */}
          <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                margin="normal"
              />
              {/* Add other product form fields */}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
              <Button onClick={handleProductSubmit} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
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