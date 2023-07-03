<script lang="ts">
	import TextAreaAutosize from '$lib/components/TextAreaAutosize.svelte';
	import User from '$lib/components/Icon/User.svelte';
	import Hash from '$lib/components/Icon/Hash.svelte';
	import Image from '$lib/components/Icon/Image.svelte';
	import X from '$lib/components/Icon/X.svelte';
	import CreateTags from '$lib/components/CreateTags.component.svelte';
	import { fly } from 'svelte/transition';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
  
	//RAW TEXT
	export let innerText: string = '';
	export let outputText: string = '';
	export let selectedImage: string = '';
	export let tags: string[] = [];
	export let post_id: number;
	let dialog_id: string = `edit-dialog-post-${post_id}`;

	//STYLES
	export let maxContent: number = 500;
	export let user_photo_url: string = '';
	export let username: string = '';
	let maxSize: string = selectedImage ? '' : '120px';

	//STATE
	let focus_text: boolean = false;
	let tags_toggle: boolean = false;
	let validContent: boolean = false;
  
	let showPlaceHolder: boolean =
		innerText.trim().length === 0 && (innerText.match(/\n|\s/g) || []).length === 1 ? true : false;

	//DOM
	let uploadFile: HTMLElement;



	$: validContent =
		(outputText.trim() || selectedImage) && outputText.length <= maxContent ? true : false;

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				maxSize = '';
				selectedImage = event.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function handleClose() {
		tags_toggle = false;
		let element = document.getElementById(dialog_id) as HTMLDialogElement;
		element.close();
	}

	const submit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await invalidateAll();
				await applyAction(result);
				handleClose();
			}
		};
	};
</script>

<form
	class="bg-purpleGray rounded-2xl p-2.5 h-fit relative max-h-[520px]"
	method="POST"
	action="/home?/editPost"
	use:enhance={submit}
>
	<!-- CLOSE BUTTON -->
	<button
		type="button"
		on:click={handleClose}
		class="absolute right-5 rounded-full bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple p-1"
		><X width={16} height={16} /></button
	>
	<p in:fly|local={{ y: -10 }} class="text-white font-bold text-lg mx-auto w-fit mb-2">Edit Post</p>
	<div class="items-center grid grid-rows-[40px_1fr_50px] gap-y-3 h-fit">
		<!-- USER ICON -->
		<div class="h-[40px] flex gap-x-3 items-center">
			<div class="w-[41px] h-[40px] rounded-full overflow-hidden">
				{#if user_photo_url}
					<img class="w-full h-full object-cover" src={user_photo_url} alt="User" />
				{:else}
					<User width={41} height={40} />
				{/if}
			</div>
			<p class="text-white">{username}</p>
		</div>
		<!-- TEXTAREA -->
		<div
			class="h-fit self-start bg-purpleLight rounded-2xl px-3 py-2 relative border {focus_text
				? 'border-krispyPurple'
				: 'border-transparent'} overflow-y-auto max-h-[280px]"
			tabindex="-1"
		>
			<div class="relative">
				{#if outputText.length > maxContent}
					<div
						in:fly|local={{ y: 10 }}
						out:fly|local={{ y: 10 }}
						class="text-squeezeRed absolute right-[-110px] bottom-0 z-10 w-[80px]"
					>
						Only up to {maxContent} chars
					</div>
				{/if}
				<TextAreaAutosize
					bind:focus_text
					bind:innerText
					bind:showPlaceHolder
					bind:outputText
					{maxSize}
				/>
				<!-- CONTENT INPUT -->
				<input type="hidden" name="post_id" bind:value={post_id} />
				<input type="hidden" name="content" bind:value={outputText} />
			</div>
			{#if selectedImage}
				<!-- IMAGE PREVIEW -->
				<div class="relative w-fit mx-auto">
					<button
						type="button"
						class="absolute top-2 right-2 bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple p-1 rounded-full"
						on:click={() => {
							selectedImage = '';
							maxSize = '120px';
						}}><X width={16} height={16} /></button
					>
					<img
						src={selectedImage}
						alt="Vista previa de la imagen"
						class="rounded-2xl mb-2 mt-5 max-h-96"
					/>
				</div>
			{/if}
		</div>
		<!-- IMAGE BUTTON -->
		<div class="h-[50px] flex items-center bg-purpleLight rounded-2xl px-3">
			<p class="text-white mr-3">Add to your post:</p>
			<button
				type="button"
				class="cursor-pointer p-2.5 rounded-3xl hover:bg-hoverPurple active:bg-transparent relative"
				on:click={() => {
					uploadFile.click();
				}}
			>
				<Image />
				<!-- IMAGE INPUT -->
				<input
					tabindex="-1"
					type="file"
					name="thumbnail"
					accept="image/*"
					class="w-0 h-0 t absolute"
					on:change={handleFileChange}
					bind:this={uploadFile}
				/>
			</button>
			<!-- TAG BUTTON -->
			<button
				type="button"
				tabindex="0"
				on:click={() => {
					tags_toggle = !tags_toggle;
				}}
				class="cursor-pointer p-2.5 rounded-3xl hover:bg-hoverPurple active:bg-transparent"
			>
				<Hash />
			</button>
		</div>
	</div>
	<div class="grid grid-cols-[1fr_112px] mr-[39px] items-center mb-2">
		<!-- TAGS INPUT -->
		<input type="hidden" name="tags" bind:value={tags} />
		{#if tags_toggle}
			<!-- TAG CREATION -->
			<div in:fly|local={{ y: -10 }} class="ml-3 mr-9 my-2">
				<CreateTags bind:tags maxSize="64px" />
			</div>
		{/if}
		<!-- POST BUTTON -->
		<button
			type="submit"
			disabled={!validContent}
			in:fly|local={{ y: -10 }}
			class="bg-krispyPurple active:bg-krispyPurple hover:bg-lessPurple text-white w-28 h-10 p-2.5 my-2 rounded-2xl flex items-center justify-center col-start-2 disabled:bg-lessPurple disabled:opacity-[0.5]"
			>Post</button
		>
	</div>
</form>
