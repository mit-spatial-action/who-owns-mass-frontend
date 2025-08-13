<script lang="ts">
    import { slide } from "svelte/transition";
    import { draggable } from '@neodrag/svelte';
    import type { DragOptions } from '@neodrag/svelte';

    interface Props {
        children?: import("svelte").Snippet;
    }

    let options: DragOptions = {
        axis: 'y',
        bounds: {
            top: 0

        }
        // transform: ({ offsetX, offsetY }) => `scaleY(0.7)`,
    };

    let { children }: Props = $props();
</script>

<div
    use:draggable={options}
    transition:slide={{ duration: 250, axis: "y" }}
    class="info column is-two-fifths-tablet is-one-third-desktop"
>
    <div class="box is-shadowless">
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
        height: 100%;
    }
</style>
