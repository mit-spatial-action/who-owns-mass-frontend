<script>
    import { selectedFeature } from '$lib/scripts/stores.js';
    /** @type {import('./$types').PageData} */

    const evictor_rank = "Major Evictor";
    var evictor_rank_desc; 

    if(evictor_rank == "Extreme Evictor"){
        evictor_rank_desc = "This landlord is one of the top evictors in the state of Massachusetts (top 10%)"
    } else if (evictor_rank == "Moderate Evictor"){
        
    }



</script>

<div>
    <hr/>
    <p class="has-text-dark is-size-4 has-text-left block mb-1">
        <b>Evictor Rank</b>
    </p>
    <div class="has-text-centered p-1 pb-2">
    <button class="button is-danger is-size-6 has-text-weight-semibold is-outlined">
        ☠️ Extreme Evictor ☠️
    </button> 
    </div>
    <div class="has-text-left block">
        <p>
            This landlord is in <b><span class="has-background-warning">the top 10% of evictors</span></b> in the state of Massachusetts
        </p>
    </div>
</div>
