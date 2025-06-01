import React from 'react';
import { 
  Box,
  Container,
  Grid,
  Link,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import { styled } from '@mui/material/styles';

// Custom styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#009688',
  color: 'white',
  padding: theme.spacing(4, 0),
  position: 'relative',
  bottom: 0,
  width: '100%'
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: 'white',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
  display: 'block',
  marginBottom: theme.spacing(1),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const socialIcons = [
    { icon: <InstagramIcon />, url: '#' },
    { icon: <TwitterIcon />, url: '#' },
    { icon: <FacebookIcon />, url: '#' }
  ];

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={25}>
          {/* Help & Information */}
          <Grid item xs={12} sm={4}>
            <SectionTitle variant="h6">
              Help & Information
            </SectionTitle>
            <FooterLink href="#">Contact Us</FooterLink>
            <FooterLink href="#">Help Center</FooterLink>
          </Grid>

          {/* About Bazaar Nest */}
          <Grid item xs={12} sm={4}>
            <SectionTitle variant="h6">
              About Bazaar Nest
            </SectionTitle>
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Privacy Statement</FooterLink>
          </Grid>

          {/* More From Us */}
          <Grid item xs={12} sm={4}>
            <SectionTitle variant="h6">
              More From Us
            </SectionTitle>
            <FooterLink href="#">Become a seller?</FooterLink>
            
            {/* Social Media Icons */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              {socialIcons.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.url}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{ 
            mt: 4, 
            pt: 2, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: isMobile ? '0.75rem' : '0.875rem'
          }}
        >
          copyright reserved © Bazaar Nest 2024
        </Typography>
      </Container>
    </FooterContainer>
  );
};

export default Footer;