<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { ChangePassword, ChangeUsername, DeleteAccount, EditProfile } from '$components';
	import ChevronRight from '$components/Icon/ChevronRight.svelte';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import ArrowLeft from '$components/Icon/ArrowLeft.svelte';
	import { onMount } from 'svelte';
	import DarkModeSelector from '$components/DarkModeSelector.component.svelte';

	export let form: ActionData;
	export let data: PageData;

	let edit_profile_view = false;
	let screenWidth: number;
	let password_view: boolean = false;
	let username_view: boolean = false;
	let dark_mode_view: boolean = false;
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
		dark_mode_view = false;
		delete_account_view = false;
	}
</script>

<svelte:window
	bind:innerWidth={screenWidth}
	on:resize={windowChanged}
	bind:scrollY={screenScroll}
/>
<div
	class="col-span-4 flex flex-col items-center gap-y-4 bg-lavandaGray dark:bg-purpleGray p-6 rounded-2xl sm:my-8 h-fit mt-4 mb-28 sticky top-8"
>
	<h1 class="dark:text-white font-bold text-3xl">Settings</h1>
	<button
		class="{edit_profile_view
			? 'bg-krispyPurple text-white cursor-auto'
			: 'bg-lavandaLight dark:bg-purpleLight cursor-pointer hover:bg-hoverLavanda dark:hover:bg-hoverPurple active:bg-lavandaLight dark:active:bg-purpleLight'} border-b-krispyPurple min-w-full text-center rounded-2xl py-3"
		on:click={() => {
			open_view = true;
			edit_profile_view = true;
			username_view = false;
			password_view = false;
			dark_mode_view = false;
			delete_account_view = false;
		}}
	>
		<h1
			class="dark:text-white text-lg max-sm:flex max-sm:items-center max-sm:relative max-sm:h-[30px]"
		>
			<p class="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">Edit Profile</p>
			<div class="w-fit h-fit sm:hidden max-sm:absolute max-sm:right-5">
				<ChevronRight tailwindStrokeClass={'stroke-black dark:stroke-white'} />
			</div>
		</h1>
	</button>
	<button
		class="{username_view
			? 'bg-krispyPurple text-white cursor-auto'
			: 'bg-lavandaLight dark:bg-purpleLight cursor-pointer hover:bg-hoverLavanda dark:hover:bg-hoverPurple active:bg-lavandaLight dark:active:bg-purpleLight'} min-w-full text-center rounded-2xl py-3"
		on:click={() => {
			open_view = true;
			edit_profile_view = false;
			username_view = true;
			password_view = false;
			dark_mode_view = false;
			delete_account_view = false;
			screenScroll = 0;
		}}
	>
		<h1
			class="dark:text-white text-lg max-sm:flex max-sm:items-center max-sm:relative max-sm:h-[30px]"
		>
			<p class="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">
				Change your username
			</p>
			<div class="w-fit h-fit sm:hidden max-sm:absolute max-sm:right-5">
				<ChevronRight tailwindStrokeClass={'stroke-black dark:stroke-white'} />
			</div>
		</h1>
	</button>
	<button
		class="{password_view
			? 'bg-krispyPurple text-white cursor-auto'
			: 'bg-lavandaLight dark:bg-purpleLight cursor-pointer hover:bg-hoverLavanda dark:hover:bg-hoverPurple active:bg-lavandaLight dark:active:bg-purpleLight'} min-w-full text-center rounded-2xl py-3"
		on:click={() => {
			open_view = true;
			edit_profile_view = false;
			username_view = false;
			password_view = true;
			dark_mode_view = false;
			delete_account_view = false;
			screenScroll = 0;
		}}
	>
		<h1
			class="dark:text-white text-lg max-sm:flex max-sm:items-center max-sm:relative max-sm:h-[30px]"
		>
			<p class="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">
				Change your password
			</p>
			<div class="w-fit h-fit sm:hidden max-sm:absolute max-sm:right-5">
				<ChevronRight tailwindStrokeClass={'stroke-black dark:stroke-white'} />
			</div>
		</h1>
	</button>
	<button
		class="{dark_mode_view
			? 'bg-krispyPurple text-white cursor-auto'
			: 'bg-lavandaLight dark:bg-purpleLight cursor-pointer hover:bg-hoverLavanda dark:hover:bg-hoverPurple active:bg-lavandaLight dark:active:bg-purpleLight'} min-w-full text-center rounded-2xl py-3"
		on:click={() => {
			open_view = true;
			edit_profile_view = false;
			username_view = false;
			password_view = false;
			dark_mode_view = true;
			delete_account_view = false;
			screenScroll = 0;
		}}
	>
		<h1
			class="dark:text-white text-lg max-sm:flex max-sm:items-center max-sm:relative max-sm:h-[30px]"
		>
			<p class="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">Dark mode</p>
			<div class="w-fit h-fit sm:hidden max-sm:absolute max-sm:right-5">
				<ChevronRight tailwindStrokeClass={'stroke-black dark:stroke-white'} />
			</div>
		</h1>
	</button>
	<button
		class="{delete_account_view
			? 'bg-krispyPurple text-white cursor-auto'
			: 'bg-lavandaLight dark:bg-purpleLight cursor-pointer hover:bg-hoverLavanda dark:hover:bg-hoverPurple active:bg-lavandaLight dark:active:bg-purpleLight'} min-w-full text-center rounded-2xl py-3"
		on:click={() => {
			open_view = true;
			edit_profile_view = false;
			username_view = false;
			password_view = false;
			dark_mode_view = false;
			delete_account_view = true;
			screenScroll = 0;
		}}
	>
		<h1
			class="dark:text-white text-lg max-sm:flex max-sm:items-center max-sm:relative max-sm:h-[30px]"
		>
			<p class="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">Delete your account</p>
			<div class="w-fit h-fit sm:hidden max-sm:absolute max-sm:right-5">
				<ChevronRight tailwindStrokeClass={'stroke-black dark:stroke-white'} />
			</div>
		</h1>
	</button>
