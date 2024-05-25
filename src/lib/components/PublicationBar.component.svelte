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
	import { createEventDispatcher } from 'svelte';
	import type { Post } from '$lib/types';
	import type { ActionData } from './$types';

	export let form: ActionData;

	//STYLES
	export let maxContent: number = 500;
	export let user_url: string = '';
	export let user_photo_url: string = '';

	//STATE
	export let focus: boolean = false;
	let focus_text: boolean = false;
	let tags_toggle: boolean = false;
	let showPlaceHolder: boolean = true;
	let validContent: boolean = false;
	let selectedImage: string = '';
	let screenWidth: number;

	//DOM
	let uploadFile: HTMLInputElement;

	//RAW TEXT
	let innerText: string = '';

	//TEXT TO API
	export let outputText: string = '';
	export let imagePreview: string = '';
	export let tags: string[] = [];

	const dispatch = createEventDispatcher();

	$: validContent =
		(outputText.trim() || imagePreview) && outputText.length <= maxContent ? true : false;

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				imagePreview = event.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function handleClose() {
		innerText = '';
		showPlaceHolder = true;
		imagePreview = '';
		selectedImage = '';
		tags = [];
		tags_toggle = false;
		focus = false;
		uploadFile.value = '';
	}

	function handleAddPost(post: Post) {
		dispatch('addpost', {
			id: post.id,
			content: post.content,
			thumbnail: post.thumbnail,
			publication_date: post.publication_date,
			user_id: post.user_id,
			user: post.user,
      reactions: post.reactions,
			tags: post.tags,
			num_comments: post.num_comments
		});
	}

	const submit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				await applyAction(result);
        handleAddPost(form.createdPost)
				handleClose();
			} else if (result.type === 'redirect') {
				await applyAction(result);
				handleClose();
			}
		};
	};
</script>

<svelte:window bind:innerWidth={screenWidth} />

<form
	class="bg-lavandaGray dark:bg-purpleGray rounded-2xl px-5 py-2.5 h-fit relative"
	method="POST"
	enctype="multipart/form-data"
	action="/home?/createPost"
	use:enhance={submit}
>
	{#if focus}
		<!-- CLOSE BUTTON -->
		<button
			type="button"
			on:click={handleClose}
			class="absolute top-0 right-0 rounded-tr-2xl rounded-bl-2xl bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple p-1 w-14 h-8 justify-center flex items-center"
			><X width={18} height={18} /></button
		>
		<p in:fly={{ y: -10 }} class="dark:text-white font-bold text-lg mx-auto w-fit mb-2">
			Create Post
		</p>
	{/if}
	<div
		class="items-center grid grid-cols-[58px_minmax(0,_1fr)_auto] sm:grid-cols-[58px_minmax(0,_1fr)_auto_auto] gap-x-2 h-fit"
	>
		<!-- USER ICON -->
		<a
			href={user_url}
			class="w-[50px] h-[50px] sm:w-[59px] sm:h-[58px] rounded-full overflow-hidden self-start"
		>
			{#if user_photo_url}
				<img class="w-full h-full object-cover" src={user_photo_url} alt="User" />
			{:else}
				<User
					tailwindWidthClass={'w-[50px] sm:w-[59px]'}
					tailwindHeightClass={'h-[50px] sm:h-[59px]'}
					tailwindFillClass={'fill-lavandaLight dark:fill-purpleLight'}
					tailwindStrokeClass={'stroke-black dark:stroke-white'}
				/>
			{/if}
		</a>
		<!-- TEXTAREA -->
		<div
			class="h-fit self-start mt-2 bg-lavandaLight dark:bg-purpleLight rounded-2xl px-3 py-2 relative border {focus_text
				? 'border-krispyPurple'
				: 'border-transparent'}"
			tabindex="-1"
		>
			<div class="relative">
				{#if outputText.length > maxContent}
					<div
						in:fly={{ y: 10 }}
						out:fly={{ y: 10 }}
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
			{#if imagePreview}
				<!-- IMAGE PREVIEW -->
				<div class="relative w-fit mx-auto">
					<button
						type="button"
						class="absolute top-2 right-2 bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple p-1 rounded-full"
						on:click={() => {
							imagePreview = '';
						}}><X width={16} height={16} /></button
					>
					<img
						src={imagePreview}
						alt="Vista previa de la imagen"
						class="rounded-2xl mb-2 mt-5 max-h-96"
					/>
				</div>
			{/if}
		</div>
		<!-- IMAGE BUTTON -->
		<button
			type="button"
			class="mt-2 cursor-pointer p-2 sm:p-2.5 rounded-3xl hover:bg-hoverLavanda dark:hover:bg-hoverPurple active:bg-transparent self-start relative w-fit"
			on:click={() => {
				focus = true;
				uploadFile.click();
				if (screenWidth < 640) tags_toggle = true;
			}}
		>
			<Image />
			<!-- IMAGE INPUT -->
			<input
				tabindex="-1"
				type="file"
				name="thumbnail"
				accept="image/*"
				class="w-0 h-0 absolute overflow-hidden"
				on:change={handleFileChange}
				bind:this={uploadFile}
				bind:value={selectedImage}
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
			class="hidden sm:inline-block mt-2 w-fit cursor-pointer p-2 sm:p-2.5 rounded-3xl hover:bg-hoverLavanda dark:hover:bg-hoverPurple active:bg-transparent self-start justify-self-end"
		>
			<Hash />
		</button>
	</div>
	{#if focus}
		<div class="grid grid-cols-[1fr_112px] ml-[15px] sm:ml-[59px] sm:mr-[39px]">
			<!-- TAGS INPUT -->
			<input type="hidden" name="tags" bind:value={tags} />
			{#if (screenWidth < 640 && focus) || tags_toggle}
				<!-- TAG CREATION -->
				<div in:fly={{ y: -10 }} class="ml-2.5 mr-9 my-2">
					<CreateTags bind:tags />
				</div>
			{/if}
			<!-- POST BUTTON -->
			<button
				type="submit"
				disabled={!validContent}
				in:fly={{ y: -10 }}
				class="bg-krispyPurple active:bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple text-white w-28 h-10 p-2.5 my-2 rounded-2xl flex items-center justify-center col-start-2 disabled:bg-lessPurple disabled:opacity-[0.5]"
				>Post</button
			>
		</div>
	{/if}
</form>
