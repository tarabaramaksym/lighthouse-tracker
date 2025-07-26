const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const authRoutes = [
  { path: '/register', method: 'post', handler: register, validation: validateRegistration },
  { path: '/login', method: 'post', handler: login, validation: validateLogin }
];

authRoutes.forEach(route => {
  const middleware = [route.validation, route.handler];
  
  if (process.env.NODE_ENV === 'production') {
    middleware.unshift(authLimiter);
  }
  
  router[route.method](route.path, ...middleware);
});

router.get('/me', authenticateToken, getMe);

module.exports = router; 