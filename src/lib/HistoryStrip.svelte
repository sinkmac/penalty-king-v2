<script lang="ts">
	import PenaltyGrid from './PenaltyGrid.svelte';
	import { flagClass, teamForKicker, type Kick, type Team } from './types';

	let { kicks, team1, team2 } = $props<{
		kicks: Kick[];
		team1: Team;
		team2: Team;
	}>();
</script>

<div class="min-h-[42px] border-b border-white/10 pb-2">
	{#if kicks.length > 0}
		<div class="flex gap-2 overflow-x-auto py-1" aria-label="Completed prediction history">
			{#each kicks as kick, index}
				{@const team = teamForKicker(kick.kicker, team1, team2)}
				<div class="animate-[fadeIn_200ms_ease-out] shrink-0">
					<div class="mb-1 flex items-center justify-between gap-1">
						<span class="inline-flex aspect-[4/3] w-4 overflow-hidden rounded-[1px] border border-white/10">
							<span class={`fi fi-${flagClass(team)} h-full w-full`}></span>
						</span>
						<span class="text-[0.5rem] font-normal text-[#6a6a68]">{index + 1}</span>
					</div>
					<PenaltyGrid selected={kick.predictionZone} color={team.color} size="mini" />
				</div>
			{/each}
		</div>
	{:else}
		<div class="h-full border-b border-white/10"></div>
	{/if}
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
