<script lang="ts">
    export let errorState
    const states = {
        "addressNotFound": {
            "descShort": "We couldn't find this address!",
            "descLong": "This is probably because the owner's listed address matches the property address. Please search for a different or select a property on the map."
        }
    }
 </script>
 
 <article class="message is-warning">
    <div class="message-header">
        {states[errorState].descShort}
    </div>
    <div class="message-body">
        {states[errorState].descLong}
    </div>
</article>