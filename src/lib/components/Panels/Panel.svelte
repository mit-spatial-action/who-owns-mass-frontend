<div class="column has-background-light">
    <slot/>
</div>


<style lang="scss">
    div {
        max-height: 100vh !important;
        overflow-y: scroll;
        border-left: 2px solid $border;
        border-right: 2px solid $border;
    }
</style>