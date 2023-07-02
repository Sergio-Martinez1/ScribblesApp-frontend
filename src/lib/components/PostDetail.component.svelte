<script lang="ts">
	import UserIcon from '$lib/components/Icon/User.svelte';
	import Reactions from '$lib/components/Reactions.component.svelte';
	import PostOptions from '$lib/components/PostOptions.component.svelte';
	import { calculate_posted_time } from '$lib/utils/calculate_posted_time';
	import { enhance } from '$app/forms';

	//POST
	export let user_photo_url: string;
	export let user_name: string = 'user';
	export let user_url: string = '#';

	export let post_url: string = '#';
	export let publication_date: string = '1d';
	export let post_content: string = '';
	export let post_thumbnail_url: string;

	// REACTIONS
	let vertical: boolean = true;
	export let like_on: boolean = false;
	export let likes_count: number = 0;
	export let comments_count: number = 0;
	export let tags_count: number = 0;
	export let tags: string[] = [];
	export let post_by_tags_url: string = '/posts';
	export let post_id: number;

	//POST OPTIONS
	export let creator_id: number;
	export let myUser_id: number;
  let dialog_id: string = `delete-dialog-post-${post_id}`;

	function handleClose(post_id: Number) {
		let element = document.getElementById(dialog_id) as HTMLDialogElement;
		element.close();
	}
</script>

<div class="bg-purpleGray rounded-2xl py-5">
	<div class="flex items-center justify-between px-5">
		<!-- Userphoto -->
		<a href={user_url} class="w-[76px] h-[76px] rounded-full overflow-hidden">
			{#if user_photo_url}
				<img class="object-cover w-full h-full" src={user_photo_url} alt="User" />
			{:else}
				<UserIcon />
			{/if}
		</a>
		<!-- Username -->
		<div class=" h-fit ml-2.5">
			<p class="px-3 py-1 text-white font-bold text-lg">
				{user_name} · {calculate_posted_time(publication_date)}
			</p>
		</div>
		<div class="grow" />
		<!-- Reactions -->
		<div class="mr-3">
			<p class="text-white mx-auto w-fit text-sm mb-2">Post metadata</p>
			<Reactions
				{like_on}
				{likes_count}
				{comments_count}
				{tags_count}
				{post_url}
				{vertical}
				{tags}
				{post_by_tags_url}
				{post_id}
			/>
		</div>
		<!-- PostOptions -->
		<div class="mr-7">
			<PostOptions {myUser_id} {creator_id} {dialog_id}/>
		</div>
	</div>
	<div class="flex px-9 mt-3">
		<div class="w-full text-white">
			<!-- Post content -->
			<p class="mb-3 break-words">{post_content}</p>
			<!-- Post thumbnail -->
			{#if post_thumbnail_url}
				<img class="rounded-2xl overflow-hidden mx-auto" src={post_thumbnail_url} alt="Content" />
			{/if}
		</div>
	</div>

	<dialog
		class="bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)]"
		id={dialog_id}
	>
		<form method="POST" action="/post/[id]?/deletePost" use:enhance>
			<input type="hidden" value={post_id} name="post_id" />
			<p class="text-white font-bold mb-2 mx-auto w-fit text-lg">Delete post?</p>
			<p class="text-white mb-3">This action will delete the post permanently.</p>
			<div class="flex gap-3">
				<button
					on:click={() => {
						handleClose(post_id);
					}}
					type="button"
					value="cancel"
					formmethod="dialog"
					class="bg-purpleLight hover:bg-hoverPurple text-white p-2.5 rounded-2xl w-full"
				>
					Cancel
				</button>
				<button
					on:click={() => {
						handleClose(post_id);
					}}
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
