<script lang="ts">
    import { page } from '$app/stores';
    import type { Writable } from 'svelte/store';
    import { getContext } from 'svelte';
    import { goto } from '$app/navigation';

    const active: Writable<boolean> = getContext('active');

    let currentPage;

    page.subscribe(value => {
        currentPage = value;
    });
    
    const makeActive = () => {
      active.set(true)
    }
    const goHome = () => {
      goto("/")
    }
</script>

<div class="level is-mobile is-small has-background-light buttons p-3">
  <div class="level-left">
    <button class="button level-item is-responsive" on:click={makeActive} aria-label="Expand sidebar.">
      <span class="icon">
        <i class="fa-solid fa-bars"></i>
      </span>
    </button>
  </div>
  {#if currentPage.url.pathname !== "/"}
  <div class="level-right">
    <button class="button level-item is-responsive" on:click={goHome}>
      <span class="icon">
        <i class="fa-solid fa-arrow-left"></i>
      </span>
      <span>Return to Search</span>
    </button>
  </div>
  {/if}
</div>

<style>
  .level {
    position: sticky;
    top: 0;
    z-index: 10;
  }
</style>