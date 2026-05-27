<script lang="ts">
	let { selected = null, color = '#f5f5f0', size = 'large', onPick } = $props<{
		selected?: number | null;
		color?: string;
		size?: 'large' | 'mini';
		onPick?: (zone: number) => void;
	}>();

	const zones = Array.from({ length: 9 }, (_, index) => index);
	const isMini = $derived(size === 'mini');
</script>

<div class={isMini ? 'w-[30px]' : 'w-full'} style={`--team-color: ${color}`}>
	{#if !isMini}
		<div class="mx-auto h-5 w-[calc(100%-10px)] border-x-2 border-t-2 border-white"></div>
	{/if}

	<div
		class="grid aspect-[1.45/1] grid-cols-3 border-2 border-white {isMini ? 'border !border-white/60' : ''}"
		role="group"
		aria-label="Penalty prediction grid"
	>
		{#each zones as zone}
			{#if isMini}
				<div
					class="relative border border-white/25 transition duration-150 {selected === zone
						? 'border-[color:var(--team-color)] bg-[color:var(--team-color)]/40'
						: 'bg-transparent'}"
					aria-hidden="true"
				>
					{#if selected === zone}
						<span class="absolute left-1/2 top-1/2 block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--team-color)]"></span>
					{/if}
				</div>
			{:else}
				<button
					type="button"
					class="relative min-h-[60px] border border-white/30 p-0 transition duration-150 {selected === zone
						? 'scale-[1.02] border-[color:var(--team-color)] bg-[color:var(--team-color)]/40'
						: 'bg-transparent'} active:scale-[1.05]"
					onclick={() => onPick?.(zone)}
					aria-label={`Prediction zone ${zone}`}
					aria-pressed={selected === zone}
				>
					{#if selected === zone}
						<span class="absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--team-color)]"></span>
					{/if}
				</button>
			{/if}
		{/each}
	</div>
</div>
