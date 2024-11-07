import { writable } from 'svelte/store';

export const metacorp = writable<Object>({});
export const site = writable<Object>({});
export const gcResult = writable<Object>({});

export const loadState = writable<Boolean>(false);