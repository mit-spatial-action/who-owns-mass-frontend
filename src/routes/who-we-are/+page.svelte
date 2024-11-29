<script>
    import CardHeader from "$lib/components/Panels/Cards/CardHeader.svelte";
    import CardContent from "$lib/components/Panels/Cards/CardContent.svelte";
    import PersonCard from "$lib/components/Panels/Cards/PersonCard.svelte";
    import OrgCard from "$lib/components/Panels/Cards/OrgCard.svelte";
    import siteConfig from "$lib/config/site.json";
    import { slide } from 'svelte/transition';
    import saarg from "$lib/assets/logos/saarg.png"
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
            <div class="title">People</div>
            <div class="fixed-grid has-1-cols has-2-cols-tablet">
                <div class="grid">
                {#each siteConfig.authors as person}
                    <PersonCard {person} />
                {/each}
                </div>
            </div>
            <div class="title">Partners</div>
            <div class="fixed-grid has-1-cols has-2-cols-tablet">
                <div class="grid">
                {#each siteConfig.partners as org}
                    <OrgCard {org} />
                {/each}
                </div>
            </div>
            <div class="title">Funders</div>
            <div class="fixed-grid has-1-cols has-2-cols-tablet">
                <div class="grid">
                {#each siteConfig.funders as org}
                    <OrgCard {org} />
                {/each}
                </div>
            </div>
        <!-- <figure class="image is-128x128">
            <img alt="The project logo" src={saarg} />
        </figure> -->
        </CardContent>
</div>
