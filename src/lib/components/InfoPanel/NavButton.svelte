<script>
    import { infoMode, site, metacorp } from "$lib/scripts/stores.js";

    let handleNav = () => {
        if ($infoMode === "metaCorp") {
            metacorp.set({})
            infoMode.set("site")
        } else if ($infoMode === "site") {
            site.set({})
            infoMode.set("home")
        }
    }
</script>

<div>
    <button class="button is-ghost" on:click={handleNav} >&#8592 Back</button>
</div>