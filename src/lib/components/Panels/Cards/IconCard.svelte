<script lang="ts">
    import IconText from "$lib/components/Panels/Cards/IconText.svelte"
    let { title, icon, children } = $props();
</script>

<div class="box p-2 is-shadowless border-primary">
    <IconText title={title} icon={icon}/>
<div class="block">
    {@render children?.()}
</div>
</div>

<style>
    .box {
        border-radius: 0;
    }
</style>