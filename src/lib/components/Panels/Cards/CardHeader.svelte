<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<header class="card-header is-shadowless">
    <div class="card-header-title title has-text-weight-bold">
        {@render children?.()}
     </div>
</header>

