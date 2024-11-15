import { writable } from 'svelte/store';

export const metacorp = writable<Object>({});
export const site = writable<Object>({});
export const gcResult = writable<Object>({});
export const homeState = writable<Boolean>(true);
export const loadState = writable<Boolean>(false);
export const mapLoaded = writable<Boolean>(false);
export const highlighted = writable<Number>(null);