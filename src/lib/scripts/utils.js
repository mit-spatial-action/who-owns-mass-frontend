import mapbox from 'mapbox-gl';
import { goto, invalidate } from '$app/navigation';

const key = Symbol();

export { mapbox, key };

export const homeNav = async () => {
    await goto(
                `/`
            );
    await invalidate('/');
}

export const metaCorpNav = async (id) => {
    await goto(
                `/meta/${id}`
            );
    await invalidate('meta');
}

export const siteNav = async (id) => {
    await goto(
                `/site/${id}`
            );
    await invalidate('site');
}