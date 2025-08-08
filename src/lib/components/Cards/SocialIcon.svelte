<script lang="ts">
    let icon = $state();
    let name = $state();
    let { url, color = "success" } = $props();
    let set = $state("brands");
    if (url.includes("github.com")) {
        icon = "github"
        name = "Github"
    } else if (url.includes("linkedin")) {
        icon = "linkedin"
        name = "LinkedIn"
    } else if (url.includes("bsky.")) {
        icon = "bluesky"
        name = "Bluesky"
    } else {
        icon = "globe"
        name = "Website"
        set = "solid"
    }
</script>

<a href="{url}" class="{color}">
<span class="icon-text">
    <span class="icon">
        <i class="fa-{set} fa-{icon}"></i>
    </span>
    <span>{name}</span>
</span>
</a>