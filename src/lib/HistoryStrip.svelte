<script lang="ts">
	import PenaltyGrid from './PenaltyGrid.svelte';
	import { teamForKicker, type Kick, type Team } from './types';

	let { kicks, team1, team2 } = $props<{
		kicks: Kick[];
		team1: Team;
		team2: Team;
	}>();
</script>

{#if kicks.length > 0}
	<div class="py-2" aria-label="Completed prediction history">
		<div class="flex gap-2 overflow-x-auto">
			{#each kicks as kick}
				{@const team = teamForKicker(kick.kicker, team1, team2)}
				<div class="animate-[fadeIn_200ms_ease-out] shrink-0">
					<PenaltyGrid selected={kick.predictionZone} color={team.color} size="mini" />
				</div>
			{/each}
		</div>
	</div>
{/if}

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
