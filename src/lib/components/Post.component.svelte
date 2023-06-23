<script lang="ts">
	import UserIcon from '$lib/components/Icon/User.svelte';
	import Reactions from '$lib/components/Reactions.component.svelte';
	import PostOptions from '$lib/components/PostOptions.component.svelte';

	export let user_photo_url: string;
	export let user_name: string = 'user';
	export let user_url: string = '#';

	export let post_url: string = '#';
	export let posted_ago: string = '1d';
	export let post_content: string = '';
	export let post_thumbnail_url: string;

	// REACTIONS
	export let like_on: boolean = false;
	export let likes_count: number = 0;
	export let comments_count: number = 0;
	export let tags_count: number = 0;

	let editable: boolean;
</script>

<div class="bg-purpleGray rounded-2xl">
	<div class="flex items-center justify-between px-2.5 pt-2.5">
		<a href={user_url} class="w-[59px] h-[58px] rounded-full overflow-hidden">
			{#if user_photo_url}
				<img src={user_photo_url} alt="User" />
			{:else}
				<UserIcon />
			{/if}
		</a>
		<div class="bg-purpleLight h-fit rounded-2xl ml-2.5">
			<p class="px-3 py-1 text-white font-bold">{user_name} · {posted_ago}</p>
		</div>
		<div class="grow" />
		<div class="mr-3">
			<Reactions {like_on} {likes_count} {comments_count} {tags_count} {post_url} />
		</div>
		<div class="mr-7">
			<PostOptions bind:editable />
		</div>
	</div>
	<div class="flex px-5 py-2.5">
		<a href={post_url} class="bg-purpleLight w-full rounded-2xl p-3.5 text-white cursor-pointer">
			<p class="mb-2.5 break-all">{post_content}</p>
			{#if post_thumbnail_url}
				<img
					class="rounded-2xl overflow-hidden max-h-96 mx-auto"
					src={post_thumbnail_url}
					alt="Content"
				/>
			{/if}
		</a>
	</div>
  
	<dialog class="bg-purpleGray rounded-2xl shadow-[0px_0px_10px_1px_black]" id="delete-dialog">
		<form>
			<p class="text-white font-bold mb-2 mx-auto w-fit text-lg">Delete post?</p>
			<p class="text-white mb-3">This action will delete the post permanently.</p>
			<div class="flex gap-3">
				<button
					value="cancel"
					formmethod="dialog"
					class="bg-purpleLight hover:bg-hoverPurple text-white p-2.5 rounded-2xl w-full"
				>
					Cancel
				</button>
				<button
					type="submit"
					value="default"
					class="bg-purpleLight hover:bg-squeezeRed text-white p-2.5 rounded-2xl w-full"
				>
					Confirm
				</button>
			</div>
		</form>
	</dialog>
</div>
