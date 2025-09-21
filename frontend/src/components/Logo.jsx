import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const Logo = ({ variant = 'default', size = 'medium', sx = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Size variants
  const sizes = {
    small: { width: 32, height: 32 },
    medium: { width: 40, height: 40 },
    large: { width: 56, height: 56 },
  };

  // Logo variants
  const variants = {
    default: (
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          ...sx,
        }}
      >
        <Box
          component="img"
          src="/logos/community-logo.svg"
          alt="Community Logo"
          sx={{
            ...sizes[size],
            transition: 'all 0.3s ease-in-out',
          }}
        />
        {!isMobile && (
          <Typography
            variant="h6"
            component="span"
            sx={{
              ml: 1.5,
              fontWeight: 800,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            Community
          </Typography>
        )}
      </Box>
    ),
    text: (
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          ...sx,
        }}
      >
        <Box
          component="img"
          src="/logos/community-text-logo.svg"
          alt="Community Logo"
          sx={{
            height: sizes[size].height,
            width: 'auto',
            transition: 'all 0.3s ease-in-out',
          }}
        />
      </Box>
    ),
    icon: (
      <Box
        component={motion.div}
        whileHover={{ rotate: 10, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...sx,
        }}
      >
        <Box
          component="img"
          src="/logos/community-logo.svg"
          alt="Community Icon"
          sx={{
            ...sizes[size],
            transition: 'all 0.3s ease-in-out',
          }}
        />
      </Box>
    ),
  };

  return variants[variant] || variants.default;
};

export default Logo;
