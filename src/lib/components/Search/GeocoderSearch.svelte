<script lang="ts">
    import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import { onMount, onDestroy } from 'svelte';
    import { mapbox } from '$lib/scripts/utils';
    import { gcResult } from "$lib/stores";
    
    import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

    let geocoder; 
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

        const searchInput = document.getElementById('geocoder-input') as HTMLInputElement;
        const suggestionsList = document.getElementById('suggestions-list') as HTMLDivElement;

        if (searchInput) geocoder.addTo(searchInput);

        let timeout: ReturnType<typeof setTimeout>;
        searchInput.addEventListener('input', async (e) => {
            const query = (e.target as HTMLInputElement).value;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const query = (e.target as HTMLInputElement).value;
                if (query.length > 0) {
                    geocoder.query(query);
                } else {
                    suggestionsList.innerHTML = '';
                };
            }, 300);
        });

        geocoder.on('results', (e) => {
            const features = e.features;

            suggestionsList.innerHTML = features
                .map(
                    (feature) => `
                    <div class="suggestion-item" data-center="${feature.center}">
                        ${feature.place_name}
                    </div>
                `
                )
                .join('');

                const suggestionItems = document.querySelectorAll('.suggestion-item');
                    suggestionItems.forEach((item) => {
                    item.addEventListener('click', (e) => {
                        // Clear suggestions
                        suggestionsList.innerHTML = '';
                        searchInput.value = (e.target as HTMLElement).textContent || '';
                });
            // let result = e.result
            // gcResult.set({
            //     lngLat: new mapbox.LngLat(result.center[0], result.center[1]),
            //     address: result.address + " " + result.text
            // })
            })
        });
    });

    onDestroy(()=>{
        if (geocoder && geocoder.parentNode ) {
            geocoder.onRemove();
        }
    });
    
</script>

<p id="geocoder" class="control has-icons-left">
    <input id="geocoder-input" class="input" type="text" placeholder="Search" />
    <span class="icon is-left">
    <i class="fas fa-search" aria-hidden="true"></i>
    </span>
</p>
<div id="suggestions-list"></div>