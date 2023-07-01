<script lang="ts">
	import type { ActionData, PageData } from './$types';
	export let form: ActionData;
	import { ChangePassword, ChangeUsername, 
    DeleteAccount, EditProfile } from '$components';
  let edit_profile_view = true;
	let password_view: boolean = false;
	let username_view: boolean = false;
	let toggle_theme_view: boolean = false;
  export let data: PageData;
  $: user = data.user;
  console.log(data.user);
</script>

<div class="col-span-5 flex flex-col items-center gap-y-4">
	<h1 class="text-white font-bold text-xl mt-3">Your Account {user.username}</h1>
	<button
		class="bg-purpleLight min-w-full text-center rounded-2xl py-3 hover:cursor-pointer"
		on:click={() => {
      edit_profile_view = true;
      username_view = false;
			password_view = false;
			toggle_theme_view = false;
		}}
	>
		<h1 class="text-white text-lg">Edit Profile</h1>
	</button>
	<button
		class="bg-purpleLight min-w-full text-center rounded-2xl py-3 hover:cursor-pointer"
		on:click={() => {
      edit_profile_view = false;
			username_view = true;
			password_view = false;
			toggle_theme_view = false;
		}}
	>
		<h1 class="text-white text-lg">Change your username</h1>
	</button>
	<button
		class="bg-purpleLight min-w-full text-center rounded-2xl py-3 hover:cursor-pointer"
		on:click={() => {
      edit_profile_view = false;
			username_view = false;
			password_view = true;
			toggle_theme_view = false;
		}}
	>
		<h1 class="text-white text-lg">Change your password</h1>
	</button>
	<button
		class="bg-purpleLight min-w-full text-center rounded-2xl py-3 hover:cursor-pointer"
		on:click={() => {
      edit_profile_view = false;
			username_view = false;
			password_view = false;
			toggle_theme_view = true;
		}}
	>
		<h1 class="text-white text-lg">Toggle theme</h1>
	</button>
	<button
		class="bg-purpleLight min-w-full text-center rounded-2xl py-3 cursor-pointer"
		on:click={() => {
			edit_profile_view = false;
			username_view = false;
			password_view = false;
			toggle_theme_view = false;
		}}
	>
		<h1 class="text-white text-lg">Delete your account</h1>
	</button>
</div>
<div class="col-span-5 flex flex-col items-center gap-y-4">
	{#if edit_profile_view}
    <EditProfile {form} {...user} />
	{:else if username_view}
		<ChangeUsername {form} username={user.username}/>
	{:else if password_view}
		<ChangePassword {form} />
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
		<DeleteAccount {form} />
	{/if}
</div>

<style lang="postcss">
	input:checked {
		background-color: #22c55e; /* bg-green-500 */
	}
	input:checked ~ span:last-child {
		--tw-translate-x: 1.75rem; /* translate-x-7 */
	}
</style>
