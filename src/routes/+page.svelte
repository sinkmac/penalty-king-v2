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

	function pickMockTeams() {
		state.team1 = typedTeams.find((team) => team.name === 'France') ?? typedTeams[0];
		state.team2 = typedTeams.find((team) => team.name === 'Netherlands') ?? typedTeams[1];
		state.phase = 'order';
	}

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
	<title>Penalty King v2 — Stage 1</title>
</svelte:head>

<main class="min-h-screen bg-[#0a0a0c] p-6 text-[#f5f5f0]">
	<p class="mb-6 text-sm uppercase tracking-[0.2em]">Penalty King v2 — Stage 1 skeleton</p>

	{#if state.phase === 'select'}
		<FlagGrid {state} teams={typedTeams} {pickMockTeams} />
	{:else if state.phase === 'order'}
		<TeamPicker {state} {chooseFirstKicker} />
	{:else if state.phase === 'shootout'}
		<Shootout {state} {addMockKick} {endShootout} />
	{:else if state.phase === 'scorecard'}
		<Scorecard {state} {resetShootout} />
	{/if}
</main>
