type Plan = 'free' | 'pro' | 'pro-plus' | undefined;

export function getPlanLimits(plan: Plan) {
	switch (plan) {
		case 'pro':
			return { maxDomains: 5, maxUrls: 10 };
		case 'pro-plus':
			return { maxDomains: 100, maxUrls: 20 };
		case 'free':
		default:
			return { maxDomains: 1, maxUrls: 3 };
	}
}


