import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from "@mui/material";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const user = auth.currentUser;
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  // Check user authentication and role
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.data()?.role;
        
        if (role !== "superAdmin" && role !== "ordermanager") {
          navigate("/");
          return;
        }
        
        setUserRole(role);
        setLoading(false);
      } catch (err) {
        setError("Failed to verify admin access");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      } catch (err) {
        setError("Failed to fetch orders");
        console.log(err);
      }
    };

    if (!loading && userRole) {
      fetchOrders();
    }
  }, [loading, userRole]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (userRole !== "superAdmin") return;

    try {
      setLoading(true);
      let imageUrl = "";

      if (newProduct.image) {
        const imageRef = ref(storage, `products/${newProduct.image.name}`);
        await uploadBytes(imageRef, newProduct.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        stock: parseInt(newProduct.stock),
        imageUrl,
        createdAt: new Date(),
      });

      setOpenProductDialog(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: null,
      });
    } catch (err) {
      setError("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  if (user) {
  console.log("User is logged in:", user.uid);
} else {
  console.log("User is not logged in");
}

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1">
            Role: {userRole === "superAdmin" ? "Super Admin" : "Order Manager"}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Orders" />
          {userRole === "superAdmin" && <Tab label="Products" />}
        </Tabs>

        {activeTab === 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
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
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt?.toDate()).toLocaleDateString()}
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 1 && userRole === "superAdmin" && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenProductDialog(true)}
            >
              Add New Product
            </Button>
          </Box>
        )}
      </Container>

      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
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
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
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
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
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
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.files[0] })
              }
              style={{ marginTop: 16 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
          <Button onClick={handleProductSubmit} variant="contained" color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminDashboard;
