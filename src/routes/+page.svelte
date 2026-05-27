<script lang="ts">
	import FlagGrid from '$lib/FlagGrid.svelte';
	import Scorecard from '$lib/Scorecard.svelte';
	import Shootout from '$lib/Shootout.svelte';
	import TeamPicker from '$lib/TeamPicker.svelte';
	import teams from '$lib/teams.json';
	import type { AppState, Kicker, Team } from '$lib/types';

	let state = $state<AppState>({
		phase: 'select',
		team1: null,
		team2: null,
		firstKicker: null,
		kicks: [],
		inSuddenDeath: false,
		matchTitle: '2026 World Cup'
	});

	const typedTeams = teams as Team[];

	function chooseFirstKicker(kicker: Kicker) {
		state.firstKicker = kicker;
		state.phase = 'shootout';
	}

	function backToSelect() {
		state.team1 = null;
		state.team2 = null;
		state.firstKicker = null;
		state.kicks = [];
		state.inSuddenDeath = false;
		state.phase = 'select';
	}

	function endShootout() {
		state.phase = 'scorecard';
	}

	function resetShootout() {
		state = {
			phase: 'select',
			team1: null,
			team2: null,
			firstKicker: null,
			kicks: [],
			inSuddenDeath: false,
			matchTitle: '2026 World Cup'
		};
	}
</script>

<svelte:head>
	<title>Penalty King v2 — Stage 3</title>
</svelte:head>

<main class="min-h-screen bg-[#0a0a0c] text-[#f5f5f0]">
	{#if state.phase === 'select'}
		<FlagGrid {state} teams={typedTeams} />
	{:else if state.phase === 'order'}
		<TeamPicker {state} {chooseFirstKicker} goBack={backToSelect} />
	{:else if state.phase === 'shootout'}
		<Shootout {state} {endShootout} />
	{:else if state.phase === 'scorecard'}
		<div class="p-6"><Scorecard {state} {resetShootout} /></div>
	{/if}
</main>
