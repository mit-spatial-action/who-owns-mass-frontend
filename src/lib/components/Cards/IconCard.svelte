<script lang="ts">
    import IconText from "$lib/components/Cards/IconText.svelte";
    let { title, icon, blankText = "Unknown.", children = null } = $props();
</script>

<div class="box p-2 is-shadowless border-primary">
    <IconText {title} {icon} />
    <div class="block">
        {#if children}
            {@render children()}
        {:else}
            {blankText}
        {/if}
    </div>
</div>

<style>
    .box {
        border-radius: 0;
    }
</style>
