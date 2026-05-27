<script lang="ts">
	import FlagGrid from '$lib/FlagGrid.svelte';
	import Scorecard from '$lib/Scorecard.svelte';
	import Shootout from '$lib/Shootout.svelte';
	import TeamPicker from '$lib/TeamPicker.svelte';
	import teams from '$lib/teams.json';

	type Phase = 'select' | 'order' | 'shootout' | 'scorecard';
	type Team = {
		name: string;
		code: string;
		color: string;
	};
	type Kicker = 'team1' | 'team2';
	type Kick = {
		kicker: Kicker;
		predictionZone: number;
	};
	type State = {
		phase: Phase;
		team1: Team | null;
		team2: Team | null;
		firstKicker: Kicker | null;
		kicks: Kick[];
		inSuddenDeath: boolean;
		matchTitle: string;
	};

	let state = $state<State>({
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

	function addMockKick() {
		const kicker: Kicker = state.kicks.length % 2 === 0 ? state.firstKicker ?? 'team1' : state.firstKicker === 'team1' ? 'team2' : 'team1';
		state.kicks = [...state.kicks, { kicker, predictionZone: state.kicks.length % 9 }];
		state.inSuddenDeath = state.kicks.length > 10;
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
	<title>Penalty King v2 — Stage 2</title>
</svelte:head>

<main class="min-h-screen bg-[#0a0a0c] text-[#f5f5f0]">
	{#if state.phase === 'select'}
		<FlagGrid {state} teams={typedTeams} />
	{:else if state.phase === 'order'}
		<div class="p-6"><TeamPicker {state} {chooseFirstKicker} /></div>
	{:else if state.phase === 'shootout'}
		<div class="p-6"><Shootout {state} {addMockKick} {endShootout} /></div>
	{:else if state.phase === 'scorecard'}
		<div class="p-6"><Scorecard {state} {resetShootout} /></div>
	{/if}
</main>
