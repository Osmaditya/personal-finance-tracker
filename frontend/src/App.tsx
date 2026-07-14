import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';
import theme from './theme/theme';
import { router } from './routes';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense
          fallback={
            <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
