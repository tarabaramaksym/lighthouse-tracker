const { Domain } = require('../models');

const getDomains = async (req, res) => {
  try {
    const domains = await Domain.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      domains
    });
  } catch (error) {
    console.error('Get domains error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve domains'
    });
  }
};

const createDomain = async (req, res) => {
  try {
    let { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    url = url.trim();

    if (url.includes('://')) {
      return res.status(400).json({
        success: false,
        message: 'URL should not include protocol (https://)'
      });
    }

    const existingDomain = await Domain.findOne({
      where: { url, user_id: req.user.id }
    });

    if (existingDomain) {
      return res.status(409).json({
        success: false,
        message: 'Domain already exists for this user'
      });
    }

    const domain = await Domain.create({
      url,
      user_id: req.user.id,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      domain,
      message: 'Domain created successfully'
    });
  } catch (error) {
    console.error('Create domain error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create domain'
    });
  }
};

const deleteDomain = async (req, res) => {
  try {
    const { id } = req.params;

    const domain = await Domain.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found'
      });
    }

    await domain.destroy();

    res.json({
      success: true,
      message: 'Domain deleted successfully'
    });
  } catch (error) {
    console.error('Delete domain error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete domain'
    });
  }
};

module.exports = {
  getDomains,
  createDomain,
  deleteDomain
}; 