<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import '../app.css';
	import settings from '../stores/settings';
	import { env } from '$env/dynamic/public';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	let errorOnUpdateColorScheme: boolean = false;

	$: $settings.dark_mode =
		data.plainMyUser && data.plainMyUser.dark_mode ? data.plainMyUser.dark_mode : 'enabled';
	$: color_scheme =
		data.plainMyUser && data.plainMyUser.color_scheme ? data.plainMyUser.color_scheme : 'dark';
	$: {
		switch (color_scheme) {
			case 'dark':
				$settings.color_scheme = 'dark';
				break;
			case 'light':
				$settings.color_scheme = '';
				break;
		}
	}

	let darkModeMediaQuery: MediaQueryList;
	let listener: (event: MediaQueryListEvent) => any;

	onMount(() => {
		darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		listener = () => updateDarkMode(darkModeMediaQuery);
		updateDarkMode(darkModeMediaQuery);
		darkModeMediaQuery.addEventListener('change', listener);
	});

	const updateDarkMode = (mediaQuery: MediaQueryList) => {
		if ($settings.dark_mode === 'automatic') {
			let formData = new FormData();
			formData.append('dark_mode', 'automatic');
			if (mediaQuery.matches) {
				$settings.color_scheme = 'dark';
				formData.append('color_scheme', 'dark');
			} else {
				$settings.color_scheme = '';
				formData.append('color_scheme', 'light');
			}
			fetch(`${env.PUBLIC_SERVER_API_URL}/api/updateUser`, {
				method: 'put',
				body: formData
			}).catch(() => {
				errorOnUpdateColorScheme = true;
			});
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
