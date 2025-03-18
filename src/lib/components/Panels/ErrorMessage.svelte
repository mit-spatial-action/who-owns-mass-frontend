<script lang="ts">
    import { slide } from 'svelte/transition';
    export let errorState: string;
    const states = {
        "addressNotFound": {
            "descShort": "We couldn't find this address!",
            "descLong": "This is probably because the owner's listed address matches the property address. Please search for a different or select a property on the map.",
            "color": "primary"
        },
        "featureNotReady": {
            "descShort": "This feature is coming soon!",
            "descLong": "We're working on getting this functionality up and running. Thank you for your patience.",
            "color": "primary"
        },
            "quitClaimDeed": {
            "descShort": null,
            "descLong": "A quitclaim deed is a property transferred between owners or family members for a negligible sale price (i.e. less than $5000)",
            "color": "primary"
        }, 
            "priceUnknown": {
            "descShort": null,
            "descLong": "The price is not listed in the tax assessors database.",
            "color": "primary" 
        }, 
            "noProperties": {
            "descShort": null,
            "descLong": "We couldn't find any additional properties held by this owner.",
            "color": "primary" 
        }, 
            "outdatedInfo": {
            "descShort": null,
            "descLong": "This information is more than one year out-of-date. You should confirm current ownership.",
            "color": "primary" 
        }
    }
 </script>
 
 <article transition:slide={{duration:100, axis:'y'}} class="message is-{states[errorState].color}">
    {#if states[errorState].descShort}
    <div class="message-header is-size-7 is-size-6-tablet">
        {states[errorState].descShort}
    </div>
    {/if}
    <div class="message-body is-size-7 is-size-6-tablet">
        {states[errorState].descLong}
    </div>
</article>