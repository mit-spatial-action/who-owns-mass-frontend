<script>
    import { selectedFeature, metacorp } from '$lib/scripts/stores.ts';
    /** @type {import('./$types').PageData} */

    const evictor_rank = "Major Evictor";
    var evictor_rank_desc; 

    if(evictor_rank == "Extreme Evictor"){
        evictor_rank_desc = "This landlord is one of the top evictors in the state of Massachusetts (top 10%)"
    } else if (evictor_rank == "Moderate Evictor"){
        
    }


function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
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
        <p>{$metacorp.name} is a part of a network of properties owned by {$metacorp.owners}. </p>
           <p> This network owns roughly {$metacorp.unit_count} units across Massachusetts. Their total land holdings are worth approximately ${numberWithCommas(Math.round($metacorp.val_per_prop))} per property. </p>
    </div>
</div>
