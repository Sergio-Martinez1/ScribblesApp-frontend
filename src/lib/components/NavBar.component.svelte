<script lang="ts">
	import User from '$lib/components/Icon/User.svelte';
	import Settings from '$lib/components/Icon/Settings.svelte';
	import LogOut from '$lib/components/Icon/LogOut.svelte';
	import Logo from '$lib/components/Icon/Logo.svelte';
	import LogIn from '$lib/components/Icon/LogIn.svelte';
	import { page } from '$app/stores';

	export let login: boolean = false;
	export let home_url: string = '/home';
	export let profile_url: string = '/profile';
	export let settings_url: string = '/settings';
	export let login_url: string = '/login';
	export let logout_url: string = '/logout';
  let icon_size = 60;
</script>

<nav
	class="group bg-purpleGray p-3 sm:rounded-2xl w-full sm:w-[97px] lg:w-full transition-[width] overflow-hidden"
>
	<ul class="grid grid-flow-col sm:grid-flow-row max-sm:items-center h-fit max-sm:w-full sm:gap-y-2">
		<li>
			<a class:active={$page.url.pathname === home_url} href={home_url} title="Home"
				><div class="w-[{icon_size}px] sm:w-[70px]"><Logo fill="#36254B" width={icon_size} height={icon_size} /></div>
				<span class="hidden sm:inline-block opacity-0 lg:opacity-100">Home</span></a
			>
		</li>
		{#if login}
			<li>
				<a class:active={$page.url.pathname === profile_url} href={profile_url} title="Profile"
					><div class="w-[{icon_size}px] sm:w-[70px]"><User width={icon_size} height={icon_size} /></div>
					<span class="hidden sm:inline-block opacity-0 lg:opacity-100">Profile</span></a
				>
			</li>
		<li>
			<a class:active={$page.url.pathname === settings_url} href={settings_url} title="Settings"
				><div class="w-[{icon_size}px] sm:w-[70px]"><Settings width={icon_size} height={icon_size} /></div>
				<span class="hidden sm:inline-block opacity-0 lg:opacity-100">Settings</span></a
			>
		</li>
			<li>
				<a class:active={$page.url.pathname === logout_url} href={logout_url}
					><div class="w-[{icon_size}px] sm:w-[70px]"><LogOut width={icon_size} height={icon_size} /></div>
					<span class="hidden sm:inline-block opacity-0 lg:opacity-100">Log Out</span></a
				>
			</li>
		{:else}
			<li>
				<a class:active={$page.url.pathname === login_url} href={login_url}
					><div class="w-[{icon_size}px] sm:w-[70px]"><LogIn width={icon_size} height={icon_size} /></div>
					<span class="hidden sm:inline-block opacity-0 lg:opacity-100">Log In</span></a
				>
			</li>
		{/if}
	</ul>
</nav>

<style lang="postcss">
	nav ul a {
		@apply flex items-center hover:bg-hoverPurple rounded-2xl p-1.5;
	}
	nav ul li a span {
		@apply font-bold text-white h-fit ml-3 whitespace-nowrap transition-opacity duration-300;
	}
	nav ul li a.active span {
		@apply text-krispyPurple;
	}
	nav ul li a.active :global(rect) {
		fill: #931df0;
	}
</style>
