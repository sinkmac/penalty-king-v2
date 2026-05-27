<script lang="ts">
	import { flagClass, type AppState, type Kicker, type Team } from './types';

	let { state, chooseFirstKicker, goBack } = $props<{
		state: AppState;
		chooseFirstKicker: (kicker: Kicker) => void;
		goBack: () => void;
	}>();

	function pick(kicker: Kicker) {
		chooseFirstKicker(kicker);
	}
</script>

<section class="mx-auto flex min-h-screen w-full max-w-5xl flex-col bg-[#0a0a0c] px-4 py-5 text-[#f5f5f0] sm:px-6 lg:px-8">
	<header class="mb-8 flex items-center justify-between">
		<button
			type="button"
			class="border-0 p-0 text-sm font-normal uppercase tracking-[0.12em] text-[#6a6a68] transition hover:text-[#f5f5f0]"
			onclick={goBack}
		>
			← back
		</button>
		<p class="text-[0.78rem] font-medium uppercase tracking-[0.18em] text-[#6a6a68]">
			Who shoots first?
		</p>
		<span class="w-12" aria-hidden="true"></span>
	</header>

	{#if state.team1 && state.team2}
		<div class="grid flex-1 items-center gap-4 sm:grid-cols-2">
			{#each [{ kicker: 'team1' as Kicker, team: state.team1 }, { kicker: 'team2' as Kicker, team: state.team2 }] as item}
				<button
					type="button"
					class="group flex min-h-[240px] flex-col items-center justify-center gap-5 rounded-lg border border-[#f5f5f0]/70 bg-transparent p-8 text-center transition duration-100 active:scale-[1.02] active:bg-white/[0.04]"
					onclick={() => pick(item.kicker)}
					aria-label={`${item.team.name} shoots first`}
				>
					<span class="inline-flex aspect-[4/3] w-32 items-center overflow-hidden rounded border border-white/20 sm:w-40">
						<span class={`fi fi-${flagClass(item.team)} h-full w-full`}></span>
					</span>
					<span class="text-lg font-normal uppercase tracking-[0.1em] text-[#f5f5f0]">
						{item.team.name}
					</span>
				</button>
			{/each}
		</div>
	{/if}
</section>
