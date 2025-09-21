import React from 'react';
import { Box, Container, Typography, Paper, Avatar, Grid, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Code as CodeIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
  transition: 'all 0.3s ease-in-out',
}));

const FeatureCard = ({ icon, title, description }) => {
  const theme = useTheme();
  
  return (
    <Grid item xs={12} md={6} lg={3}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        textAlign: 'center',
        p: 3,
      }}>
        <Avatar 
          sx={{ 
            bgcolor: theme.palette.primary.main,
            width: 64, 
            height: 64,
            mb: 2,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Grid>
  );
};

const About = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <CodeIcon fontSize="large" />,
      title: 'Modern Technology Stack',
      description: 'Built with React, Material-UI, and other modern web technologies to ensure a fast and responsive experience.'
    },
    {
      icon: <GroupIcon fontSize="large" />,
      title: 'Community Driven',
      description: 'Join a growing community of developers and enthusiasts sharing knowledge and experiences.'
    },
    {
      icon: <SchoolIcon fontSize="large" />,
      title: 'Learn & Grow',
      description: 'Access a wealth of resources to help you grow your skills and advance your career.'
    },
    {
      icon: <TrophyIcon fontSize="large" />,
      title: 'Achievement System',
      description: 'Earn badges and recognition for your contributions and achievements within the community.'
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              mb: 2
            }}
          >
            About Our Platform
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            maxWidth="800px" 
            mx="auto"
          >
            Empowering developers with the tools and community they need to succeed in the ever-evolving world of technology.
          </Typography>
        </Box>

        <StyledPaper elevation={3}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            Our Mission
          </Typography>
          <Typography paragraph sx={{ mb: 3 }}>
            Our mission is to create a platform where developers of all skill levels can come together to learn, share, and grow. 
            We believe in the power of community-driven knowledge and the importance of making technology accessible to everyone.
          </Typography>
          <Typography paragraph>
            Whether you're just starting your coding journey or you're an experienced developer looking to share your 
            expertise, our platform provides the tools and community support you need to succeed.
          </Typography>
        </StyledPaper>

        <Box mt={8} mb={6}>
          <Typography 
            variant="h4" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Why Choose Us?
          </Typography>
          <Grid container spacing={4} mt={2}>
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </Grid>
        </Box>

        <StyledPaper>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
            Our Story
          </Typography>
          <Typography paragraph sx={{ mb: 3 }}>
            Founded in 2023, our platform was born out of a passion for technology and a desire to create 
            a more connected developer community. What started as a small project has grown into a thriving 
            ecosystem where thousands of developers come to learn, share, and collaborate.
          </Typography>
          <Typography paragraph>
            We're committed to continuous improvement and innovation, always looking for new ways to enhance 
            the developer experience and make technology more accessible to everyone.
          </Typography>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default About;
