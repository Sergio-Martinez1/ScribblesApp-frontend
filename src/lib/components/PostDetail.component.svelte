<script lang="ts">
	import { enhance } from '$app/forms';
	import { base } from '$app/paths';
	import Image from './Icon/Image.svelte';
	import X from './Icon/X.svelte';
	import settings from '../../stores/postDetail';
	import { afterNavigate } from '$app/navigation';

  afterNavigate(({from})=>{
    $settings.previousPage = from?.url.toString() || "";
  })

	let previous_page: string = base;

	//POST
	export let post_thumbnail_url: string = '#';
	export let loading: boolean = false;

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
		<div
			class="grid grid-cols-[58px_minmax(0,_1fr)_1fr_30px] sm:grid-cols-[76px_minmax(0,_1fr)_1fr_30px] gap-x-3 items-center relative"
		>
			{#if $settings.previousPage.length}
				<a
					href={$settings.previousPage}
					class="absolute top-4 left-4 bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple rounded-full w-9 h-9 flex items-center justify-center"
					><X /></a
				>
			{/if}
		</div>
		<div class="flex">
			<div class="w-full text-white">
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
