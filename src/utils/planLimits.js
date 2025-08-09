const getInt = (value, fallback) => {
	const parsed = parseInt(value, 10);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const FREE_PLAN_MAX_DOMAINS = getInt(process.env.FREE_PLAN_MAX_DOMAINS, 1);
const FREE_PLAN_MAX_URLS = getInt(process.env.FREE_PLAN_MAX_URLS, 3);

const PRO_PLAN_MAX_DOMAINS = getInt(process.env.PRO_PLAN_MAX_DOMAINS, 5);
const PRO_PLAN_MAX_URLS = getInt(process.env.PRO_PLAN_MAX_URLS, 10);

const PRO_PLUS_PLAN_MAX_DOMAINS = getInt(process.env.PRO_PLUS_PLAN_MAX_DOMAINS, 100);
const PRO_PLUS_PLAN_MAX_URLS = getInt(process.env.PRO_PLUS_PLAN_MAX_URLS, 20);

const planLimits = {
	free: {
		maxDomains: FREE_PLAN_MAX_DOMAINS,
		maxUrls: FREE_PLAN_MAX_URLS
	},
	pro: {
		maxDomains: PRO_PLAN_MAX_DOMAINS,
		maxUrls: PRO_PLAN_MAX_URLS
	},
	'pro-plus': {
		maxDomains: PRO_PLUS_PLAN_MAX_DOMAINS,
		maxUrls: PRO_PLUS_PLAN_MAX_URLS
	}
};

const getLimitsForPlan = (plan) => {
	return planLimits[plan] || planLimits.free;
};

module.exports = {
	getLimitsForPlan
};


