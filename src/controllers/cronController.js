const CronService = require('../services/cron/CronService');

const cronService = new CronService();

const getCronStatus = async (req, res) => {
  try {
    res.json({
      success: true,
      isRunning: cronService.isRunning,
      message: cronService.isRunning ? 'Cron service is running' : 'Cron service is stopped'
    });
  } catch (error) {
    console.error('Get cron status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cron status'
    });
  }
};

module.exports = {
  getCronStatus
}; 