import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const ContactPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Simple email submission using mailto link for demo
      // In production, you should use a form submission service or backend API
      const subject = `Contact Form Submission from ${formData.name}`;
      const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Message:
${formData.comment}
      `;

      // For development/demo, open mail client
      window.location.href = `mailto:aadharagroindia@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Show success message
      setSnackbar({
        open: true,
        message: "Form submitted successfully!",
        severity: "success",
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        comment: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbar({
        open: true,
        message: "There was an error submitting the form. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ mb: 2, color: "#1B4332", fontWeight: 700 }}
        >
          Contact us
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: "800px", mx: "auto", mb: 4 }}
        >
          Kindly share any feedback regarding the products/service to this form.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          maxWidth: "800px",
          mx: "auto",
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone number"
                name="phone"
                variant="outlined"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comment"
                name="comment"
                multiline
                rows={4}
                variant="outlined"
                value={formData.comment}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                By submitting, I accept the{" "}
                <Link href="/terms-of-service">Terms of service</Link> and
                acknowledge the{" "}
                <Link href="/privacy-policy">Privacy policy</Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<EmailIcon />}
                sx={{
                  bgcolor: "#000",
                  borderRadius: "24px",
                  px: 4,
                  "&:hover": {
                    bgcolor: "#333",
                  },
                }}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage;
