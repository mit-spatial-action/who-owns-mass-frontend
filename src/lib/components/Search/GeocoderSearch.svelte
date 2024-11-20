<script lang="ts">
    import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import { onMount, onDestroy } from 'svelte';
    import { mapbox } from '$lib/scripts/utils';
    
    import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

    let geocoder;
    export let suggestions = [];

    const buildResults = (results) => {
        results = results.map((r) => {
            return {
                text: `${r.address} ${r.text}, 
                ${r.context.filter(c => c.id.split('.').shift() === 'place')[0].text}, MA`,
                lngLat: new mapbox.LngLat(r.center[0], r.center[1]),
                address: `${r.address} ${r.text}`
            }
        })
        return results
        
    }

    onMount(()=>{
        geocoder = new MapboxGeocoder({
            accessToken: PUBLIC_MAPBOX_TOKEN,
            marker: false,
            countries: 'us',
            flyTo: false,
            types: 'address',
            bbox: [
                -73.507239199792,
                41.23908260581605,
                -69.92871308883089,
                42.88675909238091
            ],
            filter: function (item) {
                return item.context.some((i) => {
                    return (
                        i.id.split('.').shift() === 'region' &&
                        i.text === 'Massachusetts'
                    );
                });
            }
        });

        const searchInput = document.getElementById('search-input') as HTMLInputElement;

        if (searchInput) geocoder.addTo(searchInput);

        let timeout: ReturnType<typeof setTimeout>;
        searchInput.addEventListener('input', async (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const query = (e.target as HTMLInputElement).value;
                if (query.length > 0) {
                    geocoder.query(query);
                } else {
                    suggestions = [];
                };
            }, 300);
        });

        geocoder.on('results', (e) => {
            suggestions = buildResults(e.features);
        });
    });

    onDestroy(()=>{
        if (geocoder && geocoder.parentNode ) {
            geocoder.onRemove();
        }
    });
    
</script>