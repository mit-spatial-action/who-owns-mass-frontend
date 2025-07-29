<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { Circle2 } from "svelte-loading-spinners";
    import { primary, success } from '$lib/styles/_variables';
</script>

<div class="modal is-active" transition:fade={{ duration: 400 }}>
    <div class="modal-background"></div>
        <div transition:fly={{ duration: 200, y: 200 }}>
            <Circle2
                size="100"
                colorOuter={success}
                colorCenter={primary}
                colorInner={success}
                unit="px"
                durationOuter="2s"
                durationCenter="1.5s"
                durationInner="1.75s"
            />
        </div>
</div>
<style lang="scss">
    .modal-background {
        opacity: 0.68;
    }
</style>
