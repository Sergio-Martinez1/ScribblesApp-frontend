<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	export let form: ActionData;
</script>

<form
	class="px-8 py-9 flex flex-col items-start gap-y-4"
	action="?/changePassword"
	method="POST"
	use:enhance
>
	<h1 class="text-white text-4xl font-bold">Change your password</h1>
	<input
		type="password"
    name="password"
		class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
		placeholder="Current password"
	/>
	{#if form?.passwordMissing}<p class="error text-white">Password required</p>{/if}
	<input
		type="password"
    name="new_password"
		class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
		placeholder="New password"
	/>
	{#if form?.newPasswordMissing}<p class="error text-white">New password required</p>{/if}
	<input
		type="password"
    name="confirm"
		class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
		placeholder="Confirm password"
	/>
	{#if form?.confirmMissing}<p class="error text-white">Password confirm required</p>{/if}
	{#if form?.passwordConfirm}<p class="error text-white">Passwords doesn't match</p>{/if}

	<button class="bg-krispyPurple text-white rounded-xl w-32 h-10" type="submit">
		<span class="px-auto font-bold text-white">Save</span>
	</button>
</form>
