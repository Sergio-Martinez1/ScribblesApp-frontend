<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import '../app.css';
	import settings from '../stores/settings';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: darkMode =
		data.plainMyUser && data.plainMyUser.dark_mode ? data.plainMyUser.dark_mode : 'disabled';
	$: {
		switch (darkMode) {
			case 'enabled':
				$settings.color_scheme = 'dark';
				break;
			case 'disabled':
				$settings.color_scheme = '';
				break;
		}
	}

	let darkModeMediaQuery;
	let listener;

	onMount(() => {
		darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		listener = () => updateDarkMode(darkModeMediaQuery);
    updateDarkMode(darkModeMediaQuery);
		darkModeMediaQuery.addEventListener('change', listener);
	});

	const updateDarkMode = (mediaQuery) => {
		if (darkMode === 'automatic') {
			if (mediaQuery.matches) {
				$settings.color_scheme = 'dark';
			} else {
				$settings.color_scheme = '';
			}
		}
	};

	onDestroy(() => {
		if (darkModeMediaQuery) {
			darkModeMediaQuery.removeEventListener('change', listener);
		}
	});
</script>

<div id="color_scheme_div" class={$settings.color_scheme}>
	<slot />
</div>
