<script lang="ts">
	let { selected = null, color = '#f5f5f0', size = 'large', onPick } = $props<{
		selected?: number | null;
		color?: string;
		size?: 'large' | 'mini';
		onPick?: (zone: number) => void;
	}>();

	const zones = Array.from({ length: 9 }, (_, index) => index);
	const isMini = $derived(size === 'mini');

	function largeDivisionClasses(zone: number) {
		const classes: string[] = [];
		if (zone % 3 !== 2) classes.push('border-r border-white/30');
		if (zone < 6) classes.push('border-b border-white/30');
		return classes.join(' ');
	}
</script>

<div class={isMini ? 'w-[30px]' : 'w-full'} style={`--team-color: ${color}`}>
	{#if isMini}
		<div class="grid aspect-[5/3] grid-cols-3" role="img" aria-label="Completed prediction mini-grid">
			{#each zones as zone}
				<div
					class="relative border border-white/25 transition duration-150 {selected === zone
						? 'border-[color:var(--team-color)] bg-[color:var(--team-color)]/40'
						: 'bg-transparent'}"
				>
					{#if selected === zone}
						<span class="absolute left-1/2 top-1/2 block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--team-color)]"></span>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="relative mx-auto w-full max-w-[620px] pt-5">
			<div class="absolute left-0 right-0 top-0 h-5 border-x-2 border-t-2 border-white"></div>
			<div
				class="grid aspect-[5/3] grid-cols-3 border-x-2 border-white"
				role="group"
				aria-label="Penalty prediction grid"
			>
				{#each zones as zone}
					<button
						type="button"
						class="relative min-h-[60px] p-0 transition duration-150 {largeDivisionClasses(zone)} {selected === zone
							? 'scale-[1.02] bg-[color:var(--team-color)]/40 shadow-[inset_0_0_0_2px_var(--team-color)]'
							: 'bg-transparent'} active:scale-[1.05]"
						onclick={() => onPick?.(zone)}
						aria-label={`Prediction zone ${zone}`}
						aria-pressed={selected === zone}
					>
						{#if selected === zone}
							<span class="absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--team-color)]"></span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
