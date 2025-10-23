const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

// POST /api/audit/compare - Compare two pages
router.post('/compare', auditController.comparePages);

// GET /api/audit/test - Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Audit API is working!' });
});

module.exports = router;
