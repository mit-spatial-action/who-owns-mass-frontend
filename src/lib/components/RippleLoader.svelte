<script>
    import { loadState } from "$lib/scripts/stores.ts";
    import { fade, fly } from 'svelte/transition';

    export let duration = 1.2;
    export let border = 4;
    
    export let flyInProps = {
        "duration": 500,
        "distance": 150
    };
	export let denom = 4; 
    const steps = Array.from(Array(denom - 1), (_, i) => i + 1)

</script>

{#if $loadState}
<div transition:fade={{duration: 800}} class="wrapper">
    <div transition:fly={{ 
        y: flyInProps.distance, 
        duration: flyInProps.duration 
        }} class="rippler">
        {#each steps as step}
            <div class="ripple-wave" style="
            --duration: {duration}; 
            --border: {border};
            animation-delay: -{ step * duration / denom}s;">
            </div>
        {/each}
        <div class="circle-core"></div>
    </div>
</div>
{/if}

<style lang="scss">
    @use "src/lib/styles/variables";
    .wrapper {
		display: flex;
		flex-direction: column;
		align-items:center;
		justify-content: center;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
        z-index: 100;
		bottom: 0;
		/* color: rebeccapurple; */
		background: variables.$body-background-color;
    }

    .rippler,
    .rippler div {
        z-index: 1000;
        box-sizing: border-box;
    }

    .rippler {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
    }

    .rippler div {
        position: absolute;
        opacity: 1;
        border-radius: 50%;
    }

    .rippler .ripple-wave {
        border: calc(var(--border) * 1px) solid;
        animation: ripple calc(var(--duration) * 1s) cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }

    .rippler .circle-core {
        background: variables.$primary;
        top: 30px;
        left: 30px;
        width: 20px;
        height: 20px;
    }

    @keyframes ripple {
        0% {
            top: 36px;
            left: 36px;
            width: 8px;
            height: 8px;
            opacity: 0.8;
            border-color: variables.$primary;
        }
        10% {
            top: 36px;
            left: 36px;
            width: 8px;
            height: 8px;
            opacity: 0.8;
            border-color: variables.$primary;
        }
        15% {
            top: 36px;
            left: 36px;
            width: 8px;
            height: 8px;
            opacity: 0.8;
            border-color: variables.$primary;
        }
        100% {
            top: 0;
            left: 0;
            width: 80px;
            height: 80px;
            opacity: 0.5;
            border-color: variables.$primary;
        }
    }
</style>