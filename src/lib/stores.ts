import { writable } from 'svelte/store';
import type { FeatureCollection, Feature } from "geojson";

export const metacorp = writable<Object|null>(null);
export const site = writable<Feature|null>(null);
export const gcResult = writable<Object|null>(null);
export const homeState = writable<Boolean>(true);
export const loadState = writable<Boolean>(false);
export const mapLoaded = writable<Boolean>(false);
export const highlighted = writable<Number|null>(null);