<script lang="ts">
	import { flagClass, teamForKicker, type Kick, type Team } from './types';

	let { team1, team2, kicks, matchTitle, capture = false } = $props<{
		team1: Team;
		team2: Team;
		kicks: Kick[];
		matchTitle: string;
		capture?: boolean;
	}>();

	const team1Kicks = $derived(kicks.filter((kick: Kick) => kick.kicker === 'team1'));
	const team2Kicks = $derived(kicks.filter((kick: Kick) => kick.kicker === 'team2'));

	function miniCellClass(zone: number, selected: number, color: string) {
		const classes: string[] = [];
		if (zone % 3 !== 2) classes.push('border-r border-white/25');
		if (zone < 6) classes.push('border-b border-white/25');
		if (zone === selected) classes.push('selected-cell');
		return classes.join(' ');
	}
</script>

<div
	class="scorecard-card mx-auto bg-[#0a0a0c] text-[#f5f5f0] {capture ? 'w-[600px] min-h-[900px] p-10' : 'w-full max-w-[600px] rounded-2xl border border-white/10 p-5 shadow-2xl sm:p-8'}"
>
	<header class="text-center">
		<p class="text-[0.8rem] font-semibold uppercase tracking-[0.28em] text-[#d8d8d2]">Penalty King</p>
		<h1 class="mx-auto mt-3 max-w-[460px] text-balance text-2xl font-medium leading-tight text-[#f5f5f0]">
			{matchTitle}
		</h1>
		<div class="mt-4 flex items-center justify-center gap-3 text-sm font-medium text-[#f5f5f0]">
			<span class="inline-flex items-center gap-2">
				<span class="inline-flex h-5 overflow-hidden rounded-[2px] ring-1 ring-white/20">
					<span class={`fi fi-${flagClass(team1)} h-full w-auto`}></span>
				</span>
				{team1.name}
			</span>
			<span class="text-[#6a6a68]">vs</span>
			<span class="inline-flex items-center gap-2">
				{team2.name}
				<span class="inline-flex h-5 overflow-hidden rounded-[2px] ring-1 ring-white/20">
					<span class={`fi fi-${flagClass(team2)} h-full w-auto`}></span>
				</span>
			</span>
		</div>
	</header>

	<section class="mt-9 grid grid-cols-2 gap-4">
		{#each [{ key: 'team1', team: team1, teamKicks: team1Kicks }, { key: 'team2', team: team2, teamKicks: team2Kicks }] as column}
			<div class="min-w-0">
				<div class="mb-4 flex flex-col items-center gap-2 text-center">
					<span class="inline-flex h-8 overflow-hidden rounded-[2px] ring-1 ring-white/20">
						<span class={`fi fi-${flagClass(column.team)} h-full w-auto`}></span>
					</span>
					<p class="truncate text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[#f5f5f0]">
						{column.team.name}
					</p>
				</div>

				{#if column.teamKicks.length > 0}
					<div class="flex flex-col items-center gap-3.5">
						{#each column.teamKicks as kick}
							<div class="mini-grid grid aspect-[5/3] w-[74px] grid-cols-3 border-x border-t border-white/60" style={`--team-color: ${column.team.color}`}>
								{#each Array.from({ length: 9 }, (_, index) => index) as zone}
									<div class="relative {miniCellClass(zone, kick.predictionZone, column.team.color)}">
										{#if zone === kick.predictionZone}
											<span class="absolute inset-0 bg-[color:var(--team-color)]/50 shadow-[inset_0_0_0_1px_var(--team-color)]"></span>
										{/if}
									</div>
								{/each}
							</div>
						{/each}
					</div>
				{:else}
					<p class="mx-auto max-w-[120px] text-center text-xs leading-relaxed text-[#6a6a68]">No kicks recorded</p>
				{/if}
			</div>
		{/each}
	</section>

	<footer class="mt-10 text-center">
		<p class="text-[0.68rem] font-normal uppercase tracking-[0.18em] text-[#9b9b97]">
			My predictions — penalty-king.app
		</p>
	</footer>
</div>

<style>
	.scorecard-card :global(.fi) {
		background-size: cover;
	}
</style>
