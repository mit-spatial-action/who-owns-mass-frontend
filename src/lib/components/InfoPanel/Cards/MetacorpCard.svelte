<script>
    import { selectedFeature } from '$lib/scripts/stores.js';
    import { company } from "$lib/scripts/stores.js";

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
        <b>About this Network</b>
    </p>
    <div class="has-text-centered p-1 pb-2">

    </div>
    <div class="has-text-left block">
        <p>{$company.name} is a part of a larger network of properties owned by {$company.metacorp.name}. </p>
           <p> This network owns roughly ____ units across Massachusetts. Their total land holdings are worth approximately $____. </p>
    </div>
</div>
