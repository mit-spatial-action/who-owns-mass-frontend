<script>
    import { selectedFeature } from '$lib/scripts/stores.js';
    /** @type {import('./$types').PageData} */

    const publicFunding = JSON.parse($selectedFeature[0].properties.public_funding);
</script>

<div>
    <hr/>
    <p class="has-text-dark is-size-4 has-text-left block mb-1">
        <b>Public Funding</b>
    </p>
    <div class="has-text-left block"> 
         This landlord takes Section 8 and received ${publicFunding} in PPP loans. 
    </div>
</div>
