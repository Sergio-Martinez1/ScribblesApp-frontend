<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
	import { enhance } from '$app/forms';
	let password_view: boolean = true;
	let toggle_theme_view: boolean = false;
</script>

<div class="col-span-5 flex flex-col items-center gap-y-4">
	<h1 class="text-white font-bold text-xl mt-3">Your Account</h1>
	<div
		class="bg-purpleLight min-w-full text-center rounded-2xl py-3 hover:cursor-pointer"
		on:click={() => {
			password_view = true;
			toggle_theme_view = false;
		}}
	>
		<h1 class="text-white text-lg">Change your password</h1>
	</div>
	<div
		class="bg-purpleLight min-w-full text-center rounded-2xl py-3 hover:cursor-pointer"
		on:click={() => {
			password_view = false;
			toggle_theme_view = true;
		}}
	>
		<h1 class="text-white text-lg">Toggle theme</h1>
	</div>
	<div
		class="bg-purpleLight min-w-full text-center rounded-2xl py-3 cursor-pointer"
		on:click={() => {
			password_view = false;
			toggle_theme_view = false;
		}}
	>
		<h1 class="text-white text-lg">Delete your account</h1>
	</div>
</div>
<div class="col-span-5 flex flex-col items-center gap-y-4">
	{#if password_view}
		<form
			class="px-8 py-9 flex flex-col items-start gap-y-4"
			action="?/password"
			method="POST"
			use:enhance
		>
			<h1 class="text-white text-4xl font-bold">Change your password</h1>
			<input
				type="password"
				class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
				placeholder="Current password"
			/>
			{#if form?.passwordMissing}<p class="error text-white">Password required</p>{/if}
			<input
				type="password"
				class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
				placeholder="New password"
			/>
			{#if form?.passwordMissing}<p class="error text-white">Password required</p>{/if}
			<input
				type="password"
				class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
				placeholder="Confirm password"
			/>
			{#if form?.passwordConfirm}<p class="error text-white">Passwords doesn't match</p>{/if}
			<p class="error text-white">Passwords doesn't match</p>

			<button class="bg-krispyPurple text-white rounded-xl w-32 h-10" type="submit">
				<span class="px-auto font-bold text-white">Save</span>
			</button>
		</form>
	{:else if toggle_theme_view}
		<label class="flex items-center relative w-max cursor-pointer select-none py-9">
			<span class="text-2xl font-bold mr-3 text-white">Dark Theme</span>
			<input
				type="checkbox"
				class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500"
			/>
			<span class="absolute font-medium text-xs uppercase right-1 text-white"> OFF </span>
			<span class="absolute font-medium text-xs uppercase right-8 text-white"> ON </span>
			<span
				class="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200"
			/>
		</label>
	{:else}
		<form
			class="px-8 py-9 flex flex-col items-start gap-y-4"
			action="?/account"
			method="POST"
			use:enhance
		>
			<h1 class="text-white text-4xl font-bold">Delete Account</h1>

			<button class="bg-krispyPurple text-white rounded-xl w-32 h-10" type="submit">
				<span class="px-auto font-bold text-white">Delete</span>
			</button>
		</form>
	{/if}
</div>

<style lang="postcss">
	body {
		background-color: #171717; /* bg-true-gray-900 */
		color: white;
	}

	input:checked {
		background-color: #22c55e; /* bg-green-500 */
	}

	input:checked ~ span:last-child {
		--tw-translate-x: 1.75rem; /* translate-x-7 */
	}
</style>
