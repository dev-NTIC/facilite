const express = require('express');
const router = express.Router();
const { isGuest } = require('../config/authCheck');
const { renderLogin, renderRegister, login, register, logout } = require('../controllers/authController');

router.get('/login', isGuest, renderLogin);
router.get('/register', isGuest, renderRegister);
router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);

module.exports = router;
