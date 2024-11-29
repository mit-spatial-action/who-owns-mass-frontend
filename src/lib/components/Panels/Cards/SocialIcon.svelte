<script>
    export let socialUrl;
    let icon;
    let name;
    let set = "brands";
    if (socialUrl.includes("github.com")) {
        icon = "github"
        name = "Github"
    } else if (socialUrl.includes("linkedin")) {
        icon = "linkedin"
        name = "LinkedIn"
    } else if (socialUrl.includes("bsky.")) {
        icon = "bluesky"
        name = "Bluesky"
    } else {
        icon = "globe"
        name = "Website"
        set = "solid"
    }
</script>

<a href="{socialUrl}">
<span class="icon-text">
    <span class="icon">
        <i class="fa-{set} fa-{icon}"></i>
    </span>
    <span>{name}</span>
</span>
</a>

<!-- <a href="{socialUrl}" class="card-footer-item">{social.name}</a> -->