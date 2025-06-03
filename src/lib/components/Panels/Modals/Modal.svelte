<script lang="ts">
    import { fade } from 'svelte/transition';
    export let closeBtn:Boolean = true;
    export let open;

    let isVisible = true;
    const destroySelf = () => {
        isVisible = false;
        open = false;
    }

</script>

{#if isVisible}
<div class="modal is-active" transition:fade={{duration: 400}}>
    <div class="modal-background onclick={() => open = false}"></div>
      <slot/>
    {#if closeBtn}
        <button class="modal-close is-large" aria-label="Close modal" onclick={destroySelf}></button>
    {/if}
</div>
{/if}


<style lang="scss">
    .modal-background {
        opacity: 0.68;
    }
</style>
