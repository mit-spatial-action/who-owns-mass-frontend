import { readable, writable } from 'svelte/store';

export const remountSearchbar = writable(0);

export const selectedFeature = writable([]);

export const getMap = writable(() => { });

export const metacorp = writable({});
export const site = writable({});
export const gcResult = writable({});
export const loadState = writable(false);
export const mapLoad = writable(false);
