import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Alert
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const AuditForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    myUrl: '',
    competitorUrl: '',
    keyword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.myUrl.trim()) {
      newErrors.myUrl = 'Your page URL is required';
    } else if (!isValidUrl(formData.myUrl)) {
      newErrors.myUrl = 'Please enter a valid URL (including http:// or https://)';
    }

    if (!formData.competitorUrl.trim()) {
      newErrors.competitorUrl = 'Competitor page URL is required';
    } else if (!isValidUrl(formData.competitorUrl)) {
      newErrors.competitorUrl = 'Please enter a valid URL (including http:// or https://)';
    }

    if (!formData.keyword.trim()) {
      newErrors.keyword = 'Target keyword is required';
    } else if (formData.keyword.trim().length < 2) {
      newErrors.keyword = 'Keyword should be at least 2 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Start Your SEO Audit
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Enter your page URL, a competitor's page URL, and the target keyword you want to analyze.
        Our tool will compare both pages and provide detailed SEO recommendations.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Your Page URL"
            name="myUrl"
            value={formData.myUrl}
            onChange={handleChange}
            error={!!errors.myUrl}
            helperText={errors.myUrl}
            placeholder="https://example.com/your-page"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Competitor Page URL"
            name="competitorUrl"
            value={formData.competitorUrl}
            onChange={handleChange}
            error={!!errors.competitorUrl}
            helperText={errors.competitorUrl}
            placeholder="https://competitor.com/their-page"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Target Keyword"
            name="keyword"
            value={formData.keyword}
            onChange={handleChange}
            error={!!errors.keyword}
            helperText={errors.keyword}
            placeholder="e.g., 'best seo tools'"
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<CompareArrowsIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          Compare Pages & Generate Report
        </Button>
      </Box>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> The analysis may take 30-60 seconds depending on page complexity.
          Make sure both URLs are accessible and not blocked by robots.txt or authentication.
        </Typography>
      </Alert>
    </Box>
  );
};

export default AuditForm;
