<script>
import { selectedFeature, getMap } from '$lib/scripts/stores.js';
import { onDestroy } from 'svelte';

    const unsubscribe = selectedFeature.subscribe(value => {
    });

    onDestroy(() => {
        unsubscribe();
    }); 
</script>

<div>
    <div id='overlay' class="overlay panel is-primary">
        <div class="panel-header">
            About this Address
            <button class="delete" aria-label="delete"></button>
        </div>
        <div class="panel-block">
            This is the information overlay.
        </div>
    </div>
</div>
