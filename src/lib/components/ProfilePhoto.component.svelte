<script lang="ts">
	import User from '$lib/components/Icon/User.svelte';
	import Camera from '$lib/components/Icon/Camera.svelte';
	export let username: string = '';
	export let profilePhoto: string = '';
	export let editable: boolean = false;
</script>

<div class="w-[174px] h-fit">
	<div class="w-[174px] h-[174px] mb-2.5 relative">
		{#if profilePhoto}
			<img class="w-full h-full object-cover rounded-full" src={profilePhoto} alt="User face" />
		{:else}
			<User width={174} height={174} />
		{/if}
		{#if editable}
			<button
				class="bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-full flex items-center justify-center p-2 absolute bottom-2 right-2"
				><div class="w-[24px] h-[24px]"><Camera /></div></button
			>
		{/if}
	</div>
	<p class="text-white font-bold w-fit mx-auto text-xl">{username}</p>
</div>
