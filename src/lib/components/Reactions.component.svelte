<script lang="ts">
	import Tag from '$lib/components/Icon/Tag.svelte';
	import Message from '$lib/components/Icon/Message.svelte';
	import Like from '$lib/components/Icon/Like.svelte';
	import { fly } from 'svelte/transition';
	import Tags from '$lib/components/Tags.component.svelte';
	import { clickOutside } from '$lib/utils/clickOutside';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';

	export let like_on: boolean = false;
	export let likes_count: number = 0;
	export let comments_count: number = 0;
	export let tags_count: number = 0;
	export let post_url: string = '#';
	export let vertical: boolean = false;
	export let tags: string[];
	export let post_by_tags_url: string = '/posts';
	export let post_id: number;

	let like_fill: string = like_on ? '#2C41FF' : 'none';
	let like_stroke: string = like_on ? '#2C41FF' : '#ffffff';
	let tag_toogle: boolean = false;

	function toggle_like() {
		like_on = !like_on;
		likes_count = like_on ? likes_count + 1 : likes_count - 1;
		like_fill = like_on ? '#2C41FF' : 'none';
		like_stroke = like_on ? '#2C41FF' : '#ffffff';
	}

	const notReload: SubmitFunction = () => {
		return async ({ result }) => {
			await applyAction(result);
		};
	};

	function handleClickOutside(event: CustomEvent) {
		tag_toogle = false;
	}
</script>

<div
	class="bg-purpleLight flex rounded-2xl px-2 relative {vertical
		? 'gap-2 py-1.5'
		: 'py-2'} w-full sm:w-fit justify-self-end max-sm:justify-around"
>
	<form method="POST" action="/home?/toogle_reaction" use:enhance={notReload}>
		<input type="hidden" value={post_id} name="post_id" />
		<input type="hidden" value={like_on} name="state_on" />
		<button
			on:click={toggle_like}
			class="like cursor-pointer flex {vertical ? 'flex-col items-center' : ''}"
		>
			<div class="w-[20px]">
				<Like fill={like_fill} stroke={like_stroke} />
			</div>
			<!-- Likes Count -->
			{#key likes_count}
				<p in:fly|local={{ y: 10 }} class:active={like_on}>{likes_count}</p>
			{/key}
		</button>
	</form>

	<!-- Comments -->
	<a href={post_url} class="message {vertical ? 'flex-col items-center' : ''}">
		<!-- Comments Icons -->
		<div class="w-[22px]">
			<Message />
		</div>
		<!-- Comments count -->
		{#key comments_count}
			<p in:fly|local={{ y: 10 }}>{comments_count}</p>
		{/key}
	</a>

	<!-- Tags -->
	<div
		class="tag cursor-pointer {vertical ? 'flex-col items-center' : ''}"
		on:click={() => {
			tag_toogle = !tag_toogle;
		}}
		on:keypress={() => {}}
		use:clickOutside={'.tags-component'}
		on:click_outside={handleClickOutside}
	>
		<!-- Tags icon -->
		<div class="w-[22px]">
			<Tag />
		</div>
		<!-- Tags count -->
		{#key tags_count}
			<p in:fly|local={{ y: 10 }}>{tags_count}</p>
		{/key}
	</div>

	<!-- TOGGLE TAG COMPONENT -->
	{#if tag_toogle}
		<div in:fly|local={{ y: 10 }} class="absolute max-sm:bottom-10 sm:top-9 right-2 z-10">
			<Tags {tags} posts_url={post_by_tags_url} />
		</div>
	{/if}
</div>

<style lang="postcss">
	div div,
	div a,
	div form {
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
