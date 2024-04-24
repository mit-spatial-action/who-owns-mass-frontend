import { writable } from 'svelte/store';
import mapboxgl from 'mapbox-gl';

const remountSearchbar = writable(0);

const selectedFeature = writable({});

const mapState = writable();

export { remountSearchbar, selectedFeature, mapboxgl, mapState }