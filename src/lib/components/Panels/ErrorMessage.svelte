<script lang="ts">
    import { slide } from 'svelte/transition';
    export let errorState: string;
    const states = {
        "addressNotFound": {
            "descShort": "We couldn't find this address!",
            "descLong": "This is probably because the owner's listed address matches the property address. Please search for a different or select a property on the map.",
            "color": "warning"
        },
        "featureNotReady": {
            "descShort": "This feature is coming soon!",
            "descLong": "We're working on getting this functionality up and running. Thank you for your patience.",
            "color": "primary"
        },
            "quitClaimDeed": {
            "descShort": "This property is likely a quitclaim deed.",
            "descLong": "A quitclaim deed is a property transferred between owners or family members for a negligible sale price (i.e. less than $5000)",
            "color": "warning" // Please feel free to change color
        }
    }
 </script>
 
 <article transition:slide={{duration:100, axis:'y'}} class="message is-{states[errorState].color}">
    <div class="message-header is-size-7 is-size-6-tablet">
        {states[errorState].descShort}
    </div>
    <div class="message-body is-size-7 is-size-6-tablet">
        {states[errorState].descLong}
    </div>
</article>