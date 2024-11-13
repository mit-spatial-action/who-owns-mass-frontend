<script lang="ts">
    import site_data from '$lib/config/instance.json';
    import Navigation from '$lib/components/Navigation/Navigation.svelte';
    import Panel from "$lib/components/Panels/Panel.svelte";
</script>

<Panel>
    <div class="px-5">
        <Navigation menuItems={site_data.pages}/>
        <div class="card has-background-light is-shadowless">
            <slot/>
        </div>
    </div>
</Panel>