<span>
    <slot/>
</span>

<style lang="scss">
    @use 'src/lib/styles/vars.scss' as *;
    span{
        display: inline-block;
        padding: .125em 0.125em;
        background: $primary;
        color: #ffffff;
    }
</style>