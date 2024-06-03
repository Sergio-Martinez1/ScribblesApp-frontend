<script lang="ts">
	import UserIcon from '$lib/components/Icon/User.svelte';
	import Reactions from '$lib/components/Reactions.component.svelte';
	import PostOptions from '$lib/components/PostOptions.component.svelte';
	import { calculate_posted_time } from '$lib/utils/calculate_posted_time';
	import { applyAction, enhance } from '$app/forms';
	import EditPost from '$lib/components/EditPost.componente.svelte';
	import Image from './Icon/Image.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { ActionData } from './$types';
	import Button from './Button.component.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let form: ActionData;

	//POST
	export let user_photo_url: string | null = '';
	export let user_name: string = '';
	export let user_url: string = '#';
	export let post_url: string = '#';
	export let publication_date: string = '0d';
	export let post_content: string = '';
	export let post_thumbnail_url: string = '';
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
	let isLoading: boolean = false;
	let error: boolean = false;
  let dontShowPostSubmitButton: any;
  let deletePostSubmitButton: any;
	const dispatch = createEventDispatcher();

	function handleDeletePost(id: number) {
		dispatch('deletepost', {
			id
		});
	}

	function handleDontShowPost(id: number) {
		dispatch('dontshowpost', {
			id
		});
	}

	function handleClose(id: string) {
		let element = document.getElementById(id) as HTMLDialogElement;
		element.close();
    dontShowPostSubmitButton.resetButtonState();
    deletePostSubmitButton.resetButtonState();
	}

	function isValidImageUrl(url: string) {
		return url.startsWith('http://') || url.startsWith('https://') || url === '';
	}

	const submitDelete: SubmitFunction = () => {
		isLoading = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				handleDeletePost(post_id);
				handleClose(delete_dialog_id);
				await applyAction(result);
			} else if (result.type === 'redirect') {
				await applyAction(result);
			} else {
				await applyAction(result);
				isLoading = false;
				error = true;
			}
			isLoading = false;
		};
	};

	const submitDontShowPost: SubmitFunction = () => {
		isLoading = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				handleDontShowPost(post_id);
				handleClose(dont_show_dialog_id);
				await applyAction(result);
			} else if (result.type === 'redirect') {
				await applyAction(result);
			} else {
				await applyAction(result);
				isLoading = false;
				error = true;
			}
			isLoading = false;
		};
	};
</script>

<div class="bg-lavandaGray dark:bg-purpleGray rounded-2xl shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]">
	{#if loading}
		<div class="animate-pulse flex flex-col p-4">
			<div class="flex gap-4 mb-3">
				<div class="rounded-full bg-lavandaLight dark:bg-purpleLight h-[59px] w-[59px]" />
				<div class="flex-1">
					<div class="grid grid-cols-10 gap-4 h-[59px] items-center">
						<div class="h-6 bg-lavandaLight dark:bg-purpleLight rounded-xl col-span-4" />
					</div>
				</div>
			</div>
			<div class="w-full h-32 bg-lavandaLight dark:bg-purpleLight rounded-2xl" />
		</div>
	{:else}
		<div
			class="grid grid-cols-[58px_minmax(0,_1fr)_30px] sm:grid-cols-[58px_minmax(0,_1fr)_1fr_30px] px-5 pt-2.5 gap-x-3 items-center"
		>
			<a href={user_url} class="w-[59px] h-[59px] rounded-full overflow-hidden">
				{#if user_photo_url}
					<img
						class="w-[59px] h-[59px] object-cover bg-lavandaLight dark:bg-purpleLight"
						src={user_photo_url}
						alt="User"
					/>
				{:else}
					<UserIcon
						tailwindFillClass={'fill-lavandaLight dark:fill-purpleLight'}
						tailwindStrokeClass={'stroke-black dark:stroke-white'}
					/>
				{/if}
			</a>
			<div class="bg-lavandaLight dark:bg-purpleLight w-fit h-fit rounded-2xl">
				<p class="px-3 py-1 dark:text-white font-bold break-all">
					{user_name} · {calculate_posted_time(publication_date)}
				</p>
			</div>
			<div class="max-sm:hidden justify-self-end min-[950px]:mr-8">
				<Reactions
          {form}
					{like_on}
					{likes_count}
					{comments_count}
					{tags_count}
					{post_url}
					{vertical}
					{tags}
					{post_by_tags_url}
					{post_id}
          my_user_id={myUser_id}
				/>
			</div>
			<PostOptions
				{myUser_id}
				{creator_id}
				{delete_dialog_id}
				{edit_dialog_id}
				{dont_show_dialog_id}
			/>
		</div>
		<div class="flex px-5 py-2.5">
			<a
				href={post_url}
				class="bg-lavandaLight dark:bg-purpleLight w-full rounded-2xl p-3.5 dark:text-white cursor-pointer"
			>
				<p class="mb-2.5 whitespace-break-spaces">{post_content}</p>
				{#if isValidImageUrl(post_thumbnail_url)}
					{#if post_thumbnail_url.length > 0}
						<img
							class="rounded-2xl overflow-hidden max-h-96 mx-auto"
							src={post_thumbnail_url}
							alt="Content"
						/>
					{/if}
				{:else}
					<div class="bg-lavandaGray dark:bg-purpleGray rounded-2xl p-6 w-fit mx-auto">
						<div class="mx-auto w-fit mb-6">
							<Image width={60} height={60} />
						</div>
						<p class="font-bold dark:text-white">Image can't be loaded.</p>
					</div>
				{/if}
			</a>
		</div>
		<div class="w-full flex justify-center sm:hidden">
			<Reactions
        {form}
				{like_on}
				{likes_count}
				{comments_count}
				{tags_count}
				{post_url}
				{vertical}
				{tags}
				{post_by_tags_url}
				{post_id}
        my_user_id={myUser_id}
			/>
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
				<div class="flex items-center justify-center gap-3">
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
						<Button disabled={isLoading} {isLoading} bind:error text={'Confirm'} bind:this={deletePostSubmitButton} />
					</div>
				</div>
			</form>
		</dialog>
		<dialog
			class="bg-lavandaGray dark:bg-purpleGray rounded-2xl w-[500px] shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)] p-0"
			id={edit_dialog_id}
		>
			<EditPost
				on:updatepost
				{form}
				{user_photo_url}
				username={user_name}
				{post_id}
				innerText={post_content}
				imagePreview={post_thumbnail_url}
				{tags}
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
				<div class="flex items-center justify-center gap-3">
					<button
						on:click={() => {
							handleClose(dont_show_dialog_id);
						}}
						type="button"
						value="cancel"
						formmethod="dialog"
						class="bg-squeezeRed hover:grayscale-[15%] text-white p-2.5 rounded-2xl w-28 h-10 flex items-center justify-center"
					>
						Cancel
					</button>

					<div class="my-2 self-center justify-self-center">
						<Button disabled={isLoading} {isLoading} bind:error text={'Confirm'} bind:this={dontShowPostSubmitButton}
						 />
					</div>
				</div>
			</form>
		</dialog>
	{/if}
</div>
