<script>
    import HomePanel from "$lib/components/InfoPanel/HomePanel.svelte";
    import site_data from "$lib/config/instance.json";
    import Map from "$lib/components/Map/Map.svelte";
    import "$lib/styles/style.css";

    /** @type {import('./$types').PageData} */
    export let data;

    let openNav = () => {
        document.getElementById("mySidebar").style.cssText = "width: 250px; border-right: 2px solid #343434";
    }
</script>

<div class="wrapper">
    <div
        class="column is-1 is-flex-direction-column shadow is-justify-content-flex-start"
        id="collapsed-navbar">
        <button class="openbtn" on:click={openNav}>☰</button>
    </div>
    <div class="column has-background-light homepage shadow" id="left-panel">
        <HomePanel
            mapbox_token={data.mapbox_token}
            title={site_data.title}
            subtitle={site_data.description}/>
    </div>
    <div class="column has-background-light homepage" id="right-panel">
        <Map mapbox_token={data.mapbox_token} server_url={data.server_url} />
    </div>
</div>
