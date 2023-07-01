<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	export let form: ActionData;
  export let username: string = "username";
  export let email: string = "email";
  export let profile_photo: string = "profile_photo";
  export let cover_photo: string = "cover_photo";
  export let description: string = "description";
  export let personal_url: string = "https://personal_url.com";
  export let location: string = "location";
  export let birthday: string = "2023-05-28";
</script>

<form
	class="px-8 py-9 flex flex-col items-start gap-y-4"
	action="?/editProfile"
	method="POST"
  enctype="multipart/form-data"
	use:enhance
>
	<h1 class="text-white text-4xl font-bold">Edit Profile</h1>
	<label for="email">
		<h1 class="text-white font-bold">Email</h1>
		<input
			type="text"
			name="email"
      value={email}
			class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
			placeholder="email"
		/>
		{#if form?.emailMissing}<p class="error text-white">Email can not be empty</p>{/if}
	</label>
	<label for="profile_photo" class="flex flex-col gap-y-2">
		<h1 class="text-white font-bold">Profile Photo</h1>
    <img src={profile_photo} alt="">
		<input
			type="file"
			name="profile_photo"
      accept="image/*"
			class="px-4 bg-krispyPurple rounded-2xl h-9 text-white font-bold
              file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-krispyPurple file:text-white
      hover:file:bg-purpleLight"
		/>
	</label>
	<label for="cover_photo" class="flex flex-col gap-y-2">
		<h1 class="text-white font-bold">Cover Photo</h1>
    <img src={cover_photo} alt="">
		<input
			type="file"
			name="cover_photo"
			class="px-4 bg-krispyPurple rounded-2xl h-9 text-white font-bold
              file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-krispyPurple file:text-white
      hover:file:bg-purpleLight"
		/>
	</label>
	<label for="description">
		<h1 class="text-white font-bold">Decription</h1>
		<input
			type="text"
			name="description"
      value={description}
			class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
			placeholder="description"
		/>
	</label>
	<label for="url">
		<h1 class="text-white font-bold">Personal URL</h1>
		<input
			type="text"
			name="url"
      value={personal_url}
			class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
			placeholder="Personal URL"
		/>
	</label>

	<label for="location">
		<h1 class="text-white font-bold">Location</h1>
		<input
			type="text"
			name="location"
			value={location}
			class="px-4 py-6 min-w-full bg-krispyPurple rounded-2xl h-9 text-white font-bold focus:outline-krispyPurple"
			placeholder="Location"
		/>
	</label>
	<label for="birthday">
		<h1 class="text-white font-bold">Birthday</h1>
		<input
			type="date"
			name="birthday"
			placeholder="yyyy-mm-dd"
			value={birthday}
			min="1997-01-01"
			max="2030-12-31"
		/>
	</label>
	<button class="bg-krispyPurple text-white rounded-xl w-32 h-10" type="submit">
		<span class="px-auto font-bold text-white">Save</span>
	</button>
</form>
