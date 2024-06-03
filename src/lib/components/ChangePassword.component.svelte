<script lang="ts">
	import type { ActionData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	export let form: ActionData;
	import type { SubmitFunction } from '@sveltejs/kit';
	import Button from './Button.component.svelte';

	let isLoading: boolean = false;
	let error: boolean = false;

	onDestroy(() => {
		applyAction({ type: 'success', status: 200 });
	});

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
			} else if (result.type === 'failure') {
				await applyAction(result);
			}
			isLoading = false;
		};
	};
</script>

<section class="flex flex-col gap-y-4">
	<h1 class="dark:text-white text-4xl font-bold">Change your password</h1>
	<form
		class="flex flex-col items-center gap-y-4"
		action="?/changePassword"
		method="POST"
		use:enhance={submit}
	>
		<div class="flex flex-col">
			<input
				type="password"
				name="password"
				class="bg-lavandaLight dark:bg-purpleLight rounded-2xl h-9 dark:text-white mr-2 px-2 w-52"
				placeholder="Current password"
			/>
			{#if form?.passwordMissing}
				<p in:fly={{ y: 10 }} class="error text-squeezeRed justify-self-center self-center">
					Password required
				</p>
			{/if}
			{#if form?.incorrectPassword}
				<p in:fly={{ y: 10 }} class="error text-squeezeRed justify-self-center self-center">
					Incorrect password
				</p>
			{/if}
		</div>
		<div class="flex flex-col">
			<input
				type="password"
				name="new_password"
				class="bg-lavandaLight dark:bg-purpleLight rounded-2xl h-9 dark:text-white mr-2 px-2 w-52"
				placeholder="New password"
			/>
			{#if form?.newPasswordMissing}
				<p in:fly={{ y: 10 }} class="error text-squeezeRed justify-self-center self-center">
					New password required
				</p>
			{/if}
		</div>
		<div class="flex flex-col">
			<input
				type="password"
				name="confirm"
				class="bg-lavandaLight dark:bg-purpleLight rounded-2xl h-9 dark:text-white mr-2 px-2 w-52"
				placeholder="Confirm new password"
			/>
			{#if form?.confirmMissing}
				<p in:fly={{ y: 10 }} class="error text-squeezeRed justify-self-center self-center">
					Please confirm your new password
				</p>
			{/if}
			{#if form?.passwordConfirm}
				<p in:fly={{ y: 10 }} class="error text-squeezeRed justify-self-center self-center">
					Password doesn't match
				</p>
			{/if}
		</div>

		<Button disabled={isLoading} {isLoading} bind:error text={'Save'} />
	</form>
</section>
