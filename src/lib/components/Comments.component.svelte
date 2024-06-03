<script lang="ts">
	import User from '$lib/components/Icon/User.svelte';
	import X from '$lib/components/Icon/X.svelte';
	import { calculate_posted_time } from '$lib/utils/calculate_posted_time';
	import { applyAction, enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import type { Comment, Post } from '$lib/types';
	import { invalidateAll } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Button from './Button.component.svelte';
	import session from '../../stores/session';

	export let comments: Array<Comment> | null = [];
	export let my_user_id: number = 0;
	export let isLoading: boolean = false;
	export let uniqueIdentifier: string = '';
	export let post_id: number = -1;
	let buttonLoading: boolean = false;
	let submitButton: any;
	let error: boolean = false;
	let commentId: number;

	function handleDialog(comment_id: Number) {
		let element = document.getElementById(
			`delete-dialog-comment-${comment_id}-${uniqueIdentifier}`
		) as HTMLDialogElement;
		element.showModal();
	}
	function handleClose(comment_id: Number) {
		let element = document.getElementById(
			`delete-dialog-comment-${comment_id}-${uniqueIdentifier}`
		) as HTMLDialogElement;
		element.close();
		submitButton.resetButtonState();
	}

	const submit: SubmitFunction = () => {
		buttonLoading = true;

		return async ({ result }) => {
			if (result.type === 'success') {
				await applyAction(result);
        //se altera la referencia
				$session.home.posts.map((post: Post) => {
					if (post.id === post_id && post.num_comments) {
						post.num_comments--;
					}
					return post;
				});
				invalidateAll();
				// handleAddPost(form.createdPost);
				handleClose(commentId);
			} else if (result.type === 'redirect') {
				await applyAction(result);
				handleClose(commentId);
			} else {
				await applyAction(result);
				error = true;
			}
			buttonLoading = false;
		};
	};
</script>

<div class="flex flex-col gap-y-4 p-4">
	{#if isLoading}
		{#each Array(4) as _}
			<div class="flex gap-4 mb-4">
				<div
					class="animate-pulse rounded-full bg-lavandaGray dark:bg-purpleLight h-[50px] min-w-[50px]"
				/>
				<div
					class="animate-pulse w-full h-fit bg-lavandaGray dark:bg-purpleGray rounded-2xl p-3 gap-y-2 flex flex-col"
				>
					<div class="w-14 h-3 bg-lavandaLight dark:bg-purpleLight rounded-xl block" />
					<div class="h-3 bg-lavandaLight dark:bg-purpleLight rounded-xl block" />
					<div class="h-3 bg-lavandaLight dark:bg-purpleLight rounded-xl block" />
				</div>
			</div>
		{/each}
	{:else if comments}
		<!-- COMMENTS -->
		{#each comments as comment}
			<div in:fly={{ y: 10 }} class="grid grid-cols-[50px_1fr] gap-x-[17px] w-full">
				{#if comment.user.profile_photo}
					<div class="w-[50px] h-[50px] col-start-1">
						<img
							class="w-full h-full object-cover rounded-full"
							src={comment.user.profile_photo}
							alt="User face"
						/>
					</div>
				{:else}
					<div class="w-[50px] h-[50px] col-start-1">
						<User width={50} height={50} />
					</div>
				{/if}
				<div class="bg-lavandaLight dark:bg-purpleLight rounded-2xl p-3 col-start-2 relative">
					{#if comment.user.id === my_user_id}
						<button
							on:click={() => {
								handleDialog(comment.id);
							}}
							class="bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple rounded-bl-xl rounded-tr-xl absolute right-0 top-0 w-[27px] h-[27px] flex items-center justify-center"
							><X width={20} height={20} /></button
						>
					{/if}
					<p class="dark:text-white font-bold mb-2">
						{comment.user.username} · {calculate_posted_time(comment.creation_date)}
					</p>
					<p class="dark:text-white break-words w-full">
						{comment.content}
					</p>
				</div>
			</div>
			<dialog
				class="bg-lavandaGray dark:bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)]"
				id="delete-dialog-comment-{comment.id}-{uniqueIdentifier}"
			>
				<form
					method="POST"
					action="/post/[id]?/deleteComment"
					use:enhance={submit}
					class="p-5 text-center overflow-hidden"
				>
					<p class="dark:text-white font-bold mb-2 mx-auto w-fit text-lg">Delete comment?</p>
					<p class="dark:text-white mb-3">This action will delete the comment permanently.</p>
					<div class="flex gap-3 justify-center items-center">
						<button
							on:click={() => {
								handleClose(comment.id);
							}}
							type="button"
							value="cancel"
							formmethod="dialog"
							class="bg-squeezeRed hover:grayscale-[15%] text-white p-2.5 rounded-2xl w-28 h-10 flex items-center justify-center"
						>
							Cancel
						</button>

						<Button
							disabled={buttonLoading}
							isLoading={buttonLoading}
							bind:error
							text={'Delete'}
							bind:this={submitButton}
							on:click={() => {
								commentId = comment.id;
							}}
						/>
						<input type="hidden" value={comment.id} name="comment_id" />
					</div>
				</form>
			</dialog>
		{/each}
	{:else}
		<div class="flex gap-4 mb-4 w-full justify-center items-center">
			<div class="w-80 h-fit rounded-2xl p-3 gap-y-2 flex flex-col justify-center items-center">
				<span class="opacity-40 font-bold dark:text-white">No comments to see...</span>
			</div>
		</div>
	{/if}
</div>
