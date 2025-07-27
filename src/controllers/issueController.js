const { Issue, Record, Website, Domain, IssueRecord } = require('../models');
const { Op } = require('sequelize');

const getDailyIssues = async (req, res) => {
  try {
    const { domainId, date } = req.params;
    
    const targetDate = date || new Date().toISOString().split('T')[0];

    const domain = await Domain.findOne({
      where: { id: domainId, user_id: req.user.id }
    });

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found'
      });
    }

    const startOfDay = new Date(targetDate + 'T00:00:00.000Z');
    const endOfDay = new Date(targetDate + 'T23:59:59.999Z');

    const records = await Record.findAll({
      include: [
        {
          model: Website,
          as: 'website',
          where: { domain_id: domainId },
          include: [
            {
              model: Domain,
              as: 'domain',
              where: { id: domainId }
            }
          ]
        },
        {
          model: Issue,
          through: { model: IssueRecord },
          as: 'issues'
        }
      ],
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      order: [['createdAt', 'DESC']]
    });

    const issues = await Issue.findAll({
      include: [
        {
          model: Record,
          through: { model: IssueRecord },
          as: 'records',
          where: {
            createdAt: {
              [Op.between]: [startOfDay, endOfDay]
            }
          },
          include: [
            {
              model: Website,
              as: 'website',
              where: { domain_id: domainId }
            }
          ]
        }
      ],
      order: [['category', 'ASC'], ['title', 'ASC']]
    });

    const aggregatedIssues = issues.map(issue => {
      const issueRecords = issue.records.filter(record => 
        record.Website.domain_id === parseInt(domainId)
      );
      
      return {
        id: issue.id,
        issue_id: issue.issue_id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        affected_urls: issueRecords.map(record => ({
          website_id: record.website_id,
          path: record.Website.path,
          record_id: record.id
        })),
        total_affected: issueRecords.length
      };
    });

    const performanceScores = records.length > 0 ? {
      performance: records[0].performance_score,
      accessibility: records[0].accessibility_score,
      best_practices: records[0].best_practices_score,
      seo: records[0].seo_score,
      pwa: records[0].pwa_score
    } : null;

    res.json({
      success: true,
      data: {
        date: targetDate,
        domain: {
          id: domain.id,
          url: domain.url
        },
        performance_scores: performanceScores,
        issues: aggregatedIssues,
        total_issues: aggregatedIssues.length,
        total_records: records.length
      }
    });
  } catch (error) {
    console.error('Get daily issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve daily issues'
    });
  }
};

const getCalendarData = async (req, res) => {
  try {
    const { domainId, year, month } = req.params;
    
    const domain = await Domain.findOne({
      where: { id: domainId, user_id: req.user.id }
    });

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found'
      });
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);

    const records = await Record.findAll({
      include: [
        {
          model: Website,
          as: 'website',
          where: { domain_id: domainId }
        }
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['createdAt', 'ASC']]
    });

    const dailyScores = {};
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(parseInt(year), parseInt(month) - 1, day);
      const dateKey = currentDate.toISOString().split('T')[0];
      
      const dayRecords = records.filter(record => {
        const recordDate = new Date(record.createdAt);
        return recordDate.getDate() === day && 
               recordDate.getMonth() === parseInt(month) - 1 && 
               recordDate.getFullYear() === parseInt(year);
      });

      if (dayRecords.length > 0) {
        const latestRecord = dayRecords[dayRecords.length - 1];
        dailyScores[dateKey] = {
          performance: latestRecord.performance_score,
          accessibility: latestRecord.accessibility_score,
          best_practices: latestRecord.best_practices_score,
          seo: latestRecord.seo_score,
          pwa: latestRecord.pwa_score,
          overall: Math.round(
            (latestRecord.performance_score + 
             latestRecord.accessibility_score + 
             latestRecord.best_practices_score + 
             latestRecord.seo_score + 
             latestRecord.pwa_score) / 5
          )
        };
      }
    }

    res.json({
      success: true,
      data: {
        year: parseInt(year),
        month: parseInt(month),
        domain: {
          id: domain.id,
          url: domain.url
        },
        daily_scores: dailyScores,
        total_days_with_data: Object.keys(dailyScores).length
      }
    });
  } catch (error) {
    console.error('Get calendar data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve calendar data'
    });
  }
};

const getOldestDate = async (req, res) => {
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

    const oldestRecord = await Record.findOne({
      include: [
        {
          model: Website,
          as: 'website',
          where: { domain_id: domainId }
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    if (!oldestRecord) {
      return res.json({
        success: true,
        data: {
          oldest_date: null,
          has_data: false
        }
      });
    }

    const oldestDate = oldestRecord.createdAt.toISOString().split('T')[0];

    res.json({
      success: true,
      data: {
        oldest_date: oldestDate,
        has_data: true
      }
    });
  } catch (error) {
    console.error('Get oldest date error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve oldest date'
    });
  }
};

module.exports = {
  getDailyIssues,
  getCalendarData,
  getOldestDate
}; 