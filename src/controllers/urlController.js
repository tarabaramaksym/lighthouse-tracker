const { Website, Domain } = require('../models');

const getUrls = async (req, res) => {
  try {
    const { domainId } = req.params;

    const domain = await Domain.findOne({
      where: { id: domainId, user_id: req.user.id }
    });

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found'
      });
    }

    const urls = await Website.findAll({
      where: { domain_id: domainId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      urls
    });
  } catch (error) {
    console.error('Get URLs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve URLs'
    });
  }
};

const createUrl = async (req, res) => {
  try {
    const { domainId } = req.params;
    let { path } = req.body;

    const domain = await Domain.findOne({
      where: { id: domainId, user_id: req.user.id }
    });

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found'
      });
    }

    if (!path) {
      return res.status(400).json({
        success: false,
        message: 'Path is required'
      });
    }

    path = path.trim();

    if (path.length > 255) {
      return res.status(400).json({
        success: false,
        message: 'Path is too long (maximum 255 characters)'
      });
    }

    if (!/^[\/a-zA-Z0-9\-_\.~!$&'()*+,;=:@%]+$/.test(path)) {
      return res.status(400).json({
        success: false,
        message: 'Path contains invalid characters'
      });
    }

    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    path = path.replace(/\/+/g, '/');
    path = path.replace(/\/$/, '');
    if (path === '') {
      path = '/';
    }

    const existingUrl = await Website.findOne({
      where: { path, domain_id: domainId }
    });

    if (existingUrl) {
      return res.status(409).json({
        success: false,
        message: 'URL already exists for this domain'
      });
    }

    const url = await Website.create({
      path,
      domain_id: domainId
    });

    res.status(201).json({
      success: true,
      url,
      message: 'URL created successfully'
    });
  } catch (error) {
    console.error('Create URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create URL'
    });
  }
};

const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await Website.findOne({
      include: [{
        model: Domain,
        where: { user_id: req.user.id }
      }],
      where: { id }
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    await url.destroy();

    res.json({
      success: true,
      message: 'URL deleted successfully'
    });
  } catch (error) {
    console.error('Delete URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete URL'
    });
  }
};

module.exports = {
  getUrls,
  createUrl,
  deleteUrl
}; 