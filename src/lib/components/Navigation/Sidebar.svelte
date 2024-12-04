<script lang="ts">
  export let menuItems;
  import { fly } from 'svelte/transition';
  import siteConfig from "$lib/config/site.json";

  export let active;

  const makeInactive = () => {
    active = false;
  }
</script>

<div id="sidebar" class="has-background-white p-3" transition:fly={{ x: -350, duration: 300 }}>
  <aside class="menu">
    <div class="buttons is-small">
      <button class="button border-success is-responsive" on:click={makeInactive} aria-label="Close sidebar">
        <span class="icon">
          <i class="fa-solid fa-x"></i>
        </span>
      </button>
    </div>
    <p class="menu-label">{siteConfig.title}</p>
    <ul class="menu-list">
        {#each menuItems as item }
        <li><a href={item[Object.keys(item)[0]]} on:click={makeInactive}>{Object.keys(item)[0]}</a></li>
        {/each}
    </ul>
  </aside>
</div>

<style lang="scss">
  @use 'src/lib/styles/vars.scss' as *;
  #sidebar {
    height: 100%;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0px;
    border: 0.4rem solid $success;
    box-shadow: var(--bulma-shadow);
  }
</style>