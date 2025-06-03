<script>
    export let company_name; 
    export let trust;
</script>

{#if trust}
    <span class="tag is-medium">TRUST</span>
{/if}
{#if /\bL[\s\.]?L[\s\.]?C\b/i.test(company_name)}
    <span class="tag is-medium">LLC</span>
{/if}
