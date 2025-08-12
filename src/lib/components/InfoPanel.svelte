<script lang="ts">
    import Sidebar from "$lib/components/Sidebar.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import { slide } from "svelte/transition";
    import { draggable } from '@neodrag/svelte';
    import type { DragOptions } from '@neodrag/svelte';

    interface Props {
        children?: import("svelte").Snippet;
    }

    let options: DragOptions = {
        axis: 'y',
        transform: ({ offsetX, offsetY }) => `scaleY(0.7)`,
    };

    let { children }: Props = $props();
</script>

<div
    id="infopanel"
    use:draggable={options}
    transition:slide={{ duration: 250, axis: "y" }}
    class="site-panel box column p-3 is-half is-two-fifths-desktop is-fullheight is-flex is-flex-direction-column"
>
    <Sidebar />
    <Navbar />
    <div
        class="card is-shadowless is-flex-grow-1 is-flex is-flex-direction-column"
    >
        {@render children?.()}
    </div>
</div>

<style lang="scss">
    @use "../styles/variables";
    #infopanel {
        z-index: 2;
        overflow: auto;
        border: 0.4rem solid variables.$success;
        height: 100vh !important;
        scrollbar-color: variables.$success var(--bulma-background);
        scrollbar-width: thin;
    }
    .box {
        border-radius: 0;
    }
</style>
