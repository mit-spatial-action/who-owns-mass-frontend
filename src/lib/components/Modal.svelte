<script lang="ts">
    // import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    export let closeBtn:Boolean = true;
    
    let isVisible = true;
    const destroySelf = () => {
        isVisible = false;
    }
</script>

{#if isVisible}
<div class="modal is-active" transition:fade={{duration: 400}}>
    <div class="modal-background"></div>
    <div class="modal-content">
      <slot/>
    </div>
    {#if closeBtn}
        <button class="modal-close is-large" aria-label="close" on:click={destroySelf}></button>
    {/if}
</div>
{/if}

<style lang="scss">
    @use "src/lib/styles/variables";
    .modal-background {
        background-color: variables.$body-background-color;
    }
</style>