<script lang="ts">
    import type { LayoutProps } from "./$types";
    let { children }: LayoutProps = $props();
</script>

<div class="box">
    {@render children()}
</div>