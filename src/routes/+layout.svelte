<script>
    import site_data from '$lib/config/instance.json';
    import "$lib/styles/style.css";
    import Menu from '$lib/components/Navbar/Menu.svelte';
    import Map from "$lib/components/Map/Map.svelte";

    const mapbox_token = import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN;

    let openNav = () => {
        document.getElementById("mySidebar").style.cssText = "width: 250px; border-right: 2px solid #343434";
    }
</script>
<title>{site_data.title}</title>
<link rel="icon" type="image/x-icon" href={site_data.favicon}>

<div class="wrapper">
    <div
        class="column is-1 is-flex-direction-column shadow is-justify-content-flex-start"
        id="collapsed-navbar">
        <button class="openbtn" on:click={openNav}>☰</button>
    </div>
    <Menu />
    <slot/>
    {#if mapbox_token }
    <div class="column has-background-light homepage" id="right-panel">
        <Map mapbox_token={mapbox_token} />
    </div>
    {/if}
</div>
