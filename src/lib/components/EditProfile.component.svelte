<script lang="ts">
	import type { ActionData } from '../../routes/$types';
	import { enhance } from '$app/forms';
	import TextAreaWithButtons from './TextAreaWithButtons.component.svelte';
	import User from './Icon/User.svelte';
	import EditPhoto from './EditPhoto.component.svelte';
	import PersonalUrlInput from './PersonalUrlInput.component.svelte';
	import LocationInput from './LocationInput.component.svelte';
	import BirthdayInput from './BirthdayInput.component.svelte';

	export let profile_photo: string = '';
	export let cover_photo: string = '';
	export let description: string = '';
	export let personal_url: string = '';
	export let location: string = 'location';
	export let birthday: string = '2023-05-28';

	let editable: boolean = false;
</script>

<section class="flex flex-col items-start gap-y-4 w-full p-6">
	<h1 class="text-white text-4xl font-bold">Edit Profile</h1>

	<!-- Profile photo -->
	<div class="flex flex-col gap-y-5 w-full">
		<div class="flex items-center justify-between border-b-2 border-b-purpleLight">
			<label for="profile_photo" class="text-white font-bold">Profile Photo</label>
			<EditPhoto
				imagename={'profile_photo'}
				dialogId={'edit_profile_photo_in_settings_dialog'}
				cover_mode={false}
			>
				<p
					class="text-krispyPurple font-bold underline hover:text-white active:text-krispyPurple text-lg"
				>
					Edit
				</p>
			</EditPhoto>
		</div>
		<div class="w-[100px] h-[100px] sm:w-[174px] sm:h-[174px] box-content rounded-full mx-auto">
			{#if profile_photo}
				<img class="w-full h-full object-cover rounded-full" src={profile_photo} alt="User face" />
			{:else}
				<User width={174} height={174} />
			{/if}
		</div>
	</div>

	<!-- Cover photo -->
	<div class="flex flex-col gap-y-5 w-full">
		<div class="flex items-center justify-between border-b-2 border-b-purpleLight">
			<label for="cover_photo" class="text-white font-bold">Cover Photo</label>
			<EditPhoto
				imagename={'cover_photo'}
				dialogId={'edit_cover_photo_in_settings_dialog'}
				cover_mode={true}
			>
				<p
					class="text-krispyPurple font-bold underline hover:text-white active:text-krispyPurple text-lg"
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
					<div class="w-full h-full rounded-2xl bg-purpleLight" />
				{/if}
			</div>
		</div>
	</div>

	<!-- Description -->
	<div class="flex flex-col gap-y-5 w-full">
		<div class="flex items-center justify-between border-b-2 border-b-purpleLight">
			<label for="description" class="text-white font-bold">Description</label>
			<button
				type="button"
				on:click={() => {
					editable = !editable;
				}}
				><p
					class="text-krispyPurple font-bold underline hover:text-white active:text-krispyPurple text-lg"
				>
					Edit
				</p></button
			>
		</div>
		{#if editable == false}
			{#if description}
				<p class="text-white opacity-60 mx-auto w-90 flex justify-center">{description}</p>
			{:else}
				<p class="text-white opacity-60 mx-auto w-90 flex justify-center">No description</p>
			{/if}
		{:else}
			<form method="post" action="/settings?/editDescription" use:enhance class="mx-auto">
				<TextAreaWithButtons
					initialContent={description ? description : ''}
					input_name={'description'}
					bind:cancelAction={editable}
				/>
			</form>
		{/if}
	</div>

	<!-- Personal url -->
	<div class="flex flex-col gap-y-5 w-full">
		<div class="flex items-center justify-between border-b-2 border-b-purpleLight">
			<label for="url" class="text-white font-bold">Personal Url</label>
		</div>
		<PersonalUrlInput {personal_url} />
	</div>

	<!-- Location -->
	<div class="flex flex-col gap-y-5 w-full">
		<div class="flex items-center justify-between border-b-2 border-b-purpleLight">
			<label for="location" class="text-white font-bold">Location</label>
		</div>
		<LocationInput {location} />
	</div>

	<!-- Birthday -->
	<div class="flex flex-col gap-y-5 w-full">
		<div class="flex items-center justify-between border-b-2 border-b-purpleLight">
			<label for="birthday" class="text-white font-bold">Birthday</label>
		</div>
		<BirthdayInput {birthday}/>
	</div>
</section>
