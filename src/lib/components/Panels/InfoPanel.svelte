<script lang="ts">
    import siteConfig from '$lib/config/site.json';
    import Panel from "$lib/components/Panels/Panel.svelte";
    import Navigation from "$lib/components/Navigation/Navigation.svelte";
</script>

<div id="infopanel" class="column">
    <div class="container">
        <Navigation menuItems={siteConfig.pages} />
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