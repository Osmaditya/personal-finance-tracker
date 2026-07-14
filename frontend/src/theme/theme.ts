import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main: '#4F46E5',
      light: '#6366F1',
      dark: '#3730A3',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },

    success: {
      main: '#22C55E',
    },

    warning: {
      main: '#F59E0B',
    },

    error: {
      main: '#EF4444',
    },

    info: {
      main: '#3B82F6',
    },

    background: {
      default: '#09090B',
      paper: '#18181B',
    },

    text: {
      primary: '#FAFAFA',
      secondary: '#A1A1AA',
    },

    divider: 'rgba(255,255,255,0.08)',
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    h1: {
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },

    h2: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 600,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    subtitle1: {
      fontWeight: 500,
    },

    subtitle2: {
      fontWeight: 500,
    },

    body1: {
      lineHeight: 1.7,
    },

    body2: {
      color: '#A1A1AA',
    },

    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '0.95rem',
    },
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'linear-gradient(180deg, #09090B 0%, #111827 100%)',
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 22px',
          fontWeight: 700,
          transition: 'all .25s ease',
        },

        contained: {
          boxShadow: 'none',

          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(79,70,229,.35)',
          },
        },

        outlined: {
          borderWidth: 1.5,

          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#18181B',
          borderRadius: 18,
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 12px 30px rgba(0,0,0,.35)',
          transition: 'all .3s ease',

          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 16px 35px rgba(0,0,0,.45)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#18181B',
          borderRadius: 16,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,

          '& fieldset': {
            borderColor: 'rgba(255,255,255,.10)',
          },

          '&:hover fieldset': {
            borderColor: '#6366F1',
          },

          '&.Mui-focused fieldset': {
            borderColor: '#4F46E5',
            borderWidth: 2,
          },
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all .25s ease',

          '&:hover': {
            backgroundColor: 'rgba(99,102,241,.08)',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111827',
          borderRight: '1px solid rgba(255,255,255,.08)',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(17,24,39,.82)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,.08)',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 10,
          fontSize: '0.8rem',
        },
      },
    },
  },
});

export default theme;