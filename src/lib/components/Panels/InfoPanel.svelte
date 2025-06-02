<script lang="ts">
    import Navigation from "$lib/components/Navigation/Navigation.svelte";
    import { slide } from 'svelte/transition';
</script>

<div id="infopanel" transition:slide={{duration:250, axis:"y"}} class="site-panel column p-3 is-half is-two-fifths-desktop has-background-white is-fullheight is-flex is-flex-direction-column">
        <Navigation />
        <div class="card is-shadowless is-flex-grow-1 is-flex is-flex-direction-column">
            <slot/>
        </div>
</div>

<style lang="scss">
    @use "../../styles";
    #infopanel {
        z-index: 2;
        overflow: auto;
        border: 0.4rem solid styles.$success;
        height: 100vh !important;
        scrollbar-color: styles.$success #fff;
        scrollbar-width: thin;
    }
</style>