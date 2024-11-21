<script lang="ts">
    import Navigation from "$lib/components/Navigation/Navigation.svelte";
</script>

<div id="infopanel" class="column">
    <div class="container">
        <Navigation />
        <div class="card is-shadowless has-background-light">
            <slot/>
        </div>
    </div>
</div>

<style>
    #infopanel {
        z-index: 2;
    }
</style>