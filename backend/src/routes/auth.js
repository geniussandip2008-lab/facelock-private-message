const express = require('express');
const router = express.Router();

// Temporary auth test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth route working' });
});

module.exports = router;