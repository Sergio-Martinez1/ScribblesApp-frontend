<script lang="ts">
	import type { ActionData } from "./$types";
	import { enhance } from '$app/forms';
	export let form: ActionData;
	export let username: string = '';
</script>

<form
	class="px-8 py-9 flex flex-col items-start gap-y-4"
	action="?/changeUsername"
	method="POST"
	use:enhance
>
	<h1 class="text-white text-4xl font-bold">Change your username</h1>
	<label for="username">
		<h1 class="text-white font-bold">Username</h1>
		<input
			type="text"
			name="username"
			value={username}
			class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
			placeholder="username"
		/>
		{#if form?.usernameMissing}<p class="error text-white">Username can not be empty</p>{/if}
		{#if form?.usernameExists}<p class="error text-white">
				Username already exits, choose another
			</p>{/if}
	</label>
	<input
		type="password"
		name="password"
		class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
		placeholder="password"
	/>
	{#if form?.passwordMissing}<p class="error text-white">Password required</p>{/if}
	{#if form?.wrongPassword}<p class="error text-white">Invalid Password</p>{/if}

	<button class="bg-krispyPurple text-white rounded-xl w-32 h-10" type="submit">
		<span class="px-auto font-bold text-white">Save</span>
	</button>
</form>
