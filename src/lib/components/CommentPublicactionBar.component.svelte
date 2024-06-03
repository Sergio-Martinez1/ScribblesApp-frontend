<script lang="ts">
	import User from '$lib/components/Icon/User.svelte';
	import TextAreaAutosize from '$lib/components/TextAreaAutosize.svelte';
	import Send from '$lib/components/Icon/Send.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import ButtonComment from './ButtonComment.component.svelte';
	import session from '../../stores/session';
	import type { Post } from '$lib/types';

	export let my_user_photo: string = '';
	export let post_id: number = 0;
	export let maxContent: number = 300;
	export let isLoading: boolean = false;
	let buttonLoading: boolean = false;
	let error: boolean = false;
	let outputText: string = '';
	let innerText: string = '';
	let showPlaceHolder: boolean = true;
	let focus: boolean = false;
	let focus_text: boolean = false;
	let submitButton: any;

	$: validContent = outputText.trim() && outputText.length <= maxContent ? true : false;

	const submit: SubmitFunction = () => {
		buttonLoading = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				submitButton.resetButtonState();
				innerText = '';
				showPlaceHolder = true;
				await applyAction(result);
				invalidateAll();
				//se altera la referencia
				$session.home.posts.map((post: Post) => {
					if (post.id === post_id && post.num_comments >= 0) {
						post.num_comments++;
					}
				});
				// handleAddPost(form.createdPost);
				// handleClose();
			} else if (result.type === 'redirect') {
				await applyAction(result);
				// handleClose();
			} else {
				await applyAction(result);
				error = true;
			}
			buttonLoading = false;
		};
	};
</script>

<section class="grid grid-cols-[50px_1fr] gap-x-[17px] items-center">
	{#if isLoading}
		<div class="w-[50px] h-[50px] col-start-1 animate-pulse">
			<div class="w-full h-full object-cover rounded-full bg-lavandaLight dark:bg-purpleLight" />
		</div>
	{:else if my_user_photo}
		<div class="w-[50px] h-[50px] col-start-1">
			<img class="w-full h-full object-cover rounded-full" src={my_user_photo} alt="User face" />
		</div>
	{:else}
		<div class="w-[50px] h-[50px] col-start-1">
			<User
				width={50}
				height={50}
				tailwindFillClass={'fill-lavandaLight dark:fill-purpleLight'}
				tailwindStrokeClass={'stroke-black dark:stroke-white'}
			/>
		</div>
	{/if}
	<form
		class="bg-lavandaLight dark:bg-purpleLight rounded-2xl p-3 w-full flex gap-x-1.5 col-start-2 border {focus_text
			? 'border-krispyPurple'
			: 'border-transparent'}"
		method="POST"
		action="/post/[id]?/createComment"
		use:enhance={submit}
	>
		<div class="grow self-center">
			<TextAreaAutosize
				placeHolder="Write a comment..."
				bind:outputText
				bind:innerText
				bind:showPlaceHolder
				bind:focus
				bind:focus_text
			/>
		</div>
		<input type="hidden" value={outputText} name="content" />
		<input type="hidden" value={post_id} name="post_id" />

		<ButtonComment
			disabled={!validContent || buttonLoading}
			isLoading={buttonLoading}
			bind:error
			bind:this={submitButton}
		>
			<div class="pr-1.5">
				<Send />
			</div>
		</ButtonComment>
		<!-- <button -->
		<!-- 	disabled={!validContent} -->
		<!-- 	type="submit" -->
		<!-- 	class="bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple rounded-xl pr-1.5 w-fit h-fit self-end disabled:bg-lessLavanda dark:disabled:bg-lessPurple disabled:opacity-[0.5]" -->
		<!-- ></button> -->
	</form>
	{#if outputText.length > maxContent}
		<div in:fly={{ y: 10 }} out:fly={{ y: 10 }} class="text-squeezeRed col-start-2">
			Only up to {maxContent} chars
		</div>
	{/if}
</section>
