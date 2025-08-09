const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = extractTokenFromHeader(authHeader);

		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'Access token required'
			});
		}

		const decoded = verifyToken(token);
		if (!decoded) {
			return res.status(401).json({
				success: false,
				message: 'Invalid or expired token'
			});
		}

		const user = await User.findByPk(decoded.userId);
		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'User not found'
			});
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: 'Authentication failed'
		});
	}
};

module.exports = {
	authenticateToken
};

const enforceNotReadOnly = (req, res, next) => {
	if (req.user && req.user.is_read_only) {
		return res.status(403).json({
			success: false,
			message: 'This user is read-only and cannot perform write operations'
		});
	}
	next();
};

module.exports.enforceNotReadOnly = enforceNotReadOnly;