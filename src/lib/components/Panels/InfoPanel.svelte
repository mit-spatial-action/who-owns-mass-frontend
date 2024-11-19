<script lang="ts">
    import siteConfig from '$lib/config/site.json';
    import Navigation from '$lib/components/Navigation/Navigation.svelte';
    import Panel from "$lib/components/Panels/Panel.svelte";
</script>

<Panel>
    <div class="px-5">
        <Navigation menuItems={siteConfig.pages}/>
        <div class="card has-background-light is-shadowless">
            <slot/>
        </div>
    </div>
</Panel>