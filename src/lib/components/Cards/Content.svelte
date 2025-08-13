<script lang="ts">
    let { children } = $props();
</script>

<div class="box">
    {#if children}{@render children()}{:else}{ children }{/if}
</div>