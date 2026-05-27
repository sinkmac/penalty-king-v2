<script lang="ts">
	import { onDestroy } from 'svelte';
	import HistoryStrip from './HistoryStrip.svelte';
	import PenaltyGrid from './PenaltyGrid.svelte';
	import {
		flagClass,
		kickerForIndex,
		kickLabel,
		teamForKicker,
		type AppState,
		type Kick,
		type Kicker,
		type Team
	} from './types';

	let { state: appState, endShootout } = $props<{
		state: AppState;
		endShootout: () => void;
	}>();

	let currentPrediction = $state<number | null>(null);
	let showNext = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	const firstKicker = $derived(appState.firstKicker ?? 'team1');
	const team1 = $derived(appState.team1 as Team);
	const team2 = $derived(appState.team2 as Team);
	const currentKicker = $derived(kickerForIndex(appState.kicks.length, firstKicker as Kicker));
	const currentTeam = $derived(teamForKicker(currentKicker, team1, team2));
	const currentLabel = $derived(kickLabel(appState.kicks.length));

	function displayName(team: Team) {
		const fallback: Record<string, string> = {
			US: 'USA',
			KR: 'KOR',
			SA: 'KSA',
			BA: 'BIH',
			CD: 'COD'
		};
		if (team.name.length <= 12) return team.name;
		return fallback[team.code] ?? team.code;
	}

	function clearTimer() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}

	function pickZone(zone: number) {
		currentPrediction = zone;
		if (showNext) return;
		showNext = false;
		clearTimer();
		timer = setTimeout(() => {
			showNext = true;
			timer = null;
		}, 5000);
	}

	function nextKick() {
		if (currentPrediction === null) return;
		const completedKick: Kick = {
			kicker: currentKicker,
			predictionZone: currentPrediction
		};
		appState.kicks = [...appState.kicks, completedKick];
		appState.inSuddenDeath = appState.kicks.length >= 10;
		currentPrediction = null;
		showNext = false;
		clearTimer();
	}

	onDestroy(clearTimer);
</script>

{#if appState.team1 && appState.team2 && appState.firstKicker}
	<section class="mx-auto flex min-h-screen w-full max-w-5xl flex-col bg-[#0a0a0c] px-3 py-3 text-[#f5f5f0] sm:px-6 lg:px-8">
		<header class="flex h-[54px] items-center gap-2 border-b border-white/[0.15]">
			<div class="flex min-w-0 flex-1 items-center gap-2 transition-opacity duration-200">
				<span class="fi-wrapper inline-flex h-8 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-white/20 sm:h-10">
					<span class={`fi fi-${flagClass(currentTeam)} h-full w-auto`}></span>
				</span>
				<span class="min-w-0 truncate text-[0.72rem] font-medium uppercase tracking-[0.08em] text-[#f5f5f0] sm:text-sm">
					{displayName(currentTeam)}
				</span>
			</div>

			<p class="shrink-0 whitespace-nowrap text-center text-[0.66rem] font-medium uppercase tracking-[0.11em] text-[#f5f5f0] sm:text-[0.72rem]">
				{currentLabel}
			</p>

			<button
				type="button"
				class="shrink-0 border-0 p-0 text-[0.66rem] font-medium uppercase tracking-[0.12em] text-[#6a6a68] underline-offset-4 transition hover:text-[#f5f5f0] hover:underline active:underline sm:text-[0.72rem]"
				onclick={endShootout}
			>
				End
			</button>
		</header>

		<HistoryStrip kicks={appState.kicks} team1={appState.team1} team2={appState.team2} />

		<main class="flex flex-1 flex-col">
			<div class="flex justify-center pt-16 sm:pt-20">
				<div class="w-full max-w-[620px]">
					<PenaltyGrid selected={currentPrediction} color={currentTeam.color} onPick={pickZone} />
				</div>
			</div>

			{#if showNext && currentPrediction !== null}
				<div class="mt-10 flex justify-center pb-7">
					<button
						type="button"
						class="w-[60vw] max-w-[320px] animate-[fadeIn_200ms_ease-out] rounded-lg border border-[#f5f5f0] px-5 py-4 text-sm font-medium uppercase tracking-[0.16em] text-[#f5f5f0]"
						onclick={nextKick}
					>
						Next kick →
					</button>
				</div>
			{/if}
		</main>
	</section>
{/if}

<style>
	.fi-wrapper :global(.fi) {
		background-size: cover;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
