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

	//STYLES
	export let maxContent: number = 500;
  export let user_url: string = '';
  export let user_photo_url: string = '';

	//STATE
	let focus: boolean = false;
	let focus_text: boolean = false;
	let tags_toggle: boolean = false;
	let showPlaceHolder: boolean = true;
	let validContent: boolean = false;

	//DOM
	let uploadFile: HTMLElement;

	//RAW TEXT
	let innerText: string = '';

	//TEXT TO API
	let outputText: string = '';
	let selectedImage: string | undefined;
	let tags: string[] = [];

	$: validContent =
		(outputText.trim() || selectedImage) && outputText.length <= maxContent ? true : false;

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				selectedImage = event.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function handleClose() {
		innerText = '';
		showPlaceHolder = true;
		selectedImage = '';
		tags_toggle = false;
		focus = false;
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
	class="bg-purpleGray rounded-2xl p-2.5 h-fit relative"
	method="POST"
	action="/home?/createPost"
	use:enhance={submit}
>
	{#if focus}
		<!-- CLOSE BUTTON -->
		<button
			type="button"
			on:click={handleClose}
			class="absolute right-5 rounded-full bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple p-1"
			><X width={16} height={16} /></button
		>
		<p in:fly|local={{ y: -10 }} class="text-white font-bold text-lg mx-auto w-fit mb-2">
			Create Post
		</p>
	{/if}
	<div class="items-center grid grid-cols-[58px_minmax(0,_1fr)_50px_50px] h-fit">
		<!-- USER ICON -->
		<a href={user_url} class="w-[59px] h-[58px] rounded-full overflow-hidden">
			{#if user_photo_url}
				<img class="w-full h-full object-cover" src={user_photo_url} alt="User" />
			{:else}
				<User />
			{/if}
		</a>
		<!-- TEXTAREA -->
		<div
			class="h-fit mx-2.5 self-start mt-2 bg-purpleLight rounded-2xl px-3 py-2 relative border {focus_text
				? 'border-krispyPurple'
				: 'border-transparent'}"
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
					bind:focus
					bind:focus_text
					bind:innerText
					bind:showPlaceHolder
					bind:outputText
				/>
				<!-- CONTENT INPUT -->
				<input type="hidden" name="content" bind:value={outputText} />
			</div>
			{#if selectedImage}
				<!-- IMAGE PREVIEW -->
				<div class="relative w-fit mx-auto">
					<button
						class="absolute top-2 right-2 bg-krispyPurple hover:bg-lessPurple active:bg-krispyPurple p-1 rounded-full"
						on:click={() => {
							selectedImage = '';
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
		<button
			type="button"
			class="mx-1 mt-2 cursor-pointer p-2.5 rounded-3xl hover:bg-hoverPurple active:bg-transparent self-start relative"
			on:click={() => {
				focus = true;
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
				focus = true;
				tags_toggle = !tags_toggle;
			}}
			class="mr-3 mt-2 cursor-pointer p-2.5 rounded-3xl hover:bg-hoverPurple active:bg-transparent self-start"
		>
			<Hash />
		</button>
	</div>
	<div class="grid grid-cols-[1fr_112px] ml-[59px] mr-[39px]">
		<!-- TAGS INPUT -->
		<input type="hidden" name="tags" bind:value={tags} />
		{#if tags_toggle}
			<!-- TAG CREATION -->
			<div in:fly|local={{ y: -10 }} class="ml-2.5 mr-9 my-2">
				<CreateTags bind:tags />
			</div>
		{/if}
		{#if focus}
			<!-- POST BUTTON -->
			<button
				type="submit"
				disabled={!validContent}
				in:fly|local={{ y: -10 }}
				class="bg-krispyPurple active:bg-krispyPurple hover:bg-lessPurple text-white w-28 h-10 p-2.5 my-2 rounded-2xl flex items-center justify-center col-start-2 disabled:bg-lessPurple disabled:opacity-[0.5]"
				>Post</button
			>
		{/if}
	</div>
</form>
