<script lang="ts">
    let { children } = $props();
</script>

<header class="card-header is-shadowless">
    <div class="card-header-title title has-text-weight-bold">
        {@render children() }
     </div>
</header>

