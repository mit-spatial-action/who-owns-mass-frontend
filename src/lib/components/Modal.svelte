<script lang="ts">
    // import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    export let closeBtn:Boolean = true;
    export let background = "has-background-light"; // Default background

    let isVisible = true;
    const destroySelf = () => {
        isVisible = false;
    }
</script>

{#if isVisible}
<div class="modal is-active" transition:fade={{duration: 400}}>
    <div class="modal-background {background}"></div>
    <div class="modal-content">
      <slot/>
    </div>
    {#if closeBtn}
        <button class="modal-close is-large" aria-label="Close modal" on:click={destroySelf}></button>
    {/if}
</div>
{/if}


<style lang="scss">
    @use 'src/lib/styles/vars.scss' as *;
    .modal-background {
        opacity: 0.6;
    }
</style>
