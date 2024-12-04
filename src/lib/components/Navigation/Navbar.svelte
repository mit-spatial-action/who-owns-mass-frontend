<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    export let active = false;

    let currentPage;

    page.subscribe(value => {
        currentPage = value;
    });
    
    const makeActive = () => {
      active = true
    }
    const goHome = () => {
      goto("/")
    }
</script>

<div class="level is-mobile is-small buttons">
  <div class="level-left">
    <button class="button level-item is-responsive shadow" on:click={makeActive} aria-label="Expand sidebar.">
      <span class="icon">
        <i class="fa-solid fa-bars"></i>
      </span>
    </button>
  </div>
  {#if currentPage.url.pathname !== "/"}
  <div class="level-right">
    <button class="button level-item is-responsive shadow" on:click={goHome}>
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

  .button {
    border-radius: 0; 
  }
</style>