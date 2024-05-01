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
    <div class="has-text-left block"> 
        <b></b>
         This landlord takes Section 8 and received ${publicFunding} in PPP loans. 
    </div>
</div>
