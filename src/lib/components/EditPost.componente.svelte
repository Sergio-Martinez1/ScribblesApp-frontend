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
	export let imagePreview: string = '';
	export let tags: string[] = [];
	let old_text = innerText;
	let old_image = imagePreview;
	let old_tags = tags;
	export let post_id: number;
	let dialog_id: string = `edit-dialog-post-${post_id}`;

	//STYLES
	export let maxContent: number = 500;
	export let user_photo_url: string | null = '';
	export let username: string = '';
	$: maxSize = imagePreview ? '' : '120px';

	//STATE
	let focus_text: boolean = false;
	let tags_toggle: boolean = tags ? true : false;
	let validContent: boolean = false;

	let showPlaceHolder: boolean =
		innerText.trim().length === 0 && (innerText.match(/\n|\s/g) || []).length === 1 ? true : false;

	//DOM
	let uploadFile: HTMLInputElement;

	$: validContent =
		(outputText.trim() || imagePreview) && outputText.length <= maxContent ? true : false;

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				maxSize = '';
				imagePreview = event.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function handleClose() {
		tags_toggle = false;
		let element = document.getElementById(dialog_id) as HTMLDialogElement;
		element.close();
		uploadFile.value = '';

		innerText = old_text;
		imagePreview = old_image;
		tags = old_tags;
		showPlaceHolder =
			innerText.trim().length === 0 && (innerText.match(/\n|\s/g) || []).length === 1
				? true
				: false;
		document.body.style.overflow = 'auto';
	}

	function isValidImageUrl(url: string) {
		return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image');
	}

	const submit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				handleClose();
				await invalidateAll();
				await applyAction(result);
			} else if (result.type === 'redirect') {
				handleClose();
				await applyAction(result);
			}
		};
	};
</script>

<form
	class="bg-lavandaGray dark:bg-purpleGray rounded-2xl h-fit relative p-4"
	method="POST"
	action="/home?/editPost"
	use:enhance={submit}
>
	<!-- CLOSE BUTTON -->
	<button
		type="button"
		on:click={handleClose}
		class="absolute top-0 right-0 rounded-tr-2xl rounded-bl-2xl bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple p-1 w-14 h-8 justify-center flex items-center"
		><X width={16} height={16} /></button
	>
	<p in:fly={{ y: -10 }} class="dark:text-white font-bold text-lg mx-auto w-fit mb-2">Edit Post</p>
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
			<p class="dark:text-white">{username}</p>
		</div>
		<!-- TEXTAREA -->
		<div
			class="h-fit self-start bg-lavandaLight dark:bg-purpleLight rounded-2xl px-3 py-2 relative border {focus_text
				? 'border-krispyPurple'
				: 'border-transparent'} overflow-y-auto max-h-[280px]"
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
			{#if imagePreview}
				<!-- IMAGE PREVIEW -->
				<div class="relative w-fit mx-auto">
					<button
						type="button"
						class="absolute top-2 right-2 bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple p-1 rounded-full"
						on:click={() => {
							imagePreview = '';
							maxSize = '120px';
						}}><X width={16} height={16} /></button
					>
					{#if isValidImageUrl(imagePreview)}
						<img
							src={imagePreview}
							alt="Vista previa de la imagen"
							class="rounded-2xl mb-2 mt-5 max-h-96"
						/>
					{:else}
						<div class="bg-lavandaGray dark:bg-purpleGray rounded-2xl p-6 w-fit mx-auto">
							<div class="mx-auto w-fit mb-6">
								<Image width={60} height={60} />
							</div>
							<p class="font-bold dark:text-white">Image can't be loaded.</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
		<!-- IMAGE BUTTON -->
		<div class="h-[50px] flex items-center bg-lavandaLight dark:bg-purpleLight rounded-2xl px-3">
			<p class="dark:text-white mr-3">Add to your post:</p>
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
					class="w-0 h-0 absolute"
					on:change={handleFileChange}
					bind:this={uploadFile}
				/>
				<input type="hidden" name="old_image" bind:value={imagePreview} />
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
			<div in:fly={{ y: -10 }} class="ml-3 mr-9 my-2">
				<CreateTags bind:tags maxSize="64px" />
			</div>
		{/if}
		<!-- POST BUTTON -->
		<button
			type="submit"
			disabled={!validContent}
			in:fly={{ y: -10 }}
			class="bg-krispyPurple active:bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple dark:text-white w-28 h-10 p-2.5 my-2 rounded-2xl flex items-center justify-center col-start-2 disabled:bg-lessLavanda dark:disabled:bg-lessPurple disabled:opacity-[0.5]"
			>Post</button
		>
	</div>
</form>
