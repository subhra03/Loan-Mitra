import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    shape: {
      borderRadius: 8,
    },
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#1267A8', dark: '#0A4574' },
            secondary: { main: '#18A558' },
            warning: { main: '#F59E0B' },
            success: { main: '#18A558' },
            text: { primary: '#17212B', secondary: '#657381' },
            background: {
              default: '#F5F8FB',
              paper: '#FFFFFF',
            },
            divider: '#DCE5EC',
          }
        : {
            primary: { main: '#69B7F5', dark: '#3A86C8' },
            secondary: { main: '#4ADE80' },
            warning: { main: '#FBBF24' },
            success: { main: '#4ADE80' },
            text: { primary: '#EEF5F8', secondary: '#A7B6C4' },
            background: {
              default: '#101820',
              paper: '#17212B',
            },
            divider: '#263847',
          }),
    },
    typography: {
      fontFamily:
        '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
      h5: { fontWeight: 700, letterSpacing: 0 },
      h6: { fontWeight: 700, letterSpacing: 0 },
      button: { fontWeight: 700, textTransform: 'none' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minHeight: '100vh',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            minHeight: 44,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 700,
            minHeight: 44,
            textTransform: 'none',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 700,
          },
        },
      },
    },
  });
