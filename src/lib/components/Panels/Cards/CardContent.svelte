<script lang="ts">
    let { children } = $props();
</script>

<div class="card-content">
    {#if children}{@render children()}{:else}{ children }{/if}
</div>