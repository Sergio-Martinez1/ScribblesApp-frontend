<script lang="ts">
	import { enhance } from '$app/forms';
	import Image from './Icon/Image.svelte';
	import settings from '../../stores/settings';
	import { afterNavigate } from '$app/navigation';
	import User from './Icon/User.svelte';

	afterNavigate(({ from }) => {
		$settings.previousPage = from?.url.toString() || '';
	});

	//POST
	export let post_thumbnail_url: string | null = '';
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

	function isValidImageUrl(url: string | null) {
		if (url) {
			return url.startsWith('http://') || url.startsWith('https://');
		}
		return false;
	}
</script>

<div class="bg-lavandaGray dark:bg-purpleGray w-full h-full">
	{#if loading}
		<p>Loading...</p>
	{:else}
		<div class="relative bg-lavandaDark dark:bg-purpleDark">
			<div
				class="{post_thumbnail_url
					? ''
					: ''} w-full h-full dark:text-white flex items-center justify-center"
			>
				{#if isValidImageUrl(post_thumbnail_url)}
					<div class="w-full bg-black h-full flex items-center justify-center">
						<img class="object-contain" src={post_thumbnail_url} alt="Content" />
					</div>
				{:else}
					<div class="bg-lavandaGray dark:bg-purpleGray p-2 rounded-2xl w-fit mx-auto">
						<div class="mx-auto w-fit mb-4">
							<Image width={60} height={60} />
						</div>
						<p class="font-bold dark:text-white">Image can't be loaded.</p>
					</div>
				{/if}
			</div>
		</div>

		<dialog
			class="bg-lavandaGray dark:bg-purpleGray rounded-2xl shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)]"
			id={delete_dialog_id}
		>
			<form method="POST" action="/post/[id]?/deletePost" use:enhance>
				<input type="hidden" value={post_id} name="post_id" />
				<p class="dark:text-white font-bold mb-2 mx-auto w-fit text-lg">Delete post?</p>
				<p class="dark:text-white mb-3">This action will delete the post permanently.</p>
				<div class="flex gap-3">
					<button
						on:click={() => {
							handleClose();
						}}
						type="button"
						value="cancel"
						formmethod="dialog"
						class="bg-lavandaLight dark:bg-purpleLight hover:bg-hoverLavanda dark:hover:bg-hoverPurple dark:text-white p-2.5 rounded-2xl w-full"
					>
						Cancel
					</button>
					<button
						on:click={() => {
							handleClose();
						}}
						type="submit"
						value="default"
						class="bg-lavandaLight dark:bg-purpleLight hover:bg-squeezeRed dark:text-white p-2.5 rounded-2xl w-full"
					>
						Confirm
					</button>
				</div>
			</form>
		</dialog>
		<dialog
			class="bg-lavandaGray dark:bg-purpleGray rounded-2xl w-[500px] shadow-[0px_0px_0px_1000px_rgba(18,21,23,0.7)] p-0"
			id={edit_dialog_id}
		/>
	{/if}
</div>
