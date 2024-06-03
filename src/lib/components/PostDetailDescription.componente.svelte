<script lang="ts">
	import { User } from './Icon';
	import { calculate_posted_time } from '$lib/utils/calculate_posted_time';
	import PostOptions from './PostOptions.component.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { applyAction, enhance } from '$app/forms';
	import EditPost from './EditPost.componente.svelte';
	import type { ActionData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import session from '../../stores/session';
	import Button from './Button.component.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Post } from '$lib/types';

	export let form: ActionData;
	export let post_id: number = 0;
	export let post_creation_date: string | null = '2023-09-07T00:00:00+00:00';
	export let user_photo_url: string | null = null;
	export let user_name: string | null = 'person';
	export let tags: any[] | null = [];
	export let post_thumbnail_url: string | null = '';
	export let post_content: string | null =
		'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.';

	export let creator_id: number = -1;
	export let myUser_id: number = -1;
	export let delete_dialog_id: string = `delete-dialog-post-${post_id}`;
	export let edit_dialog_id: string = `edit-dialog-post-${post_id}`;
	export let dont_show_dialog_id: string = `not_show_dialog_${post_id}`;
	export let isLoading: boolean = false;
	let deleteButtonIsLoading: boolean = false;
  let dontShowButtonIsLoading: boolean = false;
	let error: boolean = false;
	let deletePostSubmitButton: any;
  let dontShowPostSubmitButton: any;

	function handleClose(id: string) {
		let element = document.getElementById(id) as HTMLDialogElement;
		element.close();
		deletePostSubmitButton.resetButtonState();
		dontShowPostSubmitButton.resetButtonState();
	}

	function handleUpdatePost(event: CustomEvent) {
    $session.home.posts = $session.home.posts.map((post: Post) => {
			if (post.id === event.detail.id) {
				return event.detail;
			}
			return post;
		});
		invalidateAll();
	}

	const submitDelete: SubmitFunction = () => {
		deleteButtonIsLoading = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				$session.home.posts = $session.home.posts.filter((post: Post) => post.id !== post_id);
				handleClose(delete_dialog_id);
				await applyAction(result);
				goto('/home');
			} else if (result.type === 'redirect') {
				await applyAction(result);
			} else {
				await applyAction(result);
				deleteButtonIsLoading = false;
				error = true;
			}
			deleteButtonIsLoading = false;
		};
	};

	const submitDontShowPost: SubmitFunction = () => {
		dontShowButtonIsLoading = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				$session.home.posts = $session.home.posts.filter((post: Post) => post.id !== post_id);
				handleClose(dont_show_dialog_id);
				await applyAction(result);
				goto('/home');
			} else if (result.type === 'redirect') {
				await applyAction(result);
			} else {
				await applyAction(result);
				dontShowButtonIsLoading = false;
				error = true;
			}
			dontShowButtonIsLoading = false;
		};
	};
</script>

<div class="w-full h-fit bottom-0 flex flex-col bg-lavandaGray dark:bg-purpleGray p-4">
	<div class="grid grid-cols-[64px_1fr_30px] gap-x-3 mb-2">
		<a
			href={creator_id === myUser_id ? '/profile' : `/profile/${creator_id}`}
			class="w-[55px] h-[55px]"
		>
			{#if isLoading}
				<div
					class="w-[55px] h-[55px] bg-lavandaLight dark:bg-purpleLight rounded-full animate-pulse"
				></div>
			{:else if user_photo_url}
				<img src={user_photo_url} alt="" class="w-full h-full object-cover rounded-full" />
			{:else}
				<User
					width={55}
					height={55}
					tailwindFillClass={'fill-lavandaLight dark:fill-purpleLight'}
					tailwindStrokeClass={'stroke-black dark:stroke-white'}
				/>
			{/if}
		</a>
		{#if isLoading}
			<div
				class="bg-lavandaLight dark:bg-purpleLight h-6 w-24 self-center rounded-full animate-pulse"
			></div>
		{:else}
			<p class="font-bold dark:text-white self-center">
				{user_name} · {calculate_posted_time(post_creation_date)}
			</p>
		{/if}
		<div class="self-center">
			{#if isLoading}
				<div
					class="bg-lavandaLight dark:bg-purpleLight h-6 w-[30px] rounded-full animate-pulse"
				></div>
			{:else}
				<PostOptions
					{creator_id}
					{myUser_id}
					{dont_show_dialog_id}
					{edit_dialog_id}
					{delete_dialog_id}
				/>
			{/if}
		</div>
	</div>
	{#if isLoading}
		<div class="bg-lavandaLight dark:bg-purpleLight h-20 w-full rounded-2xl animate-pulse"></div>
	{:else if post_content}
		<p class="overflow-hidden dark:text-white">{post_content}</p>
	{/if}
</div>

<dialog
	class="bg-lavandaGray dark:bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)]"
	id={delete_dialog_id}
>
	<form
		method="POST"
		action="/home?/deletePost"
		use:enhance={submitDelete}
		class="p-4 text-center overflow-hidden"
	>
		<input type="hidden" value={post_id} name="post_id" />
		<p class="dark:text-white font-bold mb-2 mx-auto w-fit text-lg">Delete post?</p>
		<p class="dark:text-white mb-3">This action will delete the post permanently.</p>
		<div class="flex gap-3 items-center justify-center">
			<button
				on:click={() => {
					handleClose(delete_dialog_id);
				}}
				type="button"
				value="cancel"
				formmethod="dialog"
				class="bg-squeezeRed hover:grayscale-[15%] text-white p-2.5 rounded-2xl w-28 h-10 flex items-center justify-center"
			>
				Cancel
			</button>

			<div class="my-2 self-center justify-self-center">
				<Button
					disabled={deleteButtonIsLoading}
					isLoading={deleteButtonIsLoading}
					bind:error
					text={'Confirm'}
					bind:this={deletePostSubmitButton}
				/>
			</div>
		</div>
	</form>
</dialog>
<dialog
	class="bg-lavandaGray dark:bg-purpleGray rounded-2xl w-[500px] shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)] p-0"
	id={edit_dialog_id}
>
	<EditPost
		on:updatepost={handleUpdatePost}
		{form}
		{user_photo_url}
		username={user_name ? user_name : ''}
		{post_id}
		innerText={post_content ? post_content : ''}
		imagePreview={post_thumbnail_url ? post_thumbnail_url : ''}
		tags={tags ? tags : []}
		dialog_id={edit_dialog_id}
	/>
</dialog>
<dialog
	class="bg-lavandaGray dark:bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)]"
	id={dont_show_dialog_id}
>
	<form method="POST" action="/home?/dontShowPost" use:enhance={submitDontShowPost} class="p-4">
		<input type="hidden" value={post_id} name="post_id" />
		<p class="dark:text-white font-bold mb-2 mx-auto w-fit text-lg">Wanna hide this post?</p>
		<p class="dark:text-white mb-3">This action will hide this post from your home page.</p>

		<div class="flex gap-3 items-center justify-center">
			<button
				on:click={() => {
					handleClose(delete_dialog_id);
				}}
				type="button"
				value="cancel"
				formmethod="dialog"
				class="bg-squeezeRed hover:grayscale-[15%] text-white p-2.5 rounded-2xl w-28 h-10 flex items-center justify-center"
			>
				Cancel
			</button>

			<div class="my-2 self-center justify-self-center">
				<Button
					disabled={dontShowButtonIsLoading}
					isLoading={dontShowButtonIsLoading}
					bind:error
					text={'Confirm'}
					bind:this={dontShowPostSubmitButton}
				/>
			</div>
		</div>
	</form>
</dialog>
