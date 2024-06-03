<script lang="ts">
	import Image from './Icon/Image.svelte';
	export let isLoading: boolean = false;
	export let post_thumbnail_url: string | null =
		'https://st2.depositphotos.com/2001755/6222/i/450/depositphotos_62222509-stock-photo-beautiful-landscape.jpg';

	function isValidImageUrl(url: string | null) {
		if (url) {
			return url.startsWith('http://') || url.startsWith('https://');
		}
		return false;
	}
</script>

<div class="{post_thumbnail_url ? '' : 'hidden'} bg-black flex items-center justify-center h-full w-full">
	{#if isLoading}
		<div class="loader my-8"></div>
	{:else if isValidImageUrl(post_thumbnail_url)}
		<img class="object-contain max-sm:max-h-96 md:h-full max-sm:max-w-[90%]" src={post_thumbnail_url} alt="Content" />
	{:else}
		<div class="w-fit py-8">
			<div class="mx-auto w-fit mb-4">
				<Image width={60} height={60} />
			</div>
			<p class="font-bold text-white">Image can't be loaded.</p>
		</div>
	{/if}
</div>

<style lang="postcss">
	/* HTML: <div class="loader"></div> */
	.loader {
    @apply bg-krispyPurple;
		width: 50px;
		padding: 8px;
		aspect-ratio: 1;
		border-radius: 50%;
		--_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
		-webkit-mask: var(--_m);
		mask: var(--_m);
		-webkit-mask-composite: source-out;
		mask-composite: subtract;
		animation: l3 1s infinite linear;
	}
	@keyframes l3 {
		to {
			transform: rotate(1turn);
		}
	}
</style>
