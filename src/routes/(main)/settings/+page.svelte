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

	let screenWidth: number;
	let open_view: boolean = false;
	let viewSelector = -1;
	let screenScroll: number = 0;
	let sectionsNames: Array<string> = [
		'Edit profile',
		'Change your username',
		'Change your password',
		'Dark mode',
		'Delete your account'
	];

	onMount(() => {
		viewSelector = window.innerWidth < 768 ? -1 : 0;
	});

	function windowChanged() {
		if (screenWidth >= 767) {
			if (open_view == false) {
				open_view = true;
				viewSelector = 0;
			}
		}
	}

	function openView(i: number) {
		open_view = true;
		viewSelector = i;
		scrollTo(0, 0);
	}

	function hideView() {
		open_view = false;
		viewSelector = -1;
	}
</script>

<svelte:window
	bind:innerWidth={screenWidth}
	on:resize={windowChanged}
	bind:scrollY={screenScroll}
/>
<div
	class="{open_view ? 'hidden md:flex' : ''} col-span-7 md:col-span-4 flex flex-col items-center gap-y-4 bg-lavandaGray dark:bg-purpleGray p-6 rounded-2xl sm:my-8 h-fit mt-4 mb-28 sticky top-8 shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]"
>
	<h1 class="dark:text-white font-bold text-3xl">Settings</h1>
	{#each sectionsNames as sectionName, i}
		<button
			class="{viewSelector == i
				? 'bg-krispyPurple text-white cursor-auto'
				: 'bg-lavandaLight dark:bg-purpleLight cursor-pointer hover:bg-hoverLavanda dark:hover:bg-hoverPurple active:bg-lavandaLight dark:active:bg-purpleLight'} border-b-krispyPurple min-w-full text-center rounded-2xl py-3"
			on:click={() => {
				openView(i);
			}}
		>
			<h1
				class="dark:text-white text-lg max-sm:flex max-sm:items-center max-sm:relative max-sm:h-[30px]"
			>
				<p class="max-sm:absolute max-sm:left-[50%] max-sm:translate-x-[-50%]">{sectionName}</p>
				<div class="w-fit h-fit sm:hidden max-sm:absolute max-sm:right-5">
					<ChevronRight tailwindStrokeClass={'stroke-black dark:stroke-white'} />
				</div>
			</h1>
		</button>
	{/each}
</div>

{#await data.streamed.myUser then user}
	{#if user?.status === 200 && user.data}
		<div
			class="absolute md:relative md:col-span-6 top-0 left-0 w-full min-h-screen px-5 pt-5 md:px-0 sm:pb-5 bg-lavandaDark dark:bg-purpleDark max-md:{open_view
				? ''
				: 'hidden'} "
		>
			<div
				class="bg-lavandaGray dark:bg-purpleGray rounded-2xl h-fit p-6 flex flex-col gap-y-4 md:inline-block overflow-hidden w-full mb-24 shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]"
			>
				<button class="self-start active:bg-krispyPurple rounded-full md:hidden" on:click={hideView}
					><ArrowLeft
						width={40}
						height={40}
						tailwindStrokeClass={'stroke-black dark:stroke-white'}
					/></button
				>
				{#if viewSelector == 0}
					<EditProfile
						profile_photo={user.data.profile_photo}
						cover_photo={user.data.cover_photo}
						description={user.data.description}
						personal_url={user.data.personal_url}
						location={user.data.location}
						birthday={user.data.birthday}
					/>
				{:else if viewSelector == 1}
					<ChangeUsername username={user.data.username} {form} />
				{:else if viewSelector == 2}
					<ChangePassword {form} />
				{:else if viewSelector == 3}
					<DarkModeSelector dark_mode={user.data.dark_mode} />
				{:else if viewSelector == 4}
					<DeleteAccount />
				{/if}
			</div>
		</div>
	{/if}
{/await}
