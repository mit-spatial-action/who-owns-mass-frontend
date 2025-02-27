<script>
    import { fly } from 'svelte/transition';
    import Modal from "$lib/components/Modal.svelte";

    export let duration = 1.2;
    export let borderWidth = 4;
    
    export let flyInProps = {
        "duration": 500,
        "distance": 150
    };
	export let denom = 4; 
    const steps = Array.from(Array(denom - 1), (_, i) => i + 1)

</script>

<Modal closeBtn={false} background={"has-background-light"}>
    <div class="modal-content">
        <div class="has-text-centered">
            <div transition:fly={{ 
                y: flyInProps.distance, 
                duration: flyInProps.duration 
                }} class="rippler">
                {#each steps as step}
                    <div class="ripple-wave" style="
                    --duration: {duration}; 
                    --border-width: {borderWidth};
                    animation-delay: -{ step * duration / denom}s;">
                    </div>
                {/each}
                <div class="circle-core"></div>
            </div>
        </div>
    </div>
</Modal>

<style lang="scss">
    @use 'src/lib/styles/vars.scss' as *;
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
        border: calc(var(--border-width) * 1px) solid;
        animation: ripple calc(var(--duration) * 1s) cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }

    .rippler .circle-core {
        background: $primary;
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
            border-color: $primary;
        }
        100% {
            top: 0;
            left: 0;
            width: 80px;
            height: 80px;
            opacity: 0.1;
            border-color: $primary;
        }
    }
</style>