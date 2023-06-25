<script lang="ts">
	import Image from '$lib/components/Icon/Image.svelte';
	export let coverPhotoUrl: string =
		'https://images.unsplash.com/photo-1483884105135-c06ea81a7a80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y292ZXIlMjBnaXJsfGVufDB8fDB8fHww&w=1000&q=80';
</script>

<div class="w-full h-[283px] relative">
	{#if coverPhotoUrl}
		<img class="w-full h-full rounded-2xl object-cover" src={coverPhotoUrl} alt="User cover" />
	{:else}
		<div class="w-full h-full rounded-2xl bg-purpleGray" />
	{/if}
	<button
		class="bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-full flex items-center justify-center px-4 py-2 absolute bottom-5 right-5 gap-3"
	>
		<div class="w-[20px] h-[20px]"><Image stroke="#ffffff" /></div>
		<p class="text-white font-bold">Edit cover photo</p></button
	>
</div>
