<script>
    import HomePanel from "$lib/components/InfoPanel/HomePanel.svelte";
    import site_data from "$lib/config/instance.json";
    import Map from "$lib/components/Map/Map.svelte";
    import "$lib/styles/style.css";
    import { onMount } from "svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    function openNav() {
        document.getElementById("mySidebar").style.cssText =
            "width: 250px; border-right: 2px solid #343434";
    }
    onMount(() => {
        // below is code to make panels resizeable 
        // let handler = document.querySelector('.handler');
        // let wrapper = handler.closest('.wrapper');
        // let leftPanel = wrapper.querySelector('#left-panel');
        
        // let isHandlerDragging = false;

        // document.addEventListener('mousedown', function(e) {
        // // If mousedown event is fired from .handler, toggle flag to true
        //     if (e.target === handler) {
        //         isHandlerDragging = true;
        //     }
        // });

        // document.addEventListener('mousemove', function(e) {
        //     // Don't do anything if dragging flag is false
        //     if (!isHandlerDragging) {
        //         return false;
        //     }
        //     // Get offset
        //     let containerOffsetLeft = wrapper.offsetLeft;

        //     // Get x-coordinate of pointer relative to container
        //     let pointerRelativeXpos = e.clientX - containerOffsetLeft;
            
        //     // Arbitrary minimum width set on box A, otherwise its inner content will collapse to width of 0
        //     let leftPanelminWidth = 20;
        //     console.log("leftPanelminWidth", leftPanelminWidth, "pointerRelativeXpos", pointerRelativeXpos)

        //     // Resize box A
        //     // * Set flex-grow to 0 to prevent it from growing
        //     leftPanel.style.width = (Math.max(leftPanelminWidth, pointerRelativeXpos)) + 'px';
        //     leftPanel.style.flexGrow = 0;
        // });

        // document.addEventListener('mouseup', function(e) {
        // // Turn off dragging flag when user mouse is up
        // isHandlerDragging = false;
    // });
});
</script>

<!-- <div class="container columns is-flex no-scroll is-vcentered "> -->

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
    <!-- <div class="handler"></div> -->
    <div class="column has-background-light homepage" id="right-panel">
        <Map mapbox_token={data.mapbox_token} server_url={data.server_url} />
    </div>
</div>
