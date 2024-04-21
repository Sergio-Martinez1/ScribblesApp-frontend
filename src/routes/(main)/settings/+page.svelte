<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { ChangePassword, ChangeUsername, DeleteAccount, EditProfile } from '$components';
	import ChevronRight from '$components/Icon/ChevronRight.svelte';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import ArrowLeft from '$components/Icon/ArrowLeft.svelte';
	import { onMount } from 'svelte';

	export let form: ActionData;
	export let data: PageData;

	let edit_profile_view = false;
	let screenWidth: number;
	let password_view: boolean = false;
	let username_view: boolean = false;
	let toggle_theme_view: boolean = false;
	let delete_account_view: boolean = false;
	let open_view: boolean = false;
	let screenScroll: number = 0;

	onMount(() => {
		edit_profile_view = window.innerWidth < 640 ? false : true;
	});
  
	function windowChanged() {
		if (screenWidth >= 639) {
			if (open_view == false) {
				open_view = true;
				edit_profile_view = true;
			}
		}
	}

	function hideView() {
		open_view = false;
		edit_profile_view = false;
		password_view = false;
		username_view = false;
		toggle_theme_view = false;
		delete_account_view = false;
	}
</script>

<svelte:window
	bind:innerWidth={screenWidth}
	on:resize={windowChanged}
	bind:scrollY={screenScroll}
/>
<div
	class="col-span-4 flex flex-col items-center gap-y-4 bg-purpleGray p-6 rounded-2xl sm:my-8 h-fit mt-4 mb-28 sticky top-8"
>
	<h1 class="text-white font-bold text-3xl">Settings</h1>
	<button
		class="{edit_profile_view
			? 'bg-krispyPurple cursor-auto'
			: 'bg-purpleLight cursor-pointer hover:bg-hoverPurple active:bg-purpleLight'} border-b-krispyPurple min-w-full text-center rounded-2xl py-3"
		on:click={() => {
			open_view = true;
			edit_profile_view = true;
			username_view = false;
			password_view = false;
			toggle_theme_view = false;
			delete_account_view = false;
		}}
	>
		<h1 class="text-white text-lg max-sm:flex max-sm:items-center max-sm:relative max-sm:h-[30px]">
			<p class="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">Edit Profile</p>
			<div class="w-fit h-fit sm:hidden max-sm:absolute max-sm:right-5"><ChevronRight /></div>
		</h1>
	</button>
	<button
		class="{username_view
			? 'bg-krispyPurple cursor-auto'
			: 'bg-purpleLight cursor-pointer hover:bg-hoverPurple active:bg-purpleLight'} min-w-full text-center rounded-2xl py-3"
		on:click={() => {
			open_view = true;
			edit_profile_view = false;
			username_view = true;
			password_view = false;
			toggle_theme_view = false;
			delete_account_view = false;
      screenScroll = 0;
		}}
	>
		<h1 class="text-white text-lg max-sm:flex max-sm:items-center max-sm:relative max-sm:h-[30px]">
			<p class="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">
				Change your username
			</p>
			<div class="w-fit h-fit sm:hidden max-sm:absolute max-sm:right-5"><ChevronRight /></div>
		</h1>
	</button>
	<button
		class="{password_view
			? 'bg-krispyPurple cursor-auto'
			: 'bg-purpleLight cursor-pointer hover:bg-hoverPurple active:bg-purpleLight'} min-w-full text-center rounded-2xl py-3"
		on:click={() => {
			open_view = true;
			edit_profile_view = false;
			username_view = false;
			password_view = true;
			toggle_theme_view = false;
			delete_account_view = false;
      screenScroll = 0;
		}}
	>
		<h1 class="text-white text-lg max-sm:flex max-sm:items-center max-sm:relative max-sm:h-[30px]">
			<p class="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">
				Change your password
			</p>
			<div class="w-fit h-fit sm:hidden max-sm:absolute max-sm:right-5"><ChevronRight /></div>
		</h1>
	</button>
	<button
		class="{toggle_theme_view
			? 'bg-krispyPurple cursor-auto'
			: 'bg-purpleLight cursor-pointer hover:bg-hoverPurple active:bg-purpleLight'} min-w-full text-center rounded-2xl py-3"
		on:click={() => {
			open_view = true;
			edit_profile_view = false;
			username_view = false;
			password_view = false;
			toggle_theme_view = true;
			delete_account_view = false;
      screenScroll = 0;
		}}
	>
		<h1 class="text-white text-lg max-sm:flex max-sm:items-center max-sm:relative max-sm:h-[30px]">
			<p class="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">Toggle theme</p>
			<div class="w-fit h-fit sm:hidden max-sm:absolute max-sm:right-5"><ChevronRight /></div>
		</h1>
	</button>
	<button
		class="{delete_account_view
			? 'bg-krispyPurple cursor-auto'
			: 'bg-purpleLight cursor-pointer hover:bg-hoverPurple active:bg-purpleLight'} min-w-full text-center rounded-2xl py-3"
		on:click={() => {
			open_view = true;
			edit_profile_view = false;
			username_view = false;
			password_view = false;
			toggle_theme_view = false;
			delete_account_view = true;
      screenScroll = 0;
		}}
	>
		<h1 class="text-white text-lg max-sm:flex max-sm:items-center max-sm:relative max-sm:h-[30px]">
			<p class="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">Delete your account</p>
			<div class="w-fit h-fit sm:hidden max-sm:absolute max-sm:right-5"><ChevronRight /></div>
		</h1>
	</button>
</div>
{#await data.streamed?.user}
	<div>Loading...</div>
{:then user}
	{#if screenWidth < 640}
		{#if open_view}
			<div
				in:fly={{ x: window.innerWidth, easing: quintOut, opacity: 1 }}
				out:fly|local={{ x: window.innerWidth, easing: quintOut, opacity: 1 }}
				class="max-sm:absolute max-sm:w-full sm:inline-block sm:col-start-7 sm:col-span-6 px-5 py-4 min-h-screen max-sm:bg-purpleDark"
			>
				<div class="flex flex-col items-center gap-y-4 bg-purpleGray rounded-2xl h-fit mb-24 p-3">
					<button
						class="self-start active:bg-krispyPurple sm:hidden rounded-full"
						on:click={hideView}><ArrowLeft width={40} height={40} /></button
					>
					{#if edit_profile_view}
						<EditProfile
							profile_photo={user.profile_photo}
							cover_photo={user.cover_photo}
							description={user.description}
							personal_url={user.personal_url}
							location={user.location}
							birthday={user.birthday}
						/>
					{:else if username_view}
						<ChangeUsername {form} username={user.username} />
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
					{:else if delete_account_view}
						<DeleteAccount />
					{/if}
				</div>
			</div>
		{/if}
	{:else}
		<div class="inline-block col-start-7 col-span-6 min-h-screen pt-8 pb-16">
			<div class="bg-purpleGray rounded-2xl h-fit">
				{#if edit_profile_view}
					<EditProfile
						profile_photo={user.profile_photo}
						cover_photo={user.cover_photo}
						description={user.description}
						personal_url={user.personal_url}
						location={user.location}
						birthday={user.birthday}
					/>
				{:else if username_view}
					<ChangeUsername {form} username={user.username} />
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
				{:else if delete_account_view}
					<DeleteAccount />
				{/if}
			</div>
		</div>
	{/if}
{/await}
