<script lang="ts">
	import type { ActionData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	export let form: ActionData;

	onDestroy(() => {
		applyAction({ type: 'success', status: 200 });
	});
</script>

<section class="flex flex-col gap-y-4">
	<h1 class="dark:text-white text-4xl font-bold">Change your password</h1>
	<form
		class="flex flex-col items-center gap-y-4"
		action="?/changePassword"
		method="POST"
		use:enhance
	>
		<input
			type="password"
			name="password"
			class="bg-lavandaLight dark:bg-purpleLight rounded-2xl h-9 dark:text-white mr-2 px-2 w-52"
			placeholder="Current password"
		/>
		{#if form?.passwordMissing}
			<p in:fly={{ y: 10 }} class="error text-squeezeRed">Password required</p>
		{/if}
		{#if form?.incorrectPassword}
			<p in:fly={{ y: 10 }} class="error text-squeezeRed">Incorrect password</p>
		{/if}
		<input
			type="password"
			name="new_password"
			class="bg-lavandaLight dark:bg-purpleLight rounded-2xl h-9 dark:text-white mr-2 px-2 w-52"
			placeholder="New password"
		/>
		{#if form?.newPasswordMissing}
			<p in:fly={{ y: 10 }} class="error text-squeezeRed">New password required</p>
		{/if}
		<input
			type="password"
			name="confirm"
			class="bg-lavandaLight dark:bg-purpleLight rounded-2xl h-9 dark:text-white mr-2 px-2 w-52"
			placeholder="Confirm new password"
		/>
		{#if form?.confirmMissing}
			<p in:fly={{ y: 10 }} class="error text-squeezeRed">Please confirm your new password</p>
		{/if}
		{#if form?.passwordConfirm}
			<p in:fly={{ y: 10 }} class="error text-squeezeRed">Password doesn't match</p>
		{/if}

		<button class="bg-krispyPurple dark:text-white rounded-xl w-32 h-10" type="submit">
			<span class="px-auto font-bold text-white">Save</span>
		</button>
	</form>
</section>
