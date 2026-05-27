<script lang="ts">
	import { flagClass, type AppState, type Team } from './types';

	let { state: appState, teams } = $props<{
		state: AppState;
		teams: Team[];
	}>();

	let selectedCodes = $state<(string | null)[]>([null, null]);
	const selectedTeams = $derived(
		selectedCodes
			.map((code: string | null) => (code ? teams.find((team: Team) => team.code === code) : null))
			.filter((team): team is Team => Boolean(team))
	);

	const sortedTeams = $derived([...teams].sort((a, b) => a.name.localeCompare(b.name)));

	function isSelected(team: Team) {
		return selectedCodes.includes(team.code);
	}

	function teamForSlot(index: number) {
		const code = selectedCodes[index];
		return code ? teams.find((team: Team) => team.code === code) : null;
	}


	function selectTeam(team: Team) {
		if (isSelected(team)) return;
		const openIndex = selectedCodes.findIndex((code) => code === null);
		if (openIndex !== -1) {
			selectedCodes = selectedCodes.map((code, index) => (index === openIndex ? team.code : code));
		}
	}

	function clearSlot(index: number) {
		selectedCodes = selectedCodes.map((code, selectedIndex) => (selectedIndex === index ? null : code));
	}

	function continueToOrder() {
		const team1 = teamForSlot(0);
		const team2 = teamForSlot(1);
		if (team1 && team2) {
			appState.team1 = team1;
			appState.team2 = team2;
			appState.phase = 'order';
		}
	}
</script>

<section class="mx-auto flex min-h-screen w-full max-w-6xl flex-col bg-[#0a0a0c] px-4 py-5 text-[#f5f5f0] sm:px-6 lg:px-8">
	<header class="pb-4 pt-1">
		<p class="text-[0.78rem] font-medium uppercase tracking-[0.18em] text-[#6a6a68]">
			Pick the two teams playing
		</p>
	</header>

	<div class="grid gap-3 pb-5 sm:grid-cols-2">
		{#each ['team1', 'team2'] as slot, index}
			{@const team = teamForSlot(index)}
			<button
				type="button"
				class="min-h-[82px] rounded-lg border px-4 py-3 text-left transition duration-200 {team
					? 'border-[#f5f5f0]'
					: 'border-dashed border-[#6a6a68]'}"
				onclick={() => team && clearSlot(index)}
				aria-label={team ? `Remove ${team.name}` : `Empty team ${index + 1} slot`}
			>
				<p class="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[#6a6a68]">
					Team {index + 1}
				</p>
				{#if team}
					<div class="mt-3 flex animate-[fadeIn_200ms_ease-out] items-center gap-3">
						<span class="inline-flex aspect-[4/3] w-12 items-center overflow-hidden rounded border border-white/20">
							<span class={`fi fi-${flagClass(team)} h-full w-full`}></span>
						</span>
						<span class="text-base font-normal uppercase tracking-[0.08em] text-[#f5f5f0]">{team.name}</span>
					</div>
				{/if}
			</button>
		{/each}
	</div>

	<div class="grid grid-cols-4 gap-3 pb-6 min-[480px]:grid-cols-6 min-[960px]:grid-cols-8">
		{#each sortedTeams as team (team.code)}
			{@const selected = isSelected(team)}
			<button
				type="button"
				class="group flex min-h-[86px] flex-col items-center justify-start gap-2 rounded-lg border border-transparent bg-transparent p-1.5 text-center transition-opacity duration-200 {selected
					? 'cursor-default opacity-30'
					: 'cursor-pointer opacity-100'}"
				onclick={() => selectTeam(team)}
				disabled={selected || selectedTeams.length === 2}
				aria-pressed={selected}
				aria-label={selected ? `${team.name} selected` : `Select ${team.name}`}
			>
				<span
					class="inline-flex aspect-[4/3] w-full max-w-[74px] items-center overflow-hidden rounded border border-white/15 transition-transform duration-100 group-active:scale-105"
				>
					<span class={`fi fi-${flagClass(team)} h-full w-full`}></span>
				</span>
				<span class="text-[0.72rem] font-normal uppercase leading-tight tracking-[0.08em] text-[#9b9b97]">
					{team.name}
				</span>
			</button>
		{/each}
	</div>

	<div class="pb-5">
		<button
			type="button"
			class="w-full rounded-lg border border-[#f5f5f0] px-5 py-4 text-sm font-medium uppercase tracking-[0.16em] text-[#f5f5f0] transition-opacity duration-200 disabled:pointer-events-none disabled:opacity-30"
			disabled={selectedTeams.length !== 2}
			onclick={continueToOrder}
		>
			Continue
		</button>
	</div>
</section>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
