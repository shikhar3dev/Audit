import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  LinearProgress,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GetAppIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';
import PrintIcon from '@mui/icons-material/Print';
import SpeedIcon from '@mui/icons-material/Speed';
import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';

const ComparisonResults = ({ results }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Safe data preparation with fallbacks
  const safeTechnicalData = [
    { category: 'Performance', myPage: results.myPage.technical.performance?.score || 0, competitor: results.competitorPage.technical.performance?.score || 0 },
    { category: 'SEO', myPage: results.myPage.technical.seo?.score || 0, competitor: results.competitorPage.technical.seo?.score || 0 },
    { category: 'Accessibility', myPage: results.myPage.technical.accessibility?.score || 0, competitor: results.competitorPage.technical.accessibility?.score || 0 },
    { category: 'Best Practices', myPage: results.myPage.technical.bestPractices?.score || 0, competitor: results.competitorPage.technical.bestPractices?.score || 0 }
  ];

  const safeKeywordData = [
    { name: 'Density', myPage: results.myPage.keywordAnalysis?.density || 0, competitor: results.competitorPage.keywordAnalysis?.density || 0 },
    { name: 'Frequency', myPage: results.myPage.keywordAnalysis?.frequency || 0, competitor: results.competitorPage.keywordAnalysis?.frequency || 0 },
    { name: 'Score', myPage: results.myPage.keywordAnalysis?.score || 0, competitor: results.competitorPage.keywordAnalysis?.score || 0 }
  ];

  const safeScoreData = [
    { category: 'On-Page SEO', myPage: results.myPage.scores?.onPage || 0, competitor: results.competitorPage.scores?.onPage || 0 },
    { category: 'Content', myPage: results.myPage.scores?.content || 0, competitor: results.competitorPage.scores?.content || 0 },
    { category: 'Technical', myPage: results.myPage.scores?.technical || 0, competitor: results.competitorPage.scores?.technical || 0 },
    { category: 'Schema', myPage: results.myPage.scores?.schema || 0, competitor: results.competitorPage.scores?.schema || 0 },
    { category: 'Keywords', myPage: results.myPage.scores?.keywordOptimization || 0, competitor: results.competitorPage.scores?.keywordOptimization || 0 }
  ];

  const schemaData = results.myPage.schema.map((schema, index) => ({
    name: schema.type,
    myPage: 1,
    competitor: results.competitorPage.schema.some(s => s.type === schema.type) ? 1 : 0
  }));

  const exportToJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `seo-audit-${results.comparison.meta.keyword.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportToCSV = () => {
    const csvData = [
      ['Metric', 'Your Page', 'Competitor', 'Winner'],
      ['Overall Score', results.comparison.scores.myPage, results.comparison.scores.competitorPage, results.comparison.scores.myPage > results.comparison.scores.competitorPage ? 'You' : 'Competitor'],
      ['On-Page SEO', results.myPage.scores.onPage, results.competitorPage.scores.onPage, results.myPage.scores.onPage > results.competitorPage.scores.onPage ? 'You' : 'Competitor'],
      ['Content Score', results.myPage.scores.content, results.competitorPage.scores.content, results.myPage.scores.content > results.competitorPage.scores.content ? 'You' : 'Competitor'],
      ['Technical Score', results.myPage.scores.technical, results.competitorPage.scores.technical, results.myPage.scores.technical > results.competitorPage.scores.technical ? 'You' : 'Competitor'],
      ['Schema Score', results.myPage.scores.schema, results.competitorPage.scores.schema, results.myPage.scores.schema > results.competitorPage.scores.schema ? 'You' : 'Competitor'],
      ['Keyword Score', results.myPage.scores.keywordOptimization, results.competitorPage.scores.keywordOptimization, results.myPage.scores.keywordOptimization > results.competitorPage.scores.keywordOptimization ? 'You' : 'Competitor'],
      ['Word Count', results.myPage.content.wordCount, results.competitorPage.content.wordCount, results.myPage.content.wordCount > results.competitorPage.content.wordCount ? 'You' : 'Competitor'],
      ['Backlinks', results.backlinks.myPage.totalBacklinks, results.backlinks.competitorPage.totalBacklinks, results.backlinks.myPage.totalBacklinks > results.backlinks.competitorPage.totalBacklinks ? 'You' : 'Competitor']
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);

    const exportFileDefaultName = `seo-audit-${results.comparison.meta.keyword.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const shareResults = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Analysis URL copied to clipboard!');
    });
  };

  const printReport = () => {
    window.print();
  };

  const renderScoreChart = () => {
    if (!safeScoreData || safeScoreData.length === 0) {
      return (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>SEO Score Comparison</Typography>
            <Typography variant="body2" color="text.secondary">
              No score data available
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>SEO Score Comparison</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={safeScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip />
              <Bar dataKey="myPage" fill="#8884d8" name="Your Page" />
              <Bar dataKey="competitor" fill="#82ca9d" name="Competitor" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderKeywordChart = () => {
    if (!safeKeywordData || safeKeywordData.length === 0) {
      return (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Keyword Optimization</Typography>
            <Typography variant="body2" color="text.secondary">
              No keyword data available
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Keyword Optimization</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={safeKeywordData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar name="Your Page" dataKey="myPage" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Competitor" dataKey="competitor" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <ChartTooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderTechnicalChart = () => {
    if (!safeTechnicalData || safeTechnicalData.length === 0) {
      return (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Technical Performance</Typography>
            <Typography variant="body2" color="text.secondary">
              No technical data available
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Technical Performance</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={safeTechnicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip />
              <Bar dataKey="myPage" fill="#8884d8" name="Your Page" />
              <Bar dataKey="competitor" fill="#82ca9d" name="Competitor" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderSchemaChart = () => {
    if (!results.myPage.schema || results.myPage.schema.length === 0) {
      return (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Schema Markup Coverage</Typography>
            <Typography variant="body2" color="text.secondary">
              No schema data available
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Schema Markup Coverage</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1">Your Page</Typography>
              <Typography variant="h4" color="primary">{results.myPage.schema.length}</Typography>
              <Typography variant="body2">Schema Types</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1">Competitor</Typography>
              <Typography variant="h4" color="secondary">{results.competitorPage.schema.length}</Typography>
              <Typography variant="body2">Schema Types</Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Your Schema Types:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {results.myPage.schema.map((schema, index) => (
                <Chip key={index} label={schema.type} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderKeywordMap = () => {
    if (!results.myPage.keywordAnalysis || !results.competitorPage.keywordAnalysis) {
      return (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Keyword Placement Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              No keyword analysis data available
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Keyword Placement Analysis</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" gutterBottom>Your Page</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.myPage.keywordAnalysis.positions.inTitle ? 'success' : 'disabled'} />
                  <Typography variant="body2">Title</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.myPage.keywordAnalysis.positions.inDescription ? 'success' : 'disabled'} />
                  <Typography variant="body2">Meta Description</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.myPage.keywordAnalysis.positions.inH1 ? 'success' : 'disabled'} />
                  <Typography variant="body2">H1 Heading</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.myPage.keywordAnalysis.positions.inFirst100Words ? 'success' : 'disabled'} />
                  <Typography variant="body2">First 100 Words</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" gutterBottom>Competitor</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.competitorPage.keywordAnalysis.positions.inTitle ? 'success' : 'disabled'} />
                  <Typography variant="body2">Title</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.competitorPage.keywordAnalysis.positions.inDescription ? 'success' : 'disabled'} />
                  <Typography variant="body2">Meta Description</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.competitorPage.keywordAnalysis.positions.inH1 ? 'success' : 'disabled'} />
                  <Typography variant="body2">H1 Heading</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.competitorPage.keywordAnalysis.positions.inFirst100Words ? 'success' : 'disabled'} />
                  <Typography variant="body2">First 100 Words</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderSERPFeatures = () => {
    if (!results.serpFeatures || !results.serpFeatures.myPage || !results.serpFeatures.competitorPage) {
      return (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>SERP Features</Typography>
            <Typography variant="body2" color="text.secondary">
              No SERP feature data available
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>SERP Features - Your Page</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.serpFeatures.myPage.hasFeaturedSnippet ? 'success' : 'disabled'} />
                  <Typography variant="body2">Featured Snippet</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.serpFeatures.myPage.hasKnowledgePanel ? 'success' : 'disabled'} />
                  <Typography variant="body2">Knowledge Panel</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.serpFeatures.myPage.hasPeopleAlsoAsk ? 'success' : 'disabled'} />
                  <Typography variant="body2">People Also Ask</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.serpFeatures.myPage.hasLocalPack ? 'success' : 'disabled'} />
                  <Typography variant="body2">Local Pack</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Est. Position:</strong> {results.serpFeatures.myPage.estimatedPosition || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Search Volume:</strong> {results.serpFeatures.myPage.searchVolume?.toLocaleString() || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>SERP Features - Competitor</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.serpFeatures.competitorPage.hasFeaturedSnippet ? 'success' : 'disabled'} />
                  <Typography variant="body2">Featured Snippet</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.serpFeatures.competitorPage.hasKnowledgePanel ? 'success' : 'disabled'} />
                  <Typography variant="body2">Knowledge Panel</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.serpFeatures.competitorPage.hasPeopleAlsoAsk ? 'success' : 'disabled'} />
                  <Typography variant="body2">People Also Ask</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color={results.serpFeatures.competitorPage.hasLocalPack ? 'success' : 'disabled'} />
                  <Typography variant="body2">Local Pack</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Est. Position:</strong> {results.serpFeatures.competitorPage.estimatedPosition || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Search Volume:</strong> {results.serpFeatures.competitorPage.searchVolume?.toLocaleString() || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderBacklinks = () => {
    if (!results.backlinks || !results.backlinks.myPage || !results.backlinks.competitorPage) {
      return (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Backlink Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              No backlink data available
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Backlink Profile - Your Page</Typography>
              <Typography variant="h4" color="primary">{results.backlinks.myPage.totalBacklinks.toLocaleString()}</Typography>
              <Typography variant="body2" gutterBottom>Total Backlinks</Typography>

              <Typography variant="h5" color="secondary">{results.backlinks.myPage.referringDomains}</Typography>
              <Typography variant="body2" gutterBottom>Referring Domains</Typography>

              <Typography variant="body1">
                <strong>Domain Authority:</strong> {results.backlinks.myPage.domainAuthority}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Toxic Links:</strong> {results.backlinks.myPage.toxicBacklinks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Backlink Profile - Competitor</Typography>
              <Typography variant="h4" color="primary">{results.backlinks.competitorPage.totalBacklinks.toLocaleString()}</Typography>
              <Typography variant="body2" gutterBottom>Total Backlinks</Typography>

              <Typography variant="h5" color="secondary">{results.backlinks.competitorPage.referringDomains}</Typography>
              <Typography variant="body2" gutterBottom>Referring Domains</Typography>

              <Typography variant="body1">
                <strong>Domain Authority:</strong> {results.backlinks.competitorPage.domainAuthority}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Toxic Links:</strong> {results.backlinks.competitorPage.toxicBacklinks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderContentGaps = () => {
    if (!results.contentGaps || !results.contentGaps.myUniqueTerms || !results.contentGaps.competitorUniqueTerms) {
      return (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Content Gap Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              No content gap data available
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Content Gap Analysis</Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Your Unique Topics</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {results.contentGaps.myUniqueTerms.slice(0, 10).map((term, index) => (
                  <Chip key={index} label={term} size="small" variant="outlined" />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Competitor Unique Topics</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {results.contentGaps.competitorUniqueTerms.slice(0, 10).map((term, index) => (
                  <Chip key={index} label={term} size="small" />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Content Depth</Typography>
              <Typography variant="body2">
                <strong>Your Coverage:</strong> {(results.contentGaps.topicalCoverage.myCoverage * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2">
                <strong>Competitor Coverage:</strong> {(results.contentGaps.topicalCoverage.competitorCoverage * 100).toFixed(1)}%
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  const getWinnerIcon = (winner) => {
    if (winner === 'myPage') return <CheckCircleIcon color="success" />;
    if (winner === 'competitorPage') return <ErrorIcon color="error" />;
    return <WarningIcon color="warning" />;
  };

  const renderComparisonTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Metric</strong></TableCell>
            <TableCell align="center"><strong>Your Page</strong></TableCell>
            <TableCell align="center"><strong>Competitor</strong></TableCell>
            <TableCell align="center"><strong>Winner</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Overall SEO Score</TableCell>
            <TableCell align="center">
              <Chip
                label={`${results.comparison.scores.myPage}/100`}
                color={getScoreColor(results.comparison.scores.myPage)}
                variant="outlined"
              />
            </TableCell>
            <TableCell align="center">
              <Chip
                label={`${results.comparison.scores.competitorPage}/100`}
                color={getScoreColor(results.comparison.scores.competitorPage)}
                variant="outlined"
              />
            </TableCell>
            <TableCell align="center">
              {getWinnerIcon(results.comparison.scores.myPage > results.comparison.scores.competitorPage ? 'myPage' :
                           results.comparison.scores.competitorPage > results.comparison.scores.myPage ? 'competitorPage' : 'tie')}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Meta Title (chars)</TableCell>
            <TableCell align="center">{results.myPage.meta.title.length}</TableCell>
            <TableCell align="center">{results.competitorPage.meta.title.length}</TableCell>
            <TableCell align="center">
              {getWinnerIcon(results.myPage.meta.title.length > results.competitorPage.meta.title.length ? 'myPage' : 'competitorPage')}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Word Count</TableCell>
            <TableCell align="center">{results.myPage.content.wordCount}</TableCell>
            <TableCell align="center">{results.competitorPage.content.wordCount}</TableCell>
            <TableCell align="center">
              {getWinnerIcon(results.myPage.content.wordCount > results.competitorPage.content.wordCount ? 'myPage' : 'competitorPage')}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Schema Types</TableCell>
            <TableCell align="center">{results.myPage.schema.length}</TableCell>
            <TableCell align="center">{results.competitorPage.schema.length}</TableCell>
            <TableCell align="center">
              {getWinnerIcon(results.myPage.schema.length > results.competitorPage.schema.length ? 'myPage' : 'competitorPage')}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Internal Links</TableCell>
            <TableCell align="center">{results.myPage.links.internal.length}</TableCell>
            <TableCell align="center">{results.competitorPage.links.internal.length}</TableCell>
            <TableCell align="center">
              {getWinnerIcon(results.myPage.links.internal.length > results.competitorPage.links.internal.length ? 'myPage' : 'competitorPage')}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderRecommendations = () => {
    const categories = [
      { key: 'quickWins', title: 'Quick Wins', icon: <TrendingUpIcon />, color: 'success' },
      { key: 'technical', title: 'Technical SEO', icon: <SpeedIcon />, color: 'info' },
      { key: 'content', title: 'Content Optimization', icon: <ArticleIcon />, color: 'primary' },
      { key: 'schema', title: 'Schema Markup', icon: <CodeIcon />, color: 'secondary' }
    ];

    return (
      <Box>
        {categories.map((category) => (
          <Accordion key={category.key}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {category.icon}
                <Typography variant="h6">{category.title}</Typography>
                <Chip
                  label={results.recommendations[category.key].length}
                  size="small"
                  color={category.color}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {results.recommendations[category.key].map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={rec.title}
                      secondary={rec.description}
                    />
                    <Chip
                      label={rec.priority}
                      size="small"
                      color={rec.priority === 'High' ? 'error' : rec.priority === 'Medium' ? 'warning' : 'success'}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          SEO Analysis Results
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Export as JSON">
            <IconButton onClick={exportToJSON} color="primary">
              <GetAppIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export as CSV">
            <IconButton onClick={exportToCSV} color="primary">
              <GetAppIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share Results">
            <IconButton onClick={shareResults} color="primary">
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print Report">
            <IconButton onClick={printReport} color="primary">
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Analysis completed on {new Date(results.comparison.meta.analysisDate).toLocaleDateString()}
          for keyword: <strong>"{results.comparison.meta.keyword}"</strong>
        </Typography>
      </Alert>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Visualizations" />
          <Tab label="SEO Analysis" />
          <Tab label="Detailed Comparison" />
          <Tab label="Recommendations" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Your Page Score</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h3" color={`${getScoreColor(results.comparison.scores.myPage)}.main`}>
                    {results.comparison.scores.myPage}
                  </Typography>
                  <Chip label={getScoreLabel(results.comparison.scores.myPage)} color={getScoreColor(results.comparison.scores.myPage)} />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={results.comparison.scores.myPage}
                  sx={{ mt: 2, height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Competitor Score</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h3" color={`${getScoreColor(results.comparison.scores.competitorPage)}.main`}>
                    {results.comparison.scores.competitorPage}
                  </Typography>
                  <Chip label={getScoreLabel(results.comparison.scores.competitorPage)} color={getScoreColor(results.comparison.scores.competitorPage)} />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={results.comparison.scores.competitorPage}
                  sx={{ mt: 2, height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {renderScoreChart()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderKeywordChart()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderTechnicalChart()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderKeywordMap()}
          </Grid>
          <Grid item xs={12}>
            {renderSchemaChart()}
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Box>
          {renderSERPFeatures()}
          <Box sx={{ mt: 3 }}>
            {renderBacklinks()}
          </Box>
          <Box sx={{ mt: 3 }}>
            {renderContentGaps()}
          </Box>
        </Box>
      )}

      {activeTab === 3 && renderComparisonTable()}

      {activeTab === 4 && renderRecommendations()}
    </Box>
  );
};

export default ComparisonResults;
