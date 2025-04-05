import React from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const RefundPolicy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 8, textAlign: "center" }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: 2,
            color: "#1B4332",
            fontWeight: 700,
            fontSize: { xs: "2.5rem", sm: "3rem", md: "3.75rem" },
          }}
        >
          Refund Policy
        </Typography>
      </Box>

      {/* Policy Content */}
      <Grid container spacing={6} sx={{ mb: 8 }}>
        <Grid item xs={12} md={8} sx={{ mx: "auto" }}>
          <Card sx={{ p: { xs: 3, md: 6 }, boxShadow: 1, borderRadius: 2 }}>
            <CardContent>
              <Typography
                variant="h5"
                sx={{ mb: 3, fontWeight: 700, color: "#1B4332" }}
              >
                Cancellation Policy
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                Cancellations will be considered only if the request is made
                within the same day of placing the order. However, if the orders
                have already been processed for shipping, the cancellation
                request may not be entertained.
              </Typography>

              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                J S INDUSTRIES does not accept cancellation requests for
                perishable items such as flowers, eatables, etc. However,
                refund/replacement can be made if the customer establishes that
                the quality of the delivered product is not satisfactory.
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography
                variant="h5"
                sx={{ mb: 3, fontWeight: 700, color: "#1B4332" }}
              >
                Damaged or Defective Products
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                In case of receipt of damaged or defective items, please report
                the issue to our Customer Service team within the same day of
                delivery. The request will be entertained only after the
                merchant has verified and determined the issue at their end.
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography
                variant="h5"
                sx={{ mb: 3, fontWeight: 700, color: "#1B4332" }}
              >
                Product Mismatch or Quality Issues
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                If the product received does not match the description on our
                site or does not meet your expectations, please notify our
                customer service team within the same day of receiving it. After
                reviewing your complaint, an appropriate decision will be made.
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography
                variant="h5"
                sx={{ mb: 3, fontWeight: 700, color: "#1B4332" }}
              >
                Manufacturer Warranty Claims
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                For products covered under manufacturer warranties, please
                contact the manufacturer directly for any complaints or service
                requests.
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Typography
                variant="h5"
                sx={{ mb: 3, fontWeight: 700, color: "#1B4332" }}
              >
                Refund Processing
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                If a refund is approved by J S INDUSTRIES, the amount will be
                processed within 3-5 business days and credited back to the
                original payment method.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RefundPolicy;