</div>
{#await data.streamed.myUser}
	<div>Loading...</div>
{:then user}
	{#if user?.status === 200 && user.data}
		{#if screenWidth < 640}
			{#if open_view}
				<div
					in:fly|global={{ x: window.innerWidth, easing: quintOut, opacity: 1 }}
					out:fly={{ x: window.innerWidth, easing: quintOut, opacity: 1 }}
					class="max-sm:absolute max-sm:w-full sm:inline-block sm:col-start-7 sm:col-span-6 px-5 py-4 min-h-screen max-sm:bg-lavandaDark dark:max-sm:bg-purpleGray"
				>
					<div
						class="flex flex-col items-center gap-y-4 bg-lavandaGray dark:bg-purpleGray rounded-2xl h-fit mb-24 p-3"
					>
						<button
							class="self-start active:bg-krispyPurple sm:hidden rounded-full"
							on:click={hideView}
							><ArrowLeft
								width={40}
								height={40}
								tailwindStrokeClass={'stroke-black dark:stroke-white'}
							/></button
						>
						{#if edit_profile_view}
							<EditProfile
								profile_photo={user.data.profile_photo}
								cover_photo={user.data.cover_photo}
								description={user.data.description}
								personal_url={user.data.personal_url}
								location={user.data.location}
								birthday={user.data.birthday}
							/>
						{:else if username_view}
							<ChangeUsername username={user.data.username} />
						{:else if password_view}
							<ChangePassword {form} />
						{:else if dark_mode_view}
							<label class="flex items-center relative w-max cursor-pointer select-none py-9">
								<span class="text-2xl font-bold mr-3 dark:text-white">Dark Theme</span>
								<input
									type="checkbox"
									class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500"
								/>
								<span class="absolute font-medium text-xs uppercase right-1 dark:text-white">
									OFF
								</span>
								<span class="absolute font-medium text-xs uppercase right-8 dark:text-white">
									ON
								</span>
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
				<div class="bg-lavandaGray dark:bg-purpleGray rounded-2xl h-fit p-6">
					{#if edit_profile_view}
						<EditProfile
							profile_photo={user.data.profile_photo}
							cover_photo={user.data.cover_photo}
							description={user.data.description}
							personal_url={user.data.personal_url}
							location={user.data.location}
							birthday={user.data.birthday}
						/>
					{:else if username_view}
						<ChangeUsername {form} username={user.data.username} />
					{:else if password_view}
						<ChangePassword {form} />
					{:else if dark_mode_view}
						<DarkModeSelector dark_mode={user.data.dark_mode} />
					{:else if delete_account_view}
						<DeleteAccount />
					{/if}
				</div>
			</div>
		{/if}
	{/if}
{/await}
