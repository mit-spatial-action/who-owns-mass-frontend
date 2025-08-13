<script lang="ts">
    import type { LayoutProps } from "./$types";
    let { children }: LayoutProps = $props();
</script>

<section class="section columns m-0 p-0">
    {@render children()}
</section>

<style>
    section {
        height: 100vh;
        width: 100%;
    }
</style>
