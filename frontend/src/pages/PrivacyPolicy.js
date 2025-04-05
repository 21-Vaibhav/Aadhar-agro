import React from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const PrivacyPolicy = () => {
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
          Privacy Policy
        </Typography>
      </Box>

      {/* Policy Content */}
      <Card sx={{ p: { xs: 3, md: 6 }, boxShadow: 1, borderRadius: 2 }}>
        <CardContent>
          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: 700, color: "#1B4332" }}
              >
                {section.title}
              </Typography>
              {section.content.map((paragraph, pIndex) => (
                <Typography key={pIndex} paragraph sx={{ lineHeight: 1.8 }}>
                  {paragraph}
                </Typography>
              ))}
              {index !== sections.length - 1 && <Divider sx={{ my: 4 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
};

const sections = [
  {
    title: "What Do We Do With Your Information?",
    content: [
      "When you purchase something from our store, we collect personal information such as your name, address, and email address.",
      "We also receive your computer’s IP address when you browse our store to help us understand browser and OS details.",
      "With your permission, we may send emails about our store, new products, and other updates.",
    ],
  },
  {
    title: "Consent",
    content: [
      "When you provide personal information to complete a transaction, verify your credit card, place an order, arrange a delivery, or return a purchase, we imply your consent to collect and use it for that reason.",
      "For secondary reasons like marketing, we will ask directly for your explicit consent or provide an option to decline.",
      "You can withdraw your consent at any time by contacting J S INDUSTRIES at 12-3-180, Rajendra Gunj, Raichur, Karnataka 584101.",
    ],
  },
  {
    title: "Disclosure",
    content: [
      "We may disclose your personal information if required by law or if you violate our Terms of Service.",
    ],
  },
  {
    title: "Payment",
    content: [
      "We use Razorpay for processing payments. Razorpay does not store card data; all transactions comply with PCI-DSS security standards.",
      "Your purchase transaction data is only used to complete the purchase and is not saved afterward.",
      "For more details, visit Razorpay’s terms at https://razorpay.com.",
    ],
  },
  {
    title: "Third-Party Services",
    content: [
      "Third-party providers collect, use, and disclose your information only as needed to perform their services.",
      "Some providers operate in different jurisdictions, meaning your data may be subject to their local laws.",
      "Once you leave our site or are redirected to a third-party service, our Privacy Policy no longer applies.",
    ],
  },
  {
    title: "Security",
    content: [
      "We follow industry best practices to protect your personal information from loss, misuse, or unauthorized access.",
    ],
  },
  {
    title: "Cookies",
    content: [
      "We use cookies to maintain user sessions but do not use them to personally identify you.",
    ],
  },
  {
    title: "Age of Consent",
    content: [
      "By using this site, you confirm you are of the age of majority in your region or have given consent for minors under your care to use the site.",
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    content: [
      "We reserve the right to modify this policy at any time. Changes take effect immediately upon posting.",
      "If our business merges with another company, your information may be transferred to the new entity.",
    ],
  },
  {
    title: "Contact Information",
    content: [
      "For queries or requests regarding your personal data, contact our Privacy Compliance Officer at 7204274605 or mail us at 12-3-180, Rajendra Gunj, Raichur, Karnataka 584101.",
    ],
  },
];

export default PrivacyPolicy;
