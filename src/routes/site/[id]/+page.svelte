<script lang="ts">
	import CardHeader from "$lib/components/Panels/Cards/CardHeader.svelte";
	import CardContent from "$lib/components/Panels/Cards/CardContent.svelte";
	import IconCard from "$lib/components/Panels/Cards/IconCard.svelte";
	import ErrorMessage from "$lib/components/ErrorMessage.svelte";
	import landUseCodes from "$lib/config/landuse.json";
	import OwnerTags from "$lib/components/Panels/OwnerTags.svelte";
	import { appState } from "$lib/state.svelte";
	import { slide } from "svelte/transition";

	import type { PageProps } from "./$types";
	let { data }: PageProps = $props();

	let priceInfoActive = $state(true);

	const toggleActive = () => {
		priceInfoActive = !priceInfoActive;
	};

	$effect(() => {
		if (data.site) appState.site = data.site;
	});
</script>

<div transition:slide={{ duration: 250, axis: "y" }}>
	<CardHeader>{data.site.address.addr}</CardHeader>
	<CardContent>
		<div class="box p-0 is-shadowless">
			<div class="tag is-medium">
				{data.site.address.muni}
			</div>
			<div class="tag is-medium">
				{data.site.address.postal}
			</div>
			<OwnerTags
				company_name={data.site.owners[0].properties.name}
				trust={data.site.owners[0].properties.trust}
			/>
		</div>
		<div class="fixed-grid has-2-cols">
			<div class="grid">
				<div class="cell">
					<IconCard title="Period" icon="calendar">
						{#if data.site.fy}July 1, {data.site.fy - 1}--June 30, {data
								.site.fy}{:else}Unknown.{/if}
					</IconCard>
				</div>
				<div class="cell">
					<IconCard title="Units" icon="building">
						{#if data.site.units}{#if data.site.ooc}{data.site.units -
									1}{:else}{Math.round(data.site.units)}{/if} Rental
							Units{:else}Unknown.{/if}
					</IconCard>
				</div>
				<div class="cell">
					<IconCard title="Last Sale" icon="hand-holding-dollar">
						{#if data.site.ls_price}${data.site.ls_price.toLocaleString()}{:else}Unknown{/if}{#if data.site.ls_price < 5000}
							<button
								class="icon"
								aria-label="Why such a low price?"
								onclick={toggleActive}
								onkeydown={toggleActive}
							>
								<i class="fas fa-question-circle"></i>
							</button>
						{/if} on {#if data.site.ls_date}{new Date(
								data.site.ls_date,
							).toLocaleDateString()}{:else}Unknown.{/if}
					</IconCard>
				</div>
				<div class="cell">
					<IconCard title="Valuation" icon="dollar-sign">
						{#if data.site.lnd_val > 0 && data.site.bld_val > 0}
							${(data.site.lnd_val + data.site.bld_val).toLocaleString()}
						{:else if data.site.bld_val > 0}
							${data.site.bld_val.toLocaleString()}
						{:else if data.site.lnd_val > 0}
							${data.site.lnd_val.toLocaleString()}
						{:else}
							Unknown.
						{/if}
						in FY {data.site.fy}
					</IconCard>
				</div>
				<div class="cell">
					<IconCard title="Type" icon="map">
						{#if data.site.luc}
							{landUseCodes[data.site.luc] || "Unknown"}
						{:else}
							Unknown
						{/if}
					</IconCard>
				</div>
				<div class="cell">
					{#if data.site.ooc}
						<IconCard title="Owner-Occupied" icon="house"/>
					{:else}
						<IconCard
							title="Absentee Landlord"
							icon="people-arrows"
						/>
					{/if}
				</div>
			</div>
		</div>
		{#if !priceInfoActive && data.site.ls_price}
			<ErrorMessage error="quitClaimDeed" />
		{:else if !priceInfoActive}
			<ErrorMessage error="priceUnknown" />
		{/if}
		{#if data.site.fy < 2024}
			<ErrorMessage error="outdatedInfo" />
		{/if}
		<div class="title">Owners</div>
		<div class="fixed-grid has-2-cols">
			<div class="grid">
				{#each data.site.owners as owner, index}
					<div class="cell">
						<div class="card is-shadowless">
							<div class="card-content">
								<span class="icon-text">
									<span class="icon">
										<i class="fas fa-people-group"></i>
									</span>
									<span class="has-text-weight-bold"
										>{owner.properties.name}</span
									>
								</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="block">
			{#if data.site.metacorp.prop_count > 1}
				<p>
					This owner may own <span class="tag is-medium"
						>{data.site.metacorp.prop_count} properties</span
					>, including
					<span class="tag is-medium"
						>{Math.round(data.site.metacorp.unit_count)} units</span
					>.
				</p>
				<a
					class="button mt-5 border-primary is-shadowless"
					data-sveltekit-preload-data="off"
					href={`/meta/${data.site.metacorp.id}`}
				>
					See Details &#8594
				</a>
			{:else}
				<ErrorMessage error="noProperties" />
			{/if}
		</div>
	</CardContent>
</div>

<style>
	.box {
		border-radius: 0;
	}
</style>
