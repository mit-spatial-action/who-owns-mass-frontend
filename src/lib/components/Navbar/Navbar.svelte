<script>
  import NavButton from "$lib/components/Navbar/NavButton.svelte";
  export let menuItems = [
        {"Home": "/"}
    ];

    let active = false;
    import { page } from '$app/stores';
    $: pathname = $page.url.pathname;
</script>

<div id="navbar">
  <div
    id="collapsed-sidebar"
    >
    <div class="columns is-vcentered">
      <div class="column">
        <button id="openbtn" class="has-background-light" on:click={() => active = !active}>☰</button>
      </div>
      {#if pathname !== "/"}
      <div class="column has-text-right">
        <NavButton/>
      </div>
      {/if}
    </div>
  </div>
</div>

<div id="sidebar" class="has-background-light" class:active={active} >
  <div class="content">
    <button id="closebtn" class="has-background-light" on:click={() => active = !active}>x</button>
    <div id="menuList">
      {#each menuItems as item }
      <a href={item[Object.keys(item)[0]]} on:click={() => active = !active}>{Object.keys(item)[0]}</a>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">

  #navbar {
    position: sticky !important;
    top: 1.5rem; /* Adjust this value as needed */
  }
  #sidebar {
    height: 100%;
    position: fixed;
    z-index: 2;
    top: 0;
    left: -150px;
    min-width: 150px;
    border-right: 0px solid $border;
    overflow-x: hidden;
    transition: 0.3s;
  }

  #sidebar > .content {
    padding: 1rem;
  }

  #menuList {
    margin-top: 1.5rem;
  }

  #sidebar.active {
    left: 0px;
    border-right: 2px solid #343434
  }

  #sidebar a {
    text-decoration: none;
    font-size: 16px;
    color: #000000;
    display: block;
    transition: 0.3s;
    border-bottom: 1px solid black;
  }

  #sidebar a:hover {
    color: #f1f1f1;
  }

  button {
    font-size: 45px;
    cursor: pointer;
    color: black;
    border: none;
  }

  button:hover {
    background-color: #000;
  }

  #collapsed-sidebar {
    // position: absolute;
    z-index: 1;
  }
</style>