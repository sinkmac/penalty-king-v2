<script lang="ts">
	import { toPng } from 'html-to-image';
	import MatchTitleEditor from './MatchTitleEditor.svelte';
	import ShareImage from './ShareImage.svelte';
	import type { AppState, Team } from './types';

	let { state: appState, resetShootout } = $props<{
		state: AppState;
		resetShootout: () => void;
	}>();

	let captureElement = $state<HTMLElement | null>(null);
	let isSharing = $state(false);
	let toast = $state('');

	const team1 = $derived(appState.team1 as Team);
	const team2 = $derived(appState.team2 as Team);

	function cleanTitle(input: string) {
		const cleaned = input.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
		return (cleaned.length > 30 ? `${cleaned.slice(0, 29)}…` : cleaned) || '2026 World Cup';
	}

	function updateMatchTitle(title: string) {
		appState.matchTitle = cleanTitle(title);
	}

	function downloadDataUrl(dataUrl: string) {
		const link = document.createElement('a');
		link.href = dataUrl;
		link.download = `penalty-king-${team1.code}-${team2.code}.png`;
		document.body.appendChild(link);
		link.click();
		link.remove();
		toast = 'Image saved — share it however you like';
	}

	async function dataUrlToFile(dataUrl: string) {
		const response = await fetch(dataUrl);
		const blob = await response.blob();
		return new File([blob], `penalty-king-${team1.code}-${team2.code}.png`, { type: 'image/png' });
	}

	async function shareScorecard() {
		if (!captureElement || isSharing) return;
		isSharing = true;
		toast = '';
		try {
			const dataUrl = await toPng(captureElement, {
				cacheBust: true,
				pixelRatio: 2,
				backgroundColor: '#0a0a0c',
				width: 600,
				height: captureElement.offsetHeight
			});
			const file = await dataUrlToFile(dataUrl);
			const shareData = {
				title: `Penalty King — ${team1.name} vs ${team2.name}`,
				text: `My predictions from the ${appState.matchTitle} shootout. penalty-king.app`,
				files: [file]
			};
			const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
			if (navigator.share && (!nav.canShare || nav.canShare(shareData))) {
				await navigator.share(shareData);
				toast = 'Share sheet opened';
			} else {
				downloadDataUrl(dataUrl);
			}
		} catch (error) {
			console.error(error);
			toast = 'Share image failed — try again';
		} finally {
			isSharing = false;
		}
	}
</script>

{#if appState.team1 && appState.team2}
	<section class="mx-auto min-h-screen w-full max-w-3xl bg-[#0a0a0c] px-4 py-5 text-[#f5f5f0] sm:px-6">
		<div class="grid gap-5">
			<ShareImage team1={appState.team1} team2={appState.team2} kicks={appState.kicks} matchTitle={appState.matchTitle} />

			<div class="rounded-2xl border border-white/10 p-4">
				<MatchTitleEditor value={appState.matchTitle} onChange={updateMatchTitle} />
			</div>

			<div class="grid gap-3 pb-5">
				<button
					type="button"
					class="rounded-lg bg-[#f5f5f0] px-5 py-4 text-sm font-medium uppercase tracking-[0.14em] text-[#0a0a0c] disabled:opacity-60"
					onclick={shareScorecard}
					disabled={isSharing}
				>
					{isSharing ? 'Preparing…' : 'Share'}
				</button>
				<button
					type="button"
					class="rounded-lg border border-white/50 px-5 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-[#f5f5f0]"
					onclick={resetShootout}
				>
					New shootout
				</button>
				{#if toast}
					<p class="text-center text-xs text-[#9b9b97]">{toast}</p>
				{/if}
			</div>
		</div>

		<div class="pointer-events-none fixed left-[-9999px] top-0" aria-hidden="true">
			<div bind:this={captureElement}>
				<ShareImage team1={appState.team1} team2={appState.team2} kicks={appState.kicks} matchTitle={appState.matchTitle} capture />
			</div>
		</div>
	</section>
{/if}
