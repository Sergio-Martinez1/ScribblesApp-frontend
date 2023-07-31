<script lang="ts">
	import UserIcon from '$lib/components/Icon/User.svelte';
	import Reactions from '$lib/components/Reactions.component.svelte';
	import PostOptions from '$lib/components/PostOptions.component.svelte';
	import { calculate_posted_time } from '$lib/utils/calculate_posted_time';
	import { enhance } from '$app/forms';
	import EditPost from '$lib/components/EditPost.componente.svelte';
	import Image from './Icon/Image.svelte';

	//POST
	export let user_photo_url: string = '#';
	export let user_name: string = '';
	export let user_url: string = '#';
	export let post_url: string = '#';
	export let publication_date: string = '0d';
	export let post_content: string = '';
	export let post_thumbnail_url: string = '#';
	export let post_id: number = 0;
	export let loading: boolean = false;

	// REACTIONS
	export let like_on: boolean = false;
	export let likes_count: number = 0;
	export let comments_count: number = 0;
	export let tags_count: number = 0;
	export let vertical: boolean = false;
	export let tags: string[] = [];
	export let post_by_tags_url: string = '/posts';

	//POST OPTIONS
	export let creator_id: number = 0;
	export let myUser_id: number = -1;
	let delete_dialog_id: string = `delete-dialog-post-${post_id}`;
	let edit_dialog_id: string = `edit-dialog-post-${post_id}`;
  let dont_show_dialog_id: string = `not_show_dialog_${post_id}`;

	function handleClose(id: string) {
		let element = document.getElementById(id) as HTMLDialogElement;
		element.close();
	}

	function isValidImageUrl(url: string) {
		return url.startsWith('http://') || url.startsWith('https://');
	}
</script>

<div class="bg-purpleGray rounded-2xl">
	{#if loading}
		<div class="animate-pulse flex flex-col p-4">
			<div class="flex gap-4 mb-3">
				<div class="rounded-full bg-purpleLight h-[59px] w-[59px]" />
				<div class="flex-1">
					<div class="grid grid-cols-10 gap-4 h-[59px] items-center">
						<div class="h-6 bg-purpleLight rounded-xl col-span-2" />
						<div class="h-6 bg-purpleLight rounded-xl col-span-1" />
					</div>
				</div>
			</div>
			<div class="w-full h-32 bg-purpleLight rounded-2xl" />
		</div>
	{:else}
		<div class="flex items-center justify-between px-2.5 pt-2.5">
			<a href={user_url} class="w-[59px] h-[58px] rounded-full overflow-hidden">
				{#if user_photo_url}
					<img class="w-full h-full object-cover" src={user_photo_url} alt="User" />
				{:else}
					<UserIcon />
				{/if}
			</a>
			<div class="bg-purpleLight h-fit rounded-2xl ml-2.5">
				<p class="px-3 py-1 text-white font-bold">
					{user_name} · {calculate_posted_time(publication_date)}
				</p>
			</div>
			<div class="grow" />
			<div class="mr-3">
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
			<div class="mr-7">
				<PostOptions {myUser_id} {creator_id} {delete_dialog_id} {edit_dialog_id} {dont_show_dialog_id} />
			</div>
		</div>
		<div class="flex px-5 py-2.5">
			<a href={post_url} class="bg-purpleLight w-full rounded-2xl p-3.5 text-white cursor-pointer">
				<p class="mb-2.5 whitespace-break-spaces">{post_content}</p>
				{#if isValidImageUrl(post_thumbnail_url)}
					<img
						class="rounded-2xl overflow-hidden max-h-96 mx-auto"
						src={post_thumbnail_url}
						alt="Content"
					/>
				{:else}
					<div class="bg-purpleGray rounded-2xl p-6 w-fit mx-auto">
						<div class="mx-auto w-fit mb-6">
							<Image width={60} height={60} />
						</div>
						<p class="font-bold text-white">Image can't be loaded.</p>
					</div>
				{/if}
			</a>
		</div>

		<dialog
			class="bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)]"
			id={delete_dialog_id}
		>
			<form method="POST" action="/home?/deletePost" use:enhance>
				<input type="hidden" value={post_id} name="post_id" />
				<p class="text-white font-bold mb-2 mx-auto w-fit text-lg">Delete post?</p>
				<p class="text-white mb-3">This action will delete the post permanently.</p>
				<div class="flex gap-3">
					<button
						on:click={() => {
							handleClose(delete_dialog_id);
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
							handleClose(delete_dialog_id);
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
		<dialog
			class="bg-purpleGray rounded-2xl w-[500px] shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)] p-0"
			id={edit_dialog_id}
		>
			<EditPost
				{user_photo_url}
				username={user_name}
				{post_id}
				innerText={post_content}
				imagePreview={post_thumbnail_url}
				{tags}
			/>
		</dialog>
    <dialog
			class="bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)]"
			id={dont_show_dialog_id}
    >
			<form method="POST" action="/home?/dontShowPost" use:enhance>
				<input type="hidden" value={post_id} name="post_id" />
				<p class="text-white font-bold mb-2 mx-auto w-fit text-lg">Wanna hide this post?</p>
				<p class="text-white mb-3">This action will hide this post from your home page.</p>
				<div class="flex gap-3">
					<button
						on:click={() => {
							handleClose(dont_show_dialog_id);
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
							handleClose(dont_show_dialog_id);
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
	{/if}
</div>
