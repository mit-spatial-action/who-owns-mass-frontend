<div class="column has-background-light">
    <slot/>
</div>


<style lang="scss">
    @use 'src/lib/styles/vars.scss' as *;
    div {
        max-height: 100vh !important;
        overflow-y: scroll;
        border-right: 2px solid $border;
    }
</style>