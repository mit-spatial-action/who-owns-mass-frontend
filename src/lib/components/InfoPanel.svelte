<script lang="ts">
    import { slide } from "svelte/transition";

    interface Props {
        children?: import("svelte").Snippet;
    }

    let { children }: Props = $props();
</script>

<div
    transition:slide={{ duration: 250, axis: "y" }}
    class="container info column is-two-fifths-tablet is-one-third-desktop"
>
    <div class="box is-transparent">
        {@render children()}
    </div>
</div>

<style lang="scss">
    @use "../styles/variables";
    .info {
        z-index: 2;
        overflow: auto;
        border: 0.4rem solid variables.$success;
        height: 100% !important;
        scrollbar-color: variables.$success var(--bulma-background);
        scrollbar-width: thin;
        border-radius: 0;
    }
    .box {
        background-color: transparent;
    }
</style>
