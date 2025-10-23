import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import AuditForm from './components/AuditForm';
import ComparisonResults from './components/ComparisonResults';
import LoadingSpinner from './components/LoadingSpinner';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [auditResults, setAuditResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuditSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setAuditResults(null);

    try {
      const response = await fetch('http://localhost:3004/api/audit/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAuditResults(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            SEO Audit & Competitor Analysis Tool
          </Typography>

          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
            Compare your website's SEO performance with your competitors and get actionable recommendations
          </Typography>

          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <AuditForm onSubmit={handleAuditSubmit} />

            {loading && <LoadingSpinner />}

            {error && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                <Typography color="error.main">
                  Error: {error}
                </Typography>
              </Box>
            )}

            {auditResults && <ComparisonResults results={auditResults} />}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
