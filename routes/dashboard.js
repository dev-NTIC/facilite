const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/authCheck');
const { renderDashboard } = require('../controllers/dashboardController');

router.get('/', isAuthenticated, renderDashboard);

module.exports = router;
