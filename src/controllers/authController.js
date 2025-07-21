const register = (req, res) => {
  res.json({ message: 'Register endpoint - logic will be implemented here' });
};

const login = (req, res) => {
  res.json({ message: 'Login endpoint - logic will be implemented here' });
};

const getMe = (req, res) => {
  res.json({ message: 'Get current user endpoint - logic will be implemented here' });
};

module.exports = {
  register,
  login,
  getMe
}; 