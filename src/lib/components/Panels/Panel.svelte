<div class="column has-background-light">
    <slot/>
</div>


<style lang="scss">
    @use "src/lib/styles/variables";

    div {
        max-height: 100vh !important;
        overflow-y: scroll;
        border-left: 2px solid variables.$border;
        border-right: 2px solid variables.$border;
    }
</style>