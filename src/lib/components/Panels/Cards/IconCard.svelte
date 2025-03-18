<script>
    export let title;
    export let icon;
    import IconText from "$lib/components/Panels/Cards/IconText.svelte"
</script>

<div class="box p-2 is-shadowless border-primary">
    <IconText title={title} icon={icon}/>
<div class="block">
    <slot/>
</div>
</div>

<style>
    .box {
        border-radius: 0;
    }
</style>