<script>
    import CardHeader from "$lib/components/Cards/CardHeader.svelte";
    import CardContent from "$lib/components/Cards/CardContent.svelte";
    import PersonCard from "$lib/components/Cards/PersonCard.svelte";
    import OrgCard from "$lib/components/Cards/OrgCard.svelte";
    import siteConfig from "$lib/config/site.json";
    import { slide } from 'svelte/transition';
</script>

<div transition:slide={{duration:250, axis:'y'}}>
    <CardHeader>
        Who We Are
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
        <div class="title">People</div>
        <div class="fixed-grid has-1-cols has-2-cols-tablet">
            <div class="grid">
            {#each siteConfig.authors as person}
                <PersonCard {person} />
            {/each}
            </div>
        </div>
        <br/>
        <div class="title">Partners</div>
        <div class="fixed-grid has-1-cols has-2-cols-tablet">
            <div class="grid">
            {#each siteConfig.partners as org}
                <OrgCard {org} />
            {/each}
            </div>
        </div>
        <br/>
        <div class="title">Funders</div>
        <div class="fixed-grid has-1-cols has-2-cols-tablet">
            <div class="grid">
            {#each siteConfig.funders as org}
                <OrgCard {org} />
            {/each}
            </div>
        </div>
    </CardContent>
</div>
