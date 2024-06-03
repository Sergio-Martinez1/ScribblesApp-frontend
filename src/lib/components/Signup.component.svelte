<script lang="ts">
	import type { ActionData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import Button from './Button.component.svelte';
	import { invalidateAll } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let form: ActionData;
	let isLoading: boolean = false;
	let error: boolean = false;

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

<div class="bg-krispyPurple m-auto border-solid border-2 rounded-3xl border-krispyPurple">
	<form
		class="px-8 py-9 flex flex-col items-start gap-y-2"
		action="?/signup"
		method="POST"
		use:enhance={submit}
	>
		<h1 class="text-black text-4xl font-bold">Create an account in<br /> Scribbles</h1>
		<div class="flex flex-col gap-y-2">
			<div class="flex flex-col gap-y-1">
				<span class="text-black font-bold">Username</span>
				<input
					type="text"
					class="px-4 bg-black rounded-2xl h-9 text-white "
					name="username"
					value={form?.username ?? ''}
				/>
				{#if form?.usernameMissing}
					<p in:fly={{ y: 10 }} class="error text-squeezeRed">Username required</p>
				{/if}
				{#if form?.usernameExists}
					<p in:fly={{ y: 10 }} class="error text-squeezeRed">Username already exits</p>
				{/if}
			</div>
			<div class="flex flex-col gap-y-1">
				<span class="text-black font-bold">E-mail</span>
				<input
					type="text"
					class="px-4 bg-black rounded-2xl h-9 text-white "
					name="email"
					value={form?.email ?? ''}
				/>
				{#if form?.emailMissing}
					<p in:fly={{ y: 10 }} class="error text-squeezeRed">Email required</p>
				{/if}
				{#if form?.emailExists}
					<p in:fly={{ y: 10 }} class="error text-squeezeRed">This email is already in use</p>
				{/if}
			</div>
			<div class="flex flex-col gap-y-1">
				<span class="text-black font-bold">Password</span>
				<input
					type="password"
					class="px-4 bg-black rounded-2xl h-9 text-white focus:outline-krispyPurple"
					name="password"
				/>
				{#if form?.passwordMissing}
					<p in:fly={{ y: 10 }} class="error text-squeezeRed">Password required</p>
				{/if}
			</div>
			<div class="flex flex-col gap-y-1">
				<span class="text-black font-bold">Confirm password</span>
				<input
					type="password"
					class="px-4 bg-black rounded-2xl h-9 text-white focus:outline-krispyPurple"
					name="confirm"
				/>
				{#if form?.passwordConfirmMissing}
					<p in:fly={{ y: 10 }} class="error text-squeezeRed">Password confirmation required</p>
				{/if}
				{#if form?.passwordConfirm}
					<p in:fly={{ y: 10 }} class="error text-squeezeRed">Passwords doesn't match</p>
				{/if}
			</div>

			<div class="mt-2">
				<Button
					disabled={isLoading}
					{isLoading}
					bind:error
					text={'Create account'}
					buttonType={1}
				/>
			</div>
		</div>
		<!-- <div class="flex flex-row gap-x-2 items-start"> -->
		<!-- 	<input type="checkbox" class="accent-black rounded cursor-pointer w-6 h-6" checked /> -->
		<!-- 	<span class="text-black font-bold">Agree the terms of service</span> -->
		<!-- </div> -->
		<!-- {#if form?.termsMissing}<p class="error text-white"> -->
		<!-- 		You need to accept the terms of service -->
		<!-- 	</p>{/if} -->
		<!-- <p class="error text-white">You need to accept the terms of service</p> -->
	</form>
</div>
