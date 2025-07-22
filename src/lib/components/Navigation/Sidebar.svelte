<script lang="ts">
  import { fly } from 'svelte/transition';
  import siteConfig from "$lib/config/site.json";

  let { menuItems, active = $bindable() } = $props();

  const makeInactive = () => {
    active = false;
  }
</script>

<div id="sidebar" class="has-background p-3" transition:fly={{ x: -350, duration: 300 }}>
  <aside class="menu">
    <div class="buttons is-small">
      <button class="button border-success is-responsive" onclick={makeInactive} aria-label="Close sidebar">
        <span class="icon">
          <i class="fa-solid fa-x"></i>
        </span>
      </button>
    </div>
    <p class="menu-label">{siteConfig.title}</p>
    <ul class="menu-list">
        {#each menuItems as item }
        <li><a href={item[Object.keys(item)[0]]} onclick={makeInactive}>{Object.keys(item)[0]}</a></li>
        {/each}
    </ul>
  </aside>
</div>

<style lang="scss">
  @use "../../styles/variables";
  #sidebar {
    height: 100%;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0px;
    border: 0.4rem solid variables.$success;
    box-shadow: var(--bulma-shadow);
  }
</style>