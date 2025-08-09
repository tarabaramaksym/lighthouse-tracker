const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
	try {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: 'User with this email already exists'
			});
		}

		const hashedPassword = await hashPassword(password);

		const user = await User.create({
			email,
			password: hashedPassword
		});

		const token = generateToken(user.id);

		const userResponse = {
			id: user.id,
			email: user.email,
			is_read_only: user.is_read_only,
			created_at: user.createdAt,
			updated_at: user.updatedAt
		};

		res.status(201).json({
			success: true,
			user: userResponse,
			token,
			message: 'User registered successfully'
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({
			success: false,
			message: 'Registration failed'
		});
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid credentials'
			});
		}

		const isPasswordValid = await comparePassword(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: 'Invalid credentials'
			});
		}

		const token = generateToken(user.id);

		const userResponse = {
			id: user.id,
			email: user.email,
			is_read_only: user.is_read_only,
			created_at: user.createdAt,
			updated_at: user.updatedAt
		};

		res.json({
			success: true,
			user: userResponse,
			token,
			message: 'Login successful'
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({
			success: false,
			message: 'Login failed'
		});
	}
};

const getMe = async (req, res) => {
	try {
		const userResponse = {
			id: req.user.id,
			email: req.user.email,
			is_read_only: req.user.is_read_only,
			created_at: req.user.createdAt,
			updated_at: req.user.updatedAt
		};

		res.json({
			success: true,
			user: userResponse,
			message: 'User data retrieved successfully'
		});
	} catch (error) {
		console.error('Get user error:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to retrieve user data'
		});
	}
};

module.exports = {
	register,
	login,
	getMe
}; 