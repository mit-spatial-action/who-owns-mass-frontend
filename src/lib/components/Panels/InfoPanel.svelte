<script lang="ts">
    import Navigation from "$lib/components/Navigation/Navigation.svelte";
</script>

<div id="infopanel" class="site-panel column p-3 is-half is-two-fifths-desktop has-background-white is-fullheight is-flex is-flex-direction-column">
        <Navigation />
        <div class="card is-shadowless is-flex-grow-1 is-flex is-flex-direction-column">
            <slot/>
        </div>
</div>

<style lang="scss">
    @use 'src/lib/styles/vars.scss' as *;
    #infopanel {
        z-index: 2;
        overflow: auto;
        border: 0.4rem solid $success;
        height: 100vh !important;
        scrollbar-color: $primary $success;
        scrollbar-width: thin;
    }
</style>