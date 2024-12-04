<script>
    export let color = "success";
</script>

<header class="card-header is-shadowless">
    <div class="card-header-title title border-{color} has-text-weight-bold has-background-{color}-light">
        <slot></slot>
     </div>
</header>

<style>
    .card-header{
        padding: 1.5rem;
    }
</style>