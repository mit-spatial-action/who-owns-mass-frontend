<span>
    <slot/>
</span>

<style lang="scss">
    @use "src/lib/styles/variables";
    span{
        display: inline-block;
        padding: .125em 0.125em;
        background: variables.$primary;
        color: #ffffff;
    }
</style>