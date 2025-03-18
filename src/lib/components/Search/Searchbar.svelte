<script>
    export let mode;
    export let color;
</script>

<p id="searchbar" class="control has-icons-left">
    <input id="search-input" class="input is-{color}" type="text" placeholder="Search by {mode}" />
    <span class="icon is-left has-text-{color}">
        <i class="fas fa-search" aria-hidden="true"></i>
    </span>
</p>