<script>
    import CardHeader from "$lib/components/Panels/Cards/CardHeader.svelte";
    import CardContent from "$lib/components/Panels/Cards/CardContent.svelte";
    import PersonCard from "$lib/components/Panels/Cards/PersonCard.svelte";
    import OrgCard from "$lib/components/Panels/Cards/OrgCard.svelte";
    import siteConfig from "$lib/config/site.json";
    import { slide } from 'svelte/transition';
</script>
<!-- Inspired by methodology section on Evictorbook -->
<div transition:slide={{duration:250, axis:'y'}}>

    <CardHeader>
        Our Methodology
        </CardHeader>

        <CardContent>
            <div class="fixed-grid has-1-cols has-2-cols-tablet">
                <div class="grid">
                {#each siteConfig.org as org}
                    <OrgCard {org} />
                {/each}
                </div>
            </div>
            <br/>
            <div class="title has-text-success">Data Sources</div>
            <div class="fixed-grid has-1-cols has-2-cols-tablet">
                <div class="grid">
                {#each siteConfig.authors as person}
                    <PersonCard {person} />
                {/each}
                </div>
            </div>
            <br/>
            <div class="title has-text-success">Processing Steps</div>
            <div class="fixed-grid has-1-cols has-2-cols-tablet">
                <div class="grid">
                {#each siteConfig.partners as org}
                    <OrgCard {org} />
                {/each}
                </div>
            </div>
            <br/>
            <div class="title has-text-success">Strengths and Limitations</div>
            <div class="fixed-grid has-1-cols has-2-cols-tablet">
                <div class="grid">
                {#each siteConfig.funders as org}
                    <OrgCard {org} />
                {/each}
                </div>
            </div>

            <div class="title has-text-success">FAQs</div>     
        </CardContent>
</div>