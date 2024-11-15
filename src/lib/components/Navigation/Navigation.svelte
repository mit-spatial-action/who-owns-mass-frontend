<script>
    import Navbar from "$lib/components/Navigation/Navbar.svelte";
    import Sidebar from "$lib/components/Navigation/Sidebar.svelte";

    import siteConfig from "$lib/config/site.json";
    
    import { writable } from 'svelte/store';
    import { getContext, setContext } from 'svelte';

    setContext('active', writable(false));
    $: active = getContext('active')
</script>

{#if $active}
    <Sidebar menuItems={siteConfig.pages} />
{/if}
<Navbar/>