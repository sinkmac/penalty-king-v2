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
	<section class="mx-auto flex min-h-screen w-full max-w-5xl flex-col bg-[#0a0a0c] px-4 py-4 text-[#f5f5f0] sm:px-6 lg:px-8">
		<header class="grid min-h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-white/20 pb-3">
			<div class="flex min-w-0 items-center gap-3 transition-opacity duration-200">
				<span class="inline-flex aspect-[4/3] w-14 shrink-0 overflow-hidden rounded border border-white/20">
					<span class={`fi fi-${flagClass(currentTeam)} h-full w-full`}></span>
				</span>
				<span class="truncate text-sm font-medium uppercase tracking-[0.12em] text-[#f5f5f0]">
					{currentTeam.name}
				</span>
			</div>

			<p class="text-center text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[#f5f5f0]">
				{currentLabel}
			</p>

			<button
				type="button"
				class="justify-self-end border-0 p-0 text-right text-[0.68rem] font-normal uppercase tracking-[0.14em] text-[#6a6a68] transition hover:text-[#f5f5f0]"
				onclick={endShootout}
			>
				End shootout
			</button>
		</header>

		<div class="py-3">
			<HistoryStrip kicks={appState.kicks} team1={appState.team1} team2={appState.team2} />
		</div>

		<main class="flex flex-1 flex-col justify-center gap-5 pb-5">
			<div class="mx-auto w-full max-w-[720px]">
				<PenaltyGrid selected={currentPrediction} color={currentTeam.color} onPick={pickZone} />
			</div>

			<div class="flex min-h-[56px] items-center justify-center">
				{#if showNext && currentPrediction !== null}
					<button
						type="button"
						class="animate-[fadeIn_200ms_ease-out] rounded-lg border border-[#f5f5f0] px-6 py-4 text-sm font-medium uppercase tracking-[0.16em] text-[#f5f5f0]"
						onclick={nextKick}
					>
						Next kick →
					</button>
				{/if}
			</div>
		</main>
	</section>
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
