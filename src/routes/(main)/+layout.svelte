<script lang="ts">
	import type { LayoutData } from './$types';
	import NavBar from '$components/NavBar.component.svelte';

	export let data: LayoutData;
  $: myUser = data.plainMyUser;
	$: isLogin = myUser ? true : false;
</script>

<div class="bg-purpleDark min-h-screen">
	<div class="grid grid-cols-12 px-[40px] gap-[20px] max-w-7xl mx-auto">
		<div class="col-span-2 mt-8 relative">
			<div class="fixed w-[174px]">
				<NavBar login={isLogin} />
			</div>
		</div>
		<slot><!-- optional fallback --></slot>
	</div>
</div>
