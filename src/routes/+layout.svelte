<script>
    import site_data from '$lib/config/instance.json';
    import "$lib/styles/style.css";
    import Menu from '$lib/components/Navbar/Menu.svelte';
    import '$lib/styles/style.css';
    
    import Map from '$lib/components/Map//Map.svelte'

	/** @type {import('./$types').PageData} */
	export let data;
    
    function openNav() {
      document.getElementById("mySidebar").style.cssText = "width: 250px; border-right: 2px solid #343434";
    }
</script>
<title>{site_data.title}</title>
<link rel="icon" type="image/x-icon" href={site_data.favicon}>
<Menu />
<div class="columns is-flex no-scroll is-vcentered">
    <div class="column is-1 is-flex-direction-column shadow is-justify-content-flex-start" id="collapsed-navbar">
        <button class="openbtn" on:click={openNav}>☰</button>  
    </div>
    <div class="column has-background-light homepage shadow" id="left-panel">
        <slot/>
    </div>
    <div class="column has-background-light homepage">
        <Map token={data.mapbox_token}/>
    </div>
</div>