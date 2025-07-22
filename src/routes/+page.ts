import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		seo: {
			description: "Empowering tenants, policy-makers, and governments to research landlords in the state, even when their identities are obscured."
		}
	};
};