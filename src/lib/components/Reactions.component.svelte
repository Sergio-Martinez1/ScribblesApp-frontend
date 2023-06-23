<script lang="ts">
	import Tag from '$lib/components/Icon/Tag.svelte';
	import Message from '$lib/components/Icon/Message.svelte';
	import Like from '$lib/components/Icon/Like.svelte';
	import { fly } from 'svelte/transition';
	import Tags from '$lib/components/Tags.component.svelte';
	import { clickOutside } from '$lib/utils/clickOutside';

	export let like_on: boolean = false;
	export let likes_count: number = 0;
	export let comments_count: number = 0;
	export let tags_count: number = 0;
	export let post_url: string = '#';

	let like_fill: string = 'none';
	let like_stroke: string = '#ffffff';
	export let tag_toogle: boolean = false;

	function toggle_like() {
		like_on = !like_on;
		likes_count = like_on ? likes_count + 1 : likes_count - 1;
		// like_fill = like_on ? '#2C41FF' : 'none';
		like_stroke = like_on ? '#2C41FF' : '#ffffff';
	}

	function handleClickOutside(event: CustomEvent) {
		tag_toogle = false;
	}
</script>

<div class="bg-purpleLight flex rounded-2xl px-2 py-2 relative">
	<div on:keypress={() => {}} on:click={toggle_like} class="like cursor-pointer">
		<div class="w-[20px]">
			<Like fill={like_fill} stroke={like_stroke} />
		</div>
		{#key likes_count}
			<p in:fly|local={{ y: 10 }} class:active={like_on}>{likes_count}</p>
		{/key}
	</div>

	<a href={post_url} class="message">
		<div class="w-[22px]">
			<Message />
		</div>
		{#key comments_count}
			<p in:fly|local={{ y: 10 }}>{comments_count}</p>
		{/key}
	</a>

	<div
		class="tag cursor-pointer"
		on:click={() => {
			tag_toogle = !tag_toogle;
		}}
		on:keypress={() => {}}
		use:clickOutside={'.tags-component'}
		on:click_outside={handleClickOutside}
	>
		<div class="w-[22px]">
			<Tag />
		</div>
		{#key tags_count}
			<p in:fly|local={{ y: 10 }}>{tags_count}</p>
		{/key}
	</div>

	{#if tag_toogle}
		<div in:fly|local={{ y: 10 }} class="absolute top-9 right-2 z-10">
			<Tags />
		</div>
	{/if}
</div>

<style lang="postcss">
	div div,
	div a {
		@apply mx-1.5 flex;
	}
	p {
		@apply text-white h-fit;
	}
	p.active {
		@apply text-jacketBlue;
	}
	div div:last-child {
		@apply mb-0;
	}

	.like:hover :global(path) {
		stroke: #2c41ff;
	}
	.like:hover p {
		@apply text-jacketBlue;
	}
	.message:hover :global(path),
	.tag:hover :global(path) {
		@apply stroke-krispyPurple;
	}
	.message:hover p,
	.tag:hover p {
		@apply text-krispyPurple;
	}
</style>
