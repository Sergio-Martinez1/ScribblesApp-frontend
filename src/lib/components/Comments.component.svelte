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

	export let comments: any[] = [];
	export let my_user_photo: string = '';
	export let post_id: number = 0;
	export let maxContent: number = 300;
	export let my_user_id: number = 0;
	export let isLogin: boolean = false;
	export let loading: boolean = false;
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
			} else if (result.type === 'redirect') {
				await applyAction(result);
				innerText = '';
				showPlaceHolder = true;
			}
		};
	};
</script>

<div>
	{#if loading}
		{#each Array(6) as _}
			<div class="flex gap-4 mb-4">
				<div class="animate-pulse rounded-full bg-lavandaLight dark:bg-purpleLight h-[50px] min-w-[50px]" />
				<div class="animate-pulse w-full h-fit bg-lavandaGray dark:bg-purpleGray rounded-2xl p-3 gap-y-2 flex flex-col">
					<div class="h-3 bg-lavandaLight dark:bg-purpleLight rounded-xl block" />
					<div class="h-3 bg-lavandaLight dark:bg-purpleLight rounded-xl block" />
					<div class="h-3 bg-lavandaLight dark:bg-purpleLight rounded-xl block" />
				</div>
			</div>
		{/each}
	{:else}
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
				id="delete-dialog-comment-{comment.id}"
			>
				<form method="POST" action="/post/[id]?/deleteComment" use:enhance>
					<p class="dark:text-white font-bold mb-2 mx-auto w-fit text-lg">Delete comment?</p>
					<p class="dark:text-white mb-3">This action will delete the comment permanently.</p>
					<div class="flex gap-3">
						<button
							type="button"
							class="bg-lavandaLight dark:bg-purpleLight hover:bg-hoverPurple active:bg-purpleLight dark:text-white p-2.5 rounded-2xl w-full"
							on:click={() => {
								handleClose(comment.id);
							}}
						>
							Cancel
						</button>
						<button
							type="submit"
							class="bg-lavandaLight dark:bg-purpleLight hover:bg-squeezeRed dark:text-white p-2.5 rounded-2xl w-full"
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
	{/if}
</div>
