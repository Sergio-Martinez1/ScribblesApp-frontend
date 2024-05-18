<script lang="ts">
	import type { ActionData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import type { ActionResult } from '@sveltejs/kit';

	export let form: ActionData;
	let isLoading = false;
	let focus = false;

	const submit = () => {
		isLoading = true;
		return ({ result }: { result: ActionResult }) => {
			isLoading = false;
			applyAction(result);
		};
	};
</script>

<div class="bg-black m-auto border-solid border-2 rounded-3xl border-black">
	<form
		class="px-8 py-9 flex flex-col items-start gap-y-4"
		action="?/login"
		method="POST"
		use:enhance={submit}
	>
		<h1 class="text-krispyPurple text-4xl font-bold">Log in with your <br /> account</h1>
		<div class="flex flex-col gap-y-4">
			<span class="text-krispyPurple font-bold">username</span>
			<input
				type="text"
				class="px-4 bg-krispyPurple rounded-2xl h-9 text-white font-bold border-none outline-none {focus
					? 'outline-2 outline-blue-500'
					: ''}"
				on:focus={() => {
					focus = true;
				}}
				on:focusout={() => {
					focus = false;
				}}
				name="username"
				value={form?.username ?? ''}
			/>
			{#if form?.usernameMissing}
				<p in:fly={{ y: 10 }} class="error text-squeezeRed">Username required</p>
			{/if}
			{#if form?.usernameDontExists}
				<p in:fly={{ y: 10 }} class="error text-squeezeRed">Username does not exists</p>
			{/if}
			<span class="text-krispyPurple font-bold">Password</span>
			<input
				type="password"
				class="px-4 bg-krispyPurple rounded-2xl h-9 text-white font-bold"
				name="password"
			/>
			{#if form?.passwordMissing}
				<p in:fly={{ y: 10 }} class="error text-squeezeRed">Password Missing</p>
			{/if}
			{#if form?.wrongPassword}
				<p in:fly={{ y: 10 }} class="error text-squeezeRed">Invalid Password</p>
			{/if}
		</div>
		<button class="bg-krispyPurple text-black rounded-xl w-32 h-10" type="submit">
			<span class="px-auto font-bold flex items-center justify-center">
				{#if isLoading}
					<div class="w-fit ml-3">
						<svg
							class="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					</div>
				{:else}
					Log in
				{/if}
			</span>
		</button>
		{#if form?.serverFail}
			<p in:fly={{ y: 10 }} class="error text-squeezeRed">An unexpected error has ocurred</p>
		{/if}
		<div class="flex flex-row gap-x-2 items-start">
			<input type="checkbox" class="accent-krispyPurple rounded cursor-pointer w-6 h-6" checked />
			<span class="text-krispyPurple font-bold">Remember me</span>
		</div>
		<a href="/recovery" class="text-krispyPurple underline">Forgot your password?</a>
	</form>
</div>

<style lang="postcss">
	input[type='checkbox']:not(:checked) {
		background-color: red;
	}
</style>
