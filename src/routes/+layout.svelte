<script lang="ts">
	import '../app.css';
	import 'flag-icons/css/flag-icons.min.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Penalty King v2</title>
</svelte:head>

{@render children()}
