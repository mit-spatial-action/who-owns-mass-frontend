<script lang="ts">
    let { title, icon, children } = $props();
</script>

<div class="icon-text">
    <span class="icon has-text-primary">
        <i class="fas fa-{icon}"></i>
    </span>
    <span class="has-text-weight-bold">{title}</span>
    {@render children?.()}
</div>