<script lang="ts">
	import type { PageProps } from "./$types";
	import Modal from "$lib/components/Modals/Modal.svelte";
	import IconCard from "$lib/components/Cards/IconCard.svelte";
	import CardHeader from "$lib/components/Cards/CardHeader.svelte";
	import CardContent from "$lib/components/Cards/CardContent.svelte";
	import MetaCorpModal from "$lib/components/Modals/MetaCorpModal.svelte";
	import OwnerTags from "$lib/components/OwnerTags.svelte";
	import { appState } from "$lib/state.svelte";
	import { slide } from "svelte/transition";
	import { addGeoJSONLayer } from "$lib/scripts/utils";

	let modalOpen = $state(false);
	let activeTab = $state("properties");

	let { data }: PageProps = $props();

	$effect(() => {
		if (data.metacorp) {
			appState.metacorp = data.metacorp;
			addGeoJSONLayer(data.geojson)
				.then(() => appState.loading = false);
		}
	});

	const openModal = (modalType) => {
		modalOpen = modalOpen ? false : modalOpen; // Resets modalOpen variable

		modalOpen = true;
		activeTab = modalType;
	};

	const handleModalClose = () => {
		modalOpen = false;
	}

	const sortMetacorpProperties = () => {
		const sortedProperties = [...data.metacorp.sites.features].sort(
			(a, b) => {
				// Check if all necessary fields are present
				if (
					a.properties.address.muni &&
					b.properties.address.muni &&
					a.properties.address.body &&
					b.properties.address.body &&
					a.properties.address.start &&
					b.properties.address.start
				) {
					//Compare "muni"
					const muniCompare = a.properties.address.muni.localeCompare(
						b.properties.address.muni,
					);
					if (muniCompare !== 0) return muniCompare;

					// If "muni" is the same, compare "body"
					const bodyCompare = a.properties.address.body.localeCompare(
						b.properties.address.body,
					);
					if (bodyCompare !== 0) return bodyCompare;

					// If both "muni" and "body" are the same, compare "start"
					return a.properties.address.start.localeCompare(
						b.properties.address.start,
					);
				}
				// Return 0 if no matching properties, or default fallback logic
				return 0;
			},
		);

		const groupedData = sortedProperties.reduce((acc, item) => {
			if (!acc[item.properties.address.muni])
				acc[item.properties.address.muni] = [];
			acc[item.properties.address.muni].push(item);
			return acc;
		}, {});

		return groupedData;
	}

	const sortMetacorpOwners = () => {
		const sortedProperties = [...data.metacorp.sites.features].sort(
			(a, b) => {
				// Check if all necessary fields are present
				if (
					a.properties.address.muni &&
					b.properties.address.muni &&
					a.properties.address.body &&
					b.properties.address.body &&
					a.properties.address.start &&
					b.properties.address.start
				) {
					// First compare "muni"
					const muniCompare = a.properties.address.muni.localeCompare(
						b.properties.address.muni,
					);
					if (muniCompare !== 0) return muniCompare;

					// If "muni" is the same, compare "body"
					const bodyCompare = a.properties.address.body.localeCompare(
						b.properties.address.body,
					);
					if (bodyCompare !== 0) return bodyCompare;

					// If both "muni" and "body" are the same, compare "start"
					return a.properties.address.start.localeCompare(
						b.properties.address.start,
					);
				}

				// Return 0 if no matching properties, or default fallback logic
				return 0;
			},
		);

		const groupedOwnerData = sortedProperties.reduce((acc, item) => {
			if (!acc[item.properties.owners[0].properties.name])
				acc[item.properties.owners[0].properties.name] = [];
			acc[item.properties.owners[0].properties.name].push(item);
			return acc;
		}, {});

		return groupedOwnerData;
	}
	const groupedMetaCorpData = sortMetacorpProperties();
	const groupedOwnerCorpData = sortMetacorpOwners();
</script>

<div transition:slide={{ duration: 250, axis: "y" }}>
	<CardHeader>{data.metacorp.name}</CardHeader>
	<div class="mt-2">
		<OwnerTags trust={false} company_name={data.metacorp.name} />
	</div>
	<CardContent>
		<div class="box p-0 is-shadowless">
			<div class="fixed-grid">
				<div class="grid">
					<div class="cell">
						<IconCard title="Units" icon="building">
							{#if data.metacorp.unit_count}
								{data.metacorp.unit_count}
							{/if}
						</IconCard>
					</div>
					<div class="cell">
						<IconCard title="Properties" icon="city">
							{#if data.metacorp.prop_count}
								{data.metacorp.prop_count}
							{/if}
						</IconCard>
					</div>
					<div class="cell">
						<IconCard title="Total Value" icon="dollar-sign">
							{#if data.metacorp.val}
								{data.metacorp.val.toLocaleString()}
							{/if}
						</IconCard>
					</div>
				</div>
			</div>
		</div>
		<div class="title">Properties</div>
		<div class="fixed-grid">
			<div class="grid">
				{#each data.metacorp.sites.features.slice(0, 4) as site}
					<div class="cell">
						<button
							class="card border-primary is-shadowless"
							aria-label="Select {site.properties.address}"
							data-sveltekit-preload-data="off"
							tabindex="0"
						>
							<!-- onmouseover={() => highlighted.set(site.id)}
							onfocus={() => highlighted.set(site.id)}
							onmouseleave={() => highlighted.set(null)} -->
							<div class="card-content">
								<a href={`/site/${site.id}`}>
									<div class="has-text-weight-bold">
										{site.properties.address.addr}
									</div>
									<div>
										{#if site.properties.address.muni}{`${site.properties.address.muni}, `}{/if}{#if site.properties.address.state}{`${site.properties.address.state} `}
										{/if}{#if site.properties.address.postal}{site
												.properties.address.postal}{/if}
									</div>
								</a>
							</div>
						</button>
					</div>
				{/each}
			</div>
		</div>
		{#if data.metacorp.sites.features.length > 4}
			<div class="block buttons is-right">
				<button
					class="button border-primary"
					data-sveltekit-preload-data="off"
					aria-label="See all Properties"
					onclick={() => openModal("properties")}
				>
					See All {data.metacorp.sites.features.length} Properties &#8594
				</button>
			</div>
		{/if}

		{#if modalOpen}
			<Modal bind:open={modalOpen} closeBtn={true}>
				<MetaCorpModal
					townGroups={groupedMetaCorpData}
					ownerGroups={groupedOwnerCorpData}
					{activeTab}
				/>
			</Modal>
		{/if}

		{#if data.metacorp.aliases.length > 1}
			<div class="title">Other Names</div>
			<div class="fixed-grid">
				<div class="grid">
					{#each data.metacorp.aliases.slice(0, 6) as alias, index}
						<div class="cell">
							<button
								class="card border-primary is-shadowless"
								aria-label="Select {alias}"
								tabindex="0"
								data-sveltekit-preload-data="off"
							>
								<div class="card-content">
									<div class="has-text-weight-bold">
										{alias}
									</div>
								</div>
							</button>
						</div>
					{/each}
				</div>
			</div>
			{#if data.metacorp.aliases.length > 4}
				<div class="block buttons is-right">
					<button
						class="button border-primary"
						data-sveltekit-preload-data="off"
						aria-label="See all Properties"
						onclick={() => openModal("owners")}
					>
						See All {data.metacorp.aliases.length - 1} Associated Companies
						&#8594
					</button>
				</div>
			{/if}
		{/if}
	</CardContent>
</div>

<style>
	.box {
		border-radius: 0;
	}
</style>
