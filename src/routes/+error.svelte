<script lang="ts">
	import type { LayoutData } from './$types';
	import NavBar from '$components/NavBar.component.svelte';
	import { page } from '$app/stores';

	export let data: LayoutData;
	$: myUser = data.plainMyUser;
	$: isLogin = myUser ? true : false;
</script>

<div class="bg-purpleDark min-h-screen relative">
	<div
		class="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-12 px-[20px] md:px-[20px] lg:px-[40px] sm:gap-[20px] max-w-7xl mx-auto relative min-h-screen"
	>
		<div class="hidden sm:flex sm:col-span-2 h-full justify-center items-center">
			<div>
				<NavBar login={isLogin} />
			</div>
		</div>
		<div class="col-span-7 md:col-span-10 text-white p-4 flex flex-col justify-center min-h-screen">
			<div class="flex flex-col items-center justify-center bg-purpleGray rounded-2xl p-20 pt-2">
				{#if $page.status === 404}
					<p id="oops" class="font-bold text-[100px] md:text-[200px]">Oops!</p>
					<p class="md:text-[35px] text-center">
						We can't seem to find the page you're looking for.
					</p>
					<p>Error code: {$page.status}</p>
				{:else}
					<p id="oops" class="font-bold text-[100px] md:text-[200px]">Oops!</p>
					<p class="md:text-[35px] text-center">
            Something wen't wrong.
					</p>
					<p>Error code: {$page.status}</p>
				{/if}
			</div>
		</div>
	</div>
</div>
<div class="bottom-0 fixed w-full sm:hidden">
	<NavBar login={isLogin} />
</div>
