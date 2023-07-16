<script lang="ts">
	import User from '$lib/components/Icon/User.svelte';
	import Camera from '$lib/components/Icon/Camera.svelte';
	export let username: string = '';
	export let profilePhoto: string = '';
	export let editable: boolean = false;
	export let loading: boolean = false;
</script>

{#if loading}
	<div class="w-[174px] h-[174px] mb-2.5 relative bg-purpleDark box-content p-3 rounded-full">
		<div class="animate-pulse duration-200 rounded-full bg-purpleLight w-[174px] h-[174px]" />
	</div>
	<div class="animate-pulse flex mx-auto w-fit h-fit">
		<div class="h-6 w-36 bg-purpleLight rounded-2xl" />
	</div>
{:else if profilePhoto}
	<div class="w-[174px] h-[174px] mb-2.5 relative bg-purpleDark box-content p-3 rounded-full">
		<img class="w-full h-full object-cover rounded-full" src={profilePhoto} alt="User face" />
		{#if editable}
			<button
				class="bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-full flex items-center justify-center p-2 absolute bottom-2 right-2"
				><div class="w-[24px] h-[24px]"><Camera /></div></button
			>
		{/if}
	</div>
	<p class="text-white font-bold w-fit mx-auto text-xl">{username}</p>
{:else}
	<div class="w-[174px] h-[174px] mb-2.5 relative bg-purpleDark box-content p-3 rounded-full">
		<User width={174} height={174} />
		{#if editable}
			<button
				class="bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-full flex items-center justify-center p-2 absolute bottom-2 right-2"
				><div class="w-[24px] h-[24px]"><Camera /></div></button
			>
		{/if}
	</div>
	<p class="text-white font-bold w-fit mx-auto text-xl">{username}</p>
{/if}
