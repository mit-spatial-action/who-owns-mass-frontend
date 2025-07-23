<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  import { appState } from "$lib/state.svelte.ts";
</script>

<div class="level is-mobile is-small buttons">
  <div class="level-left">
    <button
      class="button level-item is-responsive border-success"
      onclick={() => (appState.sidebar = true)}
      aria-label="Expand sidebar."
    >
      <span class="icon">
        <i class="fa-solid fa-bars"></i>
      </span>
    </button>
  </div>
  {#if page.url.pathname !== "/"}
    <div class="level-right">
      <button
        class="button level-item is-responsive border-success"
        onclick={() => goto("/")}
      >
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
