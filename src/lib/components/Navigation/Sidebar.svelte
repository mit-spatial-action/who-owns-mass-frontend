<script lang="ts">
  import type { Writable } from 'svelte/store';
  import { getContext } from 'svelte';
  export let menuItems;
  import { fly } from 'svelte/transition';

  const active: Writable<boolean> = getContext('active');

  const makeInactive = () => {
    active.set(false)
  }
</script>

<div id="sidebar" class="has-background-light p-4" transition:fly={{ x: -350, duration: 300 }}>
  <aside class="menu">
    <button class="button" on:click={makeInactive}>
      <i class="fa-solid fa-x"></i>
    </button>
    <p class="menu-label">Who Owns Massachusetts?</p>
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
    z-index: 2;
    top: 0;
    left: 0px;
    border-right: 2px solid $border;
  }
</style>