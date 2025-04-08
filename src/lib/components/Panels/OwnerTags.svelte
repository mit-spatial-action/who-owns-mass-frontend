<script>
    export let company_name; 
    export let trust; 
    console.log(trust);
</script>

{#if trust}
    <span class="tag is-medium is-warning is-light border-primary">TRUST</span>
{/if}
{#if /\bL[\s\.]?L[\s\.]?C\b/i.test(company_name)}
    <span class="tag is-medium is-danger is-light border-primary">LLC</span>
{/if}
