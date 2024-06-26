<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import TextAreaWithButtons from './TextAreaWithButtons.component.svelte';
	import User from './Icon/User.svelte';
	import EditPhoto from './EditPhoto.component.svelte';
	import BirthdayInput from './BirthdayInput.component.svelte';
	import FormTextInput from './FormTextInput.component.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';

	export let profile_photo: string | null = '';
	export let cover_photo: string | null = '';
	export let description: string | null = '';
	export let personal_url: string | null = '';
	export let location: string | null = '';
	export let birthday: string | null = '';
	let isLoading: boolean = false;
	let error: boolean = false;

	let editable: boolean = false;

	const submitDescription: SubmitFunction = () => {
		isLoading = true;
		return async ({ result }) => {
			if (result.type === 'success') {
        invalidateAll();
				await applyAction(result);
			} else if (result.type === 'redirect') {
				await applyAction(result);
			} else {
				await applyAction(result);
				isLoading = false;
				error = true;
			}
			isLoading = false;
		};
	};
</script>

<section class="flex flex-col items-start gap-y-4 w-full">
	<h1 class="dark:text-white text-4xl font-bold">Edit Profile</h1>

	<!-- Profile photo -->
	<div class="flex flex-col gap-y-5 w-full">
		<div
			class="flex items-center justify-between border-b-2 border-b-lavandaLight dark:boder-b-purpleLight"
		>
			<label for="profile_photo" class="dark:text-white font-bold">Profile Photo</label>
			<EditPhoto
				imagename={'profile_photo'}
				dialogId={'edit_profile_photo_in_settings_dialog'}
				cover_mode={false}
			>
				<p
					class="text-krispyPurple font-bold underline hover:text-black dark:hover:text-white active:text-krispyPurple text-lg"
				>
					Edit
				</p>
			</EditPhoto>
		</div>
		<div class="w-[100px] h-[100px] sm:w-[174px] sm:h-[174px] box-content rounded-full mx-auto">
			{#if profile_photo}
				<img class="w-full h-full object-cover rounded-full" src={profile_photo} alt="User face" />
			{:else}
				<User
					tailwindWidthClass={'w-[100px] sm:w-[174px]'}
					tailwindHeightClass={'h-[100px] sm:h-[174px]'}
					tailwindFillClass={'fill-lavandaLight dark:fill-purpleLight'}
					tailwindStrokeClass={'stroke-black dark:stroke-white'}
				/>
			{/if}
		</div>
	</div>

	<!-- Cover photo -->
	<div class="flex flex-col gap-y-5 w-full">
		<div
			class="flex items-center justify-between border-b-2 border-b-lavandaLight dark:boder-b-purpleLight"
		>
			<label for="cover_photo" class="dark:text-white font-bold">Cover Photo</label>
			<EditPhoto
				imagename={'cover_photo'}
				dialogId={'edit_cover_photo_in_settings_dialog'}
				cover_mode={true}
			>
				<p
					class="text-krispyPurple font-bold underline hover:text-black dark:hover:text-white active:text-krispyPurple text-lg"
				>
					Edit
				</p>
			</EditPhoto>
		</div>
		<div class="w-full">
			<div class="w-10/12 aspect-[3/1] relative mx-auto">
				{#if cover_photo}
					<img class="w-full h-full rounded-2xl object-cover" src={cover_photo} alt="User cover" />
				{:else}
					<div class="w-full h-full rounded-2xl bg-lavandaLight dark:bg-purpleLight" />
				{/if}
			</div>
		</div>
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-y-5 w-full">
		<div
			class="flex items-center justify-between border-b-2 border-b-lavandaLight dark:boder-b-purpleLight"
		>
			<label for="description" class="dark:text-white font-bold">Description</label>
			<button
				type="button"
				on:click={() => {
					editable = !editable;
				}}
				><p
					class="text-krispyPurple font-bold underline hover:text-black dark:hover:text-white active:text-krispyPurple text-lg"
				>
					Edit
				</p></button
			>
		</div>
		{#if editable == false}
			{#if description}
				<p class="dark:text-white opacity-60 mx-auto w-90 flex justify-center">{description}</p>
			{:else}
				<p class="dark:text-white opacity-60 mx-auto w-90 flex justify-center">No description</p>
			{/if}
		{:else}
			<form
				method="post"
				action="/settings?/editDescription"
				use:enhance={submitDescription}
				class="mx-auto"
			>
				<TextAreaWithButtons
					initialContent={description ? description : ''}
					input_name={'description'}
					bind:cancelAction={editable}
          {isLoading}
          bind:error={error}
				/>
			</form>
		{/if}
	</div>

	<!-- Personal url -->
	<div class="flex flex-col gap-y-5 w-full">
		<div
			class="flex items-center justify-between border-b-2 border-b-lavandaLight dark:boder-b-purpleLight"
		>
			<label for="url" class="dark:text-white font-bold">Personal Url</label>
		</div>
		<FormTextInput
			data={personal_url}
			inputName={'personal_url'}
			placeholder={'https://example.com'}
			formActionUrl={'/settings?/editWebSite'}
		>
			<span class="text-white">Add Url</span>
		</FormTextInput>
	</div>

	<!-- Location -->
	<div class="flex flex-col gap-y-5 w-full">
		<div
			class="flex items-center justify-between border-b-2 border-b-lavandaLight dark:boder-b-purpleLight"
		>
			<label for="location" class="dark:text-white font-bold">Location</label>
		</div>
		<FormTextInput
			data={location}
			inputName={'location'}
			placeholder={'New York, US'}
			formActionUrl={'/settings?/editLocation'}
		>
			<span class="text-white">Add Location</span>
		</FormTextInput>
	</div>

	<!-- Birthday -->
	<div class="flex flex-col gap-y-5 w-full">
		<div
			class="flex items-center justify-between border-b-2 border-b-lavandaLight dark:boder-b-purpleLight"
		>
			<label for="birthday" class="dark:text-white font-bold">Birthday</label>
		</div>
		<BirthdayInput {birthday} />
	</div>
</section>
