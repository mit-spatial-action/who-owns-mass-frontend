<script>
    export let title;
    export let icon;
</script>

<div class="icon-text">
    <span class="icon has-text-primary">
        <i class="fas fa-{icon}"></i>
    </span>
    <span class="has-text-weight-bold">{title}</span>
    <slot/>
</div>