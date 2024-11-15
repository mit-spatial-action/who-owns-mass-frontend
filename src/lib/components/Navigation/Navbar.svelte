<script lang="ts">
    import { page } from '$app/stores';
    import type { Writable } from 'svelte/store';
    import { getContext } from 'svelte';

    const active: Writable<boolean> = getContext('active');

    let currentPage;

    page.subscribe(value => {
        currentPage = value;
    });
    
    const makeActive = () => {
      active.set(true)
    }
</script>

<nav class="navbar is-fixed-top is-light">
  <div class="navbar-menu">
    <div class="navbar-start">
      <div class="navbar-item">
        <button class="button" on:click={makeActive} aria-label="Expand sidebar.">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>
    <div class="navbar-end">
      {#if currentPage.url.pathname !== "/"}
        <div class="navbar-item">
          <a class="button" href="/">&#8592 Return to Search</a>
        </div>
      {/if}
    </div>
  </div>
</nav>

<style lang="scss">
  nav.navbar {
    z-index: 1;
    position: sticky !important;
  }
</style>