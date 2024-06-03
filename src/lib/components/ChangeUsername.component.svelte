<script lang="ts">
	import type { ActionData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import Edit from './Icon/Edit.svelte';
	import { fade, fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import ButtonSmall from './ButtonSmall.component.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	onDestroy(() => {
		applyAction({ type: 'success', status: 200 });
	});

	export let form: ActionData;
	export let username: string;

	let submitButton: any;
	let isLoading: boolean = false;
	let error: boolean = false;
	let editable: boolean = false;
	let content: string | null = username;
	let input: HTMLInputElement;
	let hoverOnEditButton: boolean = false;
	$: validContent = username != content ? true : false;

	const submit: SubmitFunction = () => {
		isLoading = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				invalidateAll();
				await applyAction(result);
			} else if (result.type === 'redirect') {
				await applyAction(result);
			} else if (result.status === 500) {
				await applyAction(result);
				isLoading = false;
				error = true;
			} else {
				await applyAction(result);
			}
			isLoading = false;
		};
	};
</script>

<section class="flex flex-col gap-y-4">
	<h1 class="dark:text-white text-4xl font-bold">Change your username</h1>
	<form
		method="post"
		action="/settings?/changeUsername"
		use:enhance={submit}
		class="flex flex-col gap-y-4 items-center"
	>
		<div class="flex flex-col">
			<div class="flex items-center">
				<input
					bind:this={input}
					type="text"
					name="username"
					bind:value={content}
					class="bg-lavandaLight dark:bg-purpleLight rounded-2xl h-9 dark:text-white mr-2 px-2 disabled:opacity-50 w-52"
					placeholder="username"
					disabled
				/>
				{#if !editable}
					<button
						on:mouseenter={() => {
							hoverOnEditButton = true;
						}}
						on:mouseleave={() => {
							hoverOnEditButton = false;
						}}
						in:fade={{ duration: 200 }}
						on:click={() => {
							editable = true;
							input.disabled = false;
							input.focus();
							hoverOnEditButton = false;
						}}
						><Edit
							tailwindStrokeClass={hoverOnEditButton
								? 'stroke-black dark:stroke-white'
								: 'stroke-krispyPurple'}
						/></button
					>
				{/if}
			</div>
			{#if form?.usernameMissing}
				<p
					in:fly={{ y: 10 }}
					out:fly={{ y: -10, duration: 150 }}
					class="error text-squeezeRed justify-self-center self-center"
				>
					Username can not be empty
				</p>
			{/if}
			{#if form?.usernameExists}
				<p
					in:fly={{ y: 10 }}
					out:fly={{ y: -10, duration: 150 }}
					class="error text-squeezeRed justify-self-center self-center"
				>
					Username already exits
				</p>
			{/if}
		</div>
		{#if editable}
			<div class="flex flex-col">
				<input
					in:fly={{ y: -10, duration: 180 }}
					out:fly={{ y: -10, duration: 150 }}
					type="password"
					name="password"
					class="bg-lavandaLight dark:bg-purpleLight rounded-2xl h-9 dark:text-white mr-2 px-2 w-52"
					placeholder="password"
				/>
				{#if form?.passwordMissing}
					<p
						in:fly={{ y: 10 }}
						out:fly={{ y: -10, duration: 150 }}
						class="error text-squeezeRed justify-self-center self-center"
					>
						Password required
					</p>
				{/if}
				{#if form?.wrongPassword}
					<p
						in:fly={{ y: 10 }}
						out:fly={{ y: -10, duration: 150 }}
						class="error text-squeezeRed justify-self-center self-center"
					>
						Invalid password
					</p>
				{/if}
			</div>
			<div class="flex">
				<button
					in:fly={{ y: -10, duration: 500 }}
					out:fly={{ y: -10, duration: 150 }}
					type="button"
					class="text-white bg-squeezeRed hover:bg-red-400 active:bg-squeezeRed w-20 h-8 rounded-full py-1.5 px-1.5 mr-2 flex items-center justify-center"
					on:click={async () => {
						await applyAction({ type: 'success', status: 200 });
						editable = false;
						input.disabled = true;
						content = username;
						submitButton.resetButtonState();
					}}
				>
					Cancel
				</button>

				<div
					in:fly|global={{ x: -10, duration: 180 }}
					out:fly={{ y: -10, duration: 150 }}
					class="col-start-2 self-center justify-self-center"
				>
					<ButtonSmall
						disabled={!validContent || isLoading}
						{isLoading}
						bind:error
						bind:this={submitButton}
						text={'Save'}
					/>
				</div>
			</div>
		{/if}
	</form>
</section>
