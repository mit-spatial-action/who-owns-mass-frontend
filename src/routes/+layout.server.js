import { env } from '$env/dynamic/private';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
    return {
      mapbox_token: env.MAPBOX_TOKEN
    }
  };