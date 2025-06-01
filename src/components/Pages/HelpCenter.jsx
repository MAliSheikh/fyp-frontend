import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse products, add items to cart, proceed to checkout, and follow payment instructions."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, PayPal, and other major payment methods."
    },
    {
      question: "How can I track my order?",
      answer: "Log into your account and visit the order history section to track your packages."
    },
    {
      question: "What is your return policy?",
      answer: "We offer 30-day returns for most items. Please check specific product return policies."
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Help Center
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default HelpCenter;