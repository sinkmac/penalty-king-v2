<script lang="ts">
	let { state, teams, pickMockTeams } = $props();
</script>

<section>
	<h1>Phase: select</h1>
	<p>FlagGrid stub. Teams available: {teams.length}</p>
	<button type="button" onclick={pickMockTeams}>Pick France and Holland (mock)</button>
	<pre>{JSON.stringify(state, null, 2)}</pre>
</section>
