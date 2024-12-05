<script>
    export let title;
    export let icon;
</script>

<div class="box p-2 is-shadowless border-primary">
<div class="icon-text">
    <span class="icon has-text-primary">
        <i class="fas fa-{icon}"></i>
    </span>
    <span class="has-text-weight-bold">{title}</span>
</div>
<div class="block">
    <slot/>
</div>
</div>

<style>
    .box {
        border-radius: 0;
    }
</style>