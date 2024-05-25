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
</script>

<nav
	class="group bg-lavandaGray dark:bg-purpleGray p-3 sm:rounded-2xl w-full sm:w-[97px] lg:w-full transition-[width] overflow-hidden"
>
	<ul
		class="grid grid-flow-col sm:grid-flow-row max-sm:items-center h-fit max-sm:w-full sm:gap-y-2"
	>
		<li>
			<a class:active={$page.url.pathname === home_url} href={home_url} title="Home">
				<Logo
					fill="#36254B"
					tailwindFillClass={'fill-lavandaLight dark:fill-purpleLight'}
					tailwindStrokeClass={'stroke-black dark:stroke-white'}
				/>
				<span class="w-0">Home</span></a
			>
		</li>
		{#if login}
			<li>
				<a class:active={$page.url.pathname === profile_url} href={profile_url} title="Profile">
					<User
						tailwindFillClass={'fill-lavandaLight dark:fill-purpleLight'}
						tailwindStrokeClass={'stroke-black dark:stroke-white'}
					/>
					<span>Profile</span></a
				>
			</li>
			<li>
				<a class:active={$page.url.pathname === settings_url} href={settings_url} title="Settings">
					<Settings
						tailwindFillClass={'fill-lavandaLight dark:fill-purpleLight'}
						tailwindStrokeClass={'stroke-black dark:stroke-white'}
					/>
					<span>Settings</span></a
				>
			</li>
			<li>
				<a class:active={$page.url.pathname === logout_url} href={logout_url}>
					<LogOut
						tailwindFillClass={'fill-lavandaLight dark:fill-purpleLight'}
						tailwindStrokeClass={'stroke-black dark:stroke-white'}
					/>
					<span>Log Out</span></a
				>
			</li>
		{:else}
			<li>
				<a class:active={$page.url.pathname === login_url} href={login_url}>
					<LogIn
						tailwindFillClass={'fill-lavandaLight dark:fill-purpleLight'}
						tailwindStrokeClass={'stroke-black dark:stroke-white'}
					/>
					<span>Log In</span></a
				>
			</li>
		{/if}
	</ul>
</nav>

<style lang="postcss">
	nav ul a {
		@apply flex flex-col min-[1134px]:flex-row items-center hover:bg-hoverLavanda dark:hover:bg-hoverPurple rounded-2xl p-1.5;
	}
	nav ul li a span {
		@apply font-bold dark:text-white h-fit whitespace-nowrap transition-opacity duration-300;
		@apply hidden sm:inline-block opacity-0 lg:opacity-100 w-0 h-0 lg:w-fit lg:h-fit min-[1134px]:pl-3;
	}
	nav ul li a.active span {
		@apply text-krispyPurple;
	}
	nav ul li a.active :global(rect) {
		fill: #931df0;
	}
	nav ul li a.active :global(path) {
		stroke: white;
	}
	nav ul li a :global(svg) {
		@apply w-[45px] h-[45px] sm:w-[60px] sm:h-[60px];
	}
</style>
