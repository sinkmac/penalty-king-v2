<script lang="ts">
	let { state, addMockKick, endShootout } = $props();
</script>

<section>
	<h1>Phase: shootout</h1>
	<p>Shootout stub.</p>
	<button type="button" onclick={addMockKick}>Add a mock kick</button>
	<button type="button" onclick={endShootout}>End shootout</button>
	<pre>{JSON.stringify(state, null, 2)}</pre>
</section>
