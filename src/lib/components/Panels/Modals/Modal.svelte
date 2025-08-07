<script lang="ts">
    import { fade } from "svelte/transition";
    interface Props {
        closeBtn?: Boolean;
        open: any;
        children?: import("svelte").Snippet;
    }

    let { closeBtn = true, open = $bindable(), children }: Props = $props();

    let isVisible = $state(true);
    const destroySelf = () => {
        isVisible = false;
        open = false;
    };
</script>

{#if isVisible}
    <div class="modal is-active" transition:fade={{ duration: 400 }}>
        <div class="modal-background onclick={() => (open = false)}"></div>
        {@render children()}
        {#if closeBtn}
            <button
                class="modal-close is-large"
                aria-label="Close modal"
                onclick={destroySelf}
            ></button>
        {/if}
    </div>
{/if}

<style lang="scss">
    .modal-background {
        opacity: 0.68;
    }
</style>
