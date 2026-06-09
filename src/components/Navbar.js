import React, { useContext } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const { toggleTheme } = useContext(AppContext);

  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: 68 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
          <Box
            component="img"
            src={`${process.env.PUBLIC_URL}/emi-mitra-logo.svg`}
            alt="EMI Mitra logo"
            sx={{
              width: 42,
              height: 42,
              p: 0.5,
              bgcolor: 'background.default',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          />
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
              EMI Mitra
            </Typography>
            <Typography variant="caption" color="text.secondary">
              India EMI planner
            </Typography>
          </Box>
        </Stack>
        <IconButton color="inherit" onClick={toggleTheme}>
          {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
