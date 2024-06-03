<script lang="ts">
	import type { LayoutData } from './$types';
	import NavBar from '$components/NavBar.component.svelte';

	export let data: LayoutData;
	$: myUser = data.plainMyUser;
	$: isLogin = myUser ? true : false;
</script>

<div class="bg-lavandaDark dark:bg-purpleDark min-h-screen">
	<div
		class="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-12 px-[20px] md:px-[20px] lg:px-[40px] sm:gap-[20px] max-w-7xl mx-auto min-h-screen"
	>
		<div class="hidden sm:inline-block sm:col-span-2 top-[40px] sm:sticky h-fit pb-5">
			<NavBar login={isLogin} />
		</div>
		<slot><!-- optional fallback --></slot>
	</div>
</div>
<div class="bottom-0 fixed w-full sm:hidden">
	<NavBar login={isLogin} />
</div>
