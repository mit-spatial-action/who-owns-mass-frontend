<script>
    import CardHeader from "$lib/components/Panels/Cards/CardHeader.svelte";
    import CardContent from "$lib/components/Panels/Cards/CardContent.svelte";
    import SocialIcon from "$lib/components/Panels/Cards/SocialIcon.svelte";
    import methodConfig from "$lib/config/methodology.json";
    import { slide } from 'svelte/transition';

    let directoryURL = methodConfig.directoryURL
</script>



<div transition:slide={{duration:250, axis:'y'}}>

    <CardHeader>
        Our Methodology
        </CardHeader>

        <CardContent>
            <div class="block">
                {methodConfig.description}
            </div>
            <button class="button is-success">
            <SocialIcon socialUrl={methodConfig.docsURL} color="has-text-white"/>
            </button>
            
        </CardContent>
        <CardContent>
            <div class="title has-text-success">Data Sources</div>
            {#each methodConfig.dataSources as source}
                <div class="block">
                <p>
                    <a href={source.url}>{source.name}</a> ({source.vintage}). 
                    {#each source.orgs as org, index}<a href="{org.url}">{org.name}</a>{index == source.orgs.length-1 ? '' : ', '}{/each}
                </p>
                <p>
                    {source.description}
                </p>
                </div>
            {/each}
        </CardContent>
        <CardContent>
        <div class="title has-text-success">FAQ</div>
            {#each methodConfig.FAQ as faq}
            <div class="block">
            <p>Q: {faq.Q}</p>
            <p>A: {faq.A}</p>
            </div>
            <div class="block">
            <p>Q: {faq.Q}</p>
            <p>A: {faq.A}</p>
            </div>
            {/each}
        </CardContent>
</div>