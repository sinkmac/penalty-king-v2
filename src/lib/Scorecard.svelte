<script lang="ts">
	let { state, resetShootout } = $props();
</script>

<section>
	<h1>Phase: scorecard</h1>
	<p>Scorecard stub.</p>
	<button type="button" onclick={resetShootout}>New shootout</button>
	<pre>{JSON.stringify(state, null, 2)}</pre>
</section>
