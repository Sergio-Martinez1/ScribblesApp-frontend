<script lang="ts">
	import User from '$lib/components/Icon/User.svelte';
	import TextAreaAutosize from '$lib/components/TextAreaAutosize.svelte';
	import Send from '$lib/components/Icon/Send.svelte';
	import X from '$lib/components/Icon/X.svelte';

	import { calculate_posted_time } from '$lib/utils/calculate_posted_time';
	import { applyAction, enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';

	export let comments: any[];
	export let my_user_photo: string = '';
	export let post_id: number;
	export let maxContent: number = 300;
	export let my_user_id: number;
	let outputText: string = '';
  let innerText: string = '';
  let showPlaceHolder: boolean = true;

	$: validContent = outputText.trim() && outputText.length <= maxContent ? true : false;

	function handleDialog(comment_id: Number) {
		let element = document.getElementById(
			`delete-dialog-comment-${comment_id}`
		) as HTMLDialogElement;
		element.showModal();
	}
	function handleClose(comment_id: Number) {
		let element = document.getElementById(
			`delete-dialog-comment-${comment_id}`
		) as HTMLDialogElement;
		element.close();
	}

	const submit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll();
				await applyAction(result);
        innerText = '';
        showPlaceHolder = true;
			}
		};
	};
</script>

<div>
	<p class="text-white font-bold text-xl w-fit mx-auto mb-4">Comments</p>
	<!-- Post comment -->
	<div class="grid grid-cols-[50px_1fr] gap-x-[17px] mb-4 items-center">
		{#if my_user_photo}
			<div class="w-[50px] h-[50px] col-start-1">
				<img class="w-full h-full object-cover rounded-full" src={my_user_photo} alt="User face" />
			</div>
		{:else}
			<div class="w-[50px] h-[50px] col-start-1">
				<User width={50} height={50} />
			</div>
		{/if}
		<form
			class="bg-purpleLight rounded-2xl p-3 w-full flex gap-x-1.5 col-start-2"
			method="POST"
			action="?/createComment"
			use:enhance={submit}
		>
			<div class="grow self-center">
				<TextAreaAutosize placeHolder="Write a comment..." bind:outputText bind:innerText bind:showPlaceHolder/>
			</div>
			<input type="hidden" value={outputText} name="content" />
			<input type="hidden" value={post_id} name="post_id" />
			<button
				disabled={!validContent}
				type="submit"
				class="bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-xl pr-1.5 w-fit h-fit self-end disabled:bg-lessPurple disabled:opacity-[0.5]"
				><Send /></button
			>
		</form>
		{#if outputText.length > maxContent}
			<div in:fly|local={{ y: 10 }} out:fly|local={{ y: 10 }} class="text-squeezeRed col-start-2">
				Only up to {maxContent} chars
			</div>
		{/if}
	</div>
	<!-- COMMENTS -->
	{#each comments as comment}
		<div in:fly|local={{ y: 10 }} class="grid grid-cols-[50px_1fr] gap-x-[17px] mb-4 w-full">
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
			<div class="bg-purpleLight rounded-2xl p-3 col-start-2 relative">
				{#if comment.user.id === my_user_id}
					<button
						on:click={() => {
							handleDialog(comment.id);
						}}
						class="bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-full absolute right-2.5 top-2.5"
						><X width={20} height={20} /></button
					>
				{/if}
				<p class="text-white font-bold mb-2">
					{comment.user.username} · {calculate_posted_time(comment.creation_date)}
				</p>
				<p class="text-white break-words w-full">
					{comment.content}
				</p>
			</div>
		</div>
		<dialog
			class="bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)]"
			id="delete-dialog-comment-{comment.id}"
		>
			<form method="POST" action="?/deleteComment" use:enhance>
				<p class="text-white font-bold mb-2 mx-auto w-fit text-lg">Delete comment?</p>
				<p class="text-white mb-3">This action will delete the comment permanently.</p>
				<div class="flex gap-3">
					<button
						class="bg-purpleLight hover:bg-hoverPurple active:bg-purpleLight text-white p-2.5 rounded-2xl w-full"
						on:click={() => {
							handleClose(comment.id);
						}}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="bg-purpleLight hover:bg-squeezeRed text-white p-2.5 rounded-2xl w-full"
						on:click={() => {
							handleClose(comment.id);
						}}
					>
						Delete
					</button>
					<input type="hidden" value={comment.id} name="comment_id" />
				</div>
			</form>
		</dialog>
	{/each}
</div>
