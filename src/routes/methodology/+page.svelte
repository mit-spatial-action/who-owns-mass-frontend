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
            <div>
                {methodConfig.description}
            </div>
            <br/>
                {methodConfig.readme}
            <div class="card-footer-item is-outlined">
                <SocialIcon socialUrl={directoryURL}/>
            </div>
            
        </CardContent>
        <div class="title has-text-success">Data Sources</div>
        <CardContent>
            <div>
                {methodConfig.dataSources}
            </div>
        </CardContent>
        <div class="title has-text-success">FAQs</div>
            <p>Q: {methodConfig.FAQs.Question}</p>
            <p>A: {methodConfig.FAQs.Answer}</p>
</div>