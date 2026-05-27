<script lang="ts">
	const presets = ['Group Stage', 'Round of 16', 'Quarter Final', 'Semi Final', 'Final', 'Friendly'];

	let { value, onChange } = $props<{
		value: string;
		onChange: (title: string) => void;
	}>();

	let customOpen = $state(false);
	let customValue = $state('');
	const isKnownTitle = $derived(value === '2026 World Cup' || presets.includes(value));

	function cleanTitle(input: string) {
		const cleaned = input.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
		return cleaned.length > 30 ? `${cleaned.slice(0, 29)}…` : cleaned;
	}

	function selectPreset(title: string) {
		if (title === 'Custom...') {
			customOpen = true;
			customValue = value === '2026 World Cup' || presets.includes(value) ? '' : value;
			return;
		}
		customOpen = false;
		onChange(title);
	}

	function commitCustom() {
		const cleaned = cleanTitle(customValue);
		onChange(cleaned || '2026 World Cup');
		customOpen = false;
	}
</script>

<div class="grid gap-3">
	<label class="grid gap-2">
		<span class="text-[0.68rem] font-normal uppercase tracking-[0.16em] text-[#6a6a68]">Match title</span>
		<select
			class="rounded-lg border border-white/20 bg-[#0a0a0c] px-3 py-3 text-sm font-medium text-[#f5f5f0] outline-none"
			value={customOpen ? 'Custom...' : value}
			onchange={(event) => selectPreset(event.currentTarget.value)}
		>
			<option value="2026 World Cup">2026 World Cup</option>
			{#each presets as preset}
				<option value={preset}>{preset}</option>
			{/each}
			{#if !isKnownTitle}
				<option value={value}>{value}</option>
			{/if}
			<option value="Custom...">Custom...</option>
		</select>
	</label>

	{#if customOpen}
		<label class="grid gap-2">
			<span class="text-[0.68rem] font-normal uppercase tracking-[0.16em] text-[#6a6a68]">Custom title</span>
			<div class="flex gap-2">
				<input
					class="min-w-0 flex-1 rounded-lg border border-white/20 bg-[#0a0a0c] px-3 py-3 text-sm text-[#f5f5f0] outline-none"
					maxlength="30"
					value={customValue}
					oninput={(event) => (customValue = cleanTitle(event.currentTarget.value))}
					placeholder="Type match title"
				/>
				<button
					type="button"
					class="rounded-lg border border-white/40 px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#f5f5f0]"
					onclick={commitCustom}
				>
					Set
				</button>
			</div>
		</label>
	{/if}
</div>
