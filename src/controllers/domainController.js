const { Domain } = require('../models');
const ScheduleValidator = require('../services/cron/ScheduleValidator');

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
		let { url, lighthouse_schedule } = req.body;

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

		if (lighthouse_schedule && !ScheduleValidator.isValid15MinuteInterval(lighthouse_schedule)) {
			return res.status(400).json({
				success: false,
				message: 'Lighthouse schedule must be in 15-minute intervals (e.g., 12:15, 22:30)'
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
			status: 'active',
			lighthouse_schedule: lighthouse_schedule ? ScheduleValidator.formatTime(lighthouse_schedule) : null
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

const updateDomain = async (req, res) => {
	try {
		const { id } = req.params;
		const { url, status, lighthouse_schedule } = req.body;

		const domain = await Domain.findOne({
			where: { id, user_id: req.user.id }
		});

		if (!domain) {
			return res.status(404).json({
				success: false,
				message: 'Domain not found'
			});
		}

		if (lighthouse_schedule && !ScheduleValidator.isValid15MinuteInterval(lighthouse_schedule)) {
			return res.status(400).json({
				success: false,
				message: 'Lighthouse schedule must be in 15-minute intervals (e.g., 12:15, 22:30)'
			});
		}

		const updateData = {};
		if (url !== undefined) updateData.url = url.trim();
		if (status !== undefined) updateData.status = status;
		if (lighthouse_schedule !== undefined) {
			updateData.lighthouse_schedule = lighthouse_schedule ? ScheduleValidator.formatTime(lighthouse_schedule) : null;
		}

		await domain.update(updateData);

		res.json({
			success: true,
			domain,
			message: 'Domain updated successfully'
		});
	} catch (error) {
		console.error('Update domain error:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to update domain'
		});
	}
};

const getValidScheduleTimes = async (req, res) => {
	try {
		const validTimes = ScheduleValidator.getValidTimes();

		res.json({
			success: true,
			validTimes
		});
	} catch (error) {
		console.error('Get valid schedule times error:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to retrieve valid schedule times'
		});
	}
};

module.exports = {
	getDomains,
	createDomain,
	updateDomain,
	deleteDomain,
	getValidScheduleTimes
}; 