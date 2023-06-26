<script lang="ts">
	import User from '$lib/components/Icon/User.svelte';
	import Settings from '$lib/components/Icon/Settings.svelte';
	import LogOut from '$lib/components/Icon/LogOut.svelte';
	import Logo from '$lib/components/Icon/Logo.svelte';
  import LogIn from '$lib/components/Icon/LogIn.svelte';
	import { page } from '$app/stores';

  export let login: boolean = false;
  export let home_url: string = "/home";
  export let profile_url: string = "/profile";
  export let settings_url: string = "/settings";
  export let login_url: string = "/login";
</script>

<nav
	class="group bg-purpleGray p-3 rounded-2xl w-[97px] transition-[width] lg:hover:w-full overflow-hidden"
>
	<ul>
		<li>
			<a class:active={$page.url.pathname === home_url} href={home_url} title="Home"
				><div class="w-[70px]"><Logo fill="#36254B" /></div>
				<span class="opacity-0 lg:group-hover:opacity-100">Home</span></a
			>
		</li>
    {#if login}
      <li>
        <a class:active={$page.url.pathname === profile_url} href={profile_url} title="Profile"
          ><div class="w-[59px]"><User /></div>
          <span class="opacity-0 lg:group-hover:opacity-100">Profile</span></a
        >
      </li>
    {/if}
		<li>
			<a class:active={$page.url.pathname === settings_url} href={settings_url} title="Settings"
				><div class="w-[59px]"><Settings /></div>
				<span class="opacity-0 lg:group-hover:opacity-100">Settings</span></a
			>
		</li>
    {#if login}
      <li>
        <!-- REVISAR LOGOUT CON FORMACTIONS -->
        <a class:active={$page.url.pathname === '/logout'} href="/logout" title="Log out"
          ><div class="w-[59px]"><LogOut /></div>
          <span class="opacity-0 lg:group-hover:opacity-100">Log Out</span></a
        >
      </li>
    {:else}
      <li>
        <a class:active={$page.url.pathname === login_url} href={login_url}
          ><div class="w-[59px]"><LogIn /></div>
          <span class="opacity-0 lg:group-hover:opacity-100">Log In</span></a
        >
      </li>
    {/if}
	</ul>
</nav>

<style lang="postcss">
	nav ul a {
		@apply flex items-center hover:bg-hoverPurple rounded-2xl;
	}
	nav ul li + li {
		@apply mt-3;
	}
	nav ul li + li a {
		@apply p-1.5;
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
