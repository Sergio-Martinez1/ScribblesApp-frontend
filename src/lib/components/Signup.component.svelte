<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	export let form: ActionData;
</script>

<div class="bg-krispyPurple m-auto border-solid border-2 rounded-3xl border-krispyPurple">
	<form class="px-8 py-9 flex flex-col items-start gap-y-2" action="?/signup" method="POST" use:enhance>
		<h1 class="text-black text-4xl font-bold">Create an account in<br /> Scribbles</h1>
		<div class="flex flex-col gap-y-4">
			<span class="text-black font-bold">Username</span>
			<input
				type="text"
				class="px-4 bg-black rounded-2xl h-9 text-white font-bold"
				name="username"
				value={form?.username ?? ''}
			/>
			{#if form?.usernameMissing}<p class="error text-white">Username required</p>{/if}
			<span class="text-black font-bold">E-mail</span>
			<input
				type="text"
				class="px-4 bg-black rounded-2xl h-9 text-white font-bold"
				name="email"
				value={form?.email ?? ''}
			/>
			{#if form?.emailMissing}<p class="error text-white">Email required</p>{/if}

			<span class="text-black font-bold">Password</span>
			<input
				type="password"
				class="px-4 bg-black rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
				name="password"
			/>
			{#if form?.passwordMissing}<p class="error text-white">Password required</p>{/if}
			<span class="text-black font-bold">Confirm password</span>
			<input
				type="password"
				class="px-4 bg-black rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
				name="confirm"
			/>
      {#if form?.passwordConfirmMissing}<p class="error text-white">Password confirmation required</p>{/if}
			{#if form?.passwordConfirm}<p class="error text-white">Passwords doesn't match</p>{/if}

			<span class="text-black font-bold">Avatar</span>
			<input
				type="file"
				class="px-4 bg-black rounded-2xl h-9 text-white font-bold
              file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-black file:text-krispyPurple
      hover:file:bg-purpleLight"
			/>
		</div>
		<div class="flex flex-row gap-x-2 items-start">
			<input type="checkbox" class="accent-black rounded cursor-pointer w-6 h-6" checked />
			<span class="text-black font-bold">Agree the terms of service</span>
		</div>
		{#if form?.termsMissing}<p class="error text-white">
				You need to accept the terms of service
			</p>{/if}
		<p class="error text-white">You need to accept the terms of service</p>
		<button class="bg-black text-black rounded-xl w-32 h-10" type="submit">
			<span class="px-auto font-bold text-krispyPurple">Create account</span>
		</button>
	</form>
</div>
