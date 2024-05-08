<script lang="ts">
	import { enhance } from '$app/forms';
	import Image from './Icon/Image.svelte';
	import X from './Icon/X.svelte';
	import settings from '../../stores/postDetail';
	import { afterNavigate, goto } from '$app/navigation';
	import Logo from './Icon/Logo.svelte';
	import { calculate_posted_time } from '$lib/utils/calculate_posted_time';
	import User from './Icon/User.svelte';

	afterNavigate(({ from }) => {
		$settings.previousPage = from?.url.toString() || '';
	});

	//POST
	export let post_thumbnail_url: string | null = '';
	export let post_content: string | null = '';
	export let user_photo_url: string | null = '';
	export let user_name: string = '';
	export let loading: boolean = false;
	export let post_creation_date: string = '';

	// REACTIONS
	export let post_id: number = 0;

	//POST OPTIONS
	let edit_dialog_id: string = `edit-dialog-post-${post_id}`;
	let delete_dialog_id: string = `delete-dialog-post-${post_id}`;

	function handleClose() {
		let element = document.getElementById(delete_dialog_id) as HTMLDialogElement;
		element.close();
	}

	function isValidImageUrl(url: string) {
		return url.startsWith('http://') || url.startsWith('https://');
	}

	const navigateTo = (url: string) => {
		goto('/home', { noScroll: true, invalidateAll: false });
	};
</script>

<div class="bg-purpleGray">
	{#if loading}
		<div class="animate-pulse flex flex-col px-4">
			<div class="flex gap-4 mb-3">
				<div class="rounded-full bg-purpleLight h-[76px] w-[76px]" />
				<div class="flex-1">
					<div class="grid grid-cols-10 gap-4 h-[76px] items-center">
						<div class="h-8 bg-purpleLight rounded-2xl col-span-2" />
						<div class="h-8 bg-purpleLight rounded-2xl col-span-1" />
					</div>
				</div>
			</div>
			<div class="w-full h-48 bg-purpleLight rounded-2xl" />
		</div>
	{:else}
		<div class="absolute top-0 left-0 flex py-4 items-center z-10">
			{#if $settings.previousPage.length}
				<button
					on:click={() => {
						navigateTo($settings.previousPage);
					}}
					class="bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-br-3xl rounded-tr-3xl w-12 h-12 flex items-center justify-center"
					><X width={30} height={30} /></button
				>
			{/if}
			<a href="/home" class="rounded-full ml-5"><Logo width={52} height={52} /></a>
		</div>
		<div class="flex h-screen relative">
			<div class="w-full h-full text-white flex items-center">
				{#if isValidImageUrl(post_thumbnail_url)}
					<div class="w-full bg-black h-screen flex items-center">
						<img class="object-contain w-full h-full" src={post_thumbnail_url} alt="Content" />
					</div>
				{:else}
					<div class="bg-purpleGray rounded-2xl p-6 w-fit mx-auto">
						<div class="mx-auto w-fit mb-6">
							<Image width={60} height={60} />
						</div>
						<p class="font-bold text-white">Image can't be loaded.</p>
					</div>
				{/if}
			</div>
			<div class="w-full h-fit absolute bottom-0 flex px-4 pt-5 pb-10">
				<div class="bg-black w-full absolute top-0 left-0 h-full opacity-80 z-0" />
				{#if user_photo_url}
					<div class="w-16 h-16 mr-4 z-10">
						<img src={user_photo_url} alt="" class="w-full h-full object-cover rounded-full" />
					</div>
				{:else}
					<div class="mr-4 z-10">
						<User width={64} height={64} />
					</div>
				{/if}
				<div class="z-10 text-white">
					<div>
						<p class="font-bold">{user_name} · {calculate_posted_time(post_creation_date)}</p>
					</div>
					<p>{post_content}</p>
				</div>
			</div>
		</div>

		<dialog
			class="bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)]"
			id={delete_dialog_id}
		>
			<form method="POST" action="/post/[id]?/deletePost" use:enhance>
				<input type="hidden" value={post_id} name="post_id" />
				<p class="text-white font-bold mb-2 mx-auto w-fit text-lg">Delete post?</p>
				<p class="text-white mb-3">This action will delete the post permanently.</p>
				<div class="flex gap-3">
					<button
						on:click={() => {
							handleClose();
						}}
						type="button"
						value="cancel"
						formmethod="dialog"
						class="bg-purpleLight hover:bg-hoverPurple text-white p-2.5 rounded-2xl w-full"
					>
						Cancel
					</button>
					<button
						on:click={() => {
							handleClose();
						}}
						type="submit"
						value="default"
						class="bg-purpleLight hover:bg-squeezeRed text-white p-2.5 rounded-2xl w-full"
					>
						Confirm
					</button>
				</div>
			</form>
		</dialog>
		<dialog
			class="bg-purpleGray rounded-2xl w-[500px] shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)] p-0"
			id={edit_dialog_id}
		/>
	{/if}
</div>
