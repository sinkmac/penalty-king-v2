<script lang="ts">
	let { state, chooseFirstKicker } = $props();
</script>

<section>
	<h1>Phase: order</h1>
	<p>TeamPicker stub.</p>
	<p>Team 1: {state.team1?.name ?? 'None'}</p>
	<p>Team 2: {state.team2?.name ?? 'None'}</p>
	<button type="button" onclick={() => chooseFirstKicker('team1')}>Team 1 first</button>
	<button type="button" onclick={() => chooseFirstKicker('team2')}>Team 2 first</button>
	<pre>{JSON.stringify(state, null, 2)}</pre>
</section>
