import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		seo: {
			title: "Who We Are",
			description: "Developed by Eric Robsky Huntley's Spatial Analysis and Action Research Group (MIT). Supported by the Healthy Neighborhoods Study and the Conservation Law Foundation."
		}
	};
};