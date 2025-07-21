const test = (req, res) => {
  res.json({ 
    message: 'Test API endpoint working!',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
};

module.exports = {
  test
}; 