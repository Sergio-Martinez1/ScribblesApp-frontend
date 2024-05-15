<script lang="ts">
	import User from '$lib/components/Icon/User.svelte';
	import EditPhoto from './EditPhoto.component.svelte';
	import Camera from './Icon/Camera.svelte';

	export let username: string = '';
	export let profilePhoto: string | null = '';
	export let editable: boolean = false;
	export let loading: boolean = false;
</script>

{#if loading}
	<div
		class="w-w-[120px] h-[120px] sm:w-[190px] sm:h-[190px] mb-2.5 relative bg-lavandaGray dark:bg-purpleGray box-content p-3 rounded-full"
	>
		<div
			class="animate-pulse duration-200 rounded-full bg-lavandaLight dark:bg-purpleLight w-[120px] h-[120px] sm:w-[190px] sm:h-[190px]"
		/>
	</div>
	<div class="animate-pulse flex mx-auto w-fit h-fit">
		<div class="h-6 w-36 bg-lavandaLight dark:bg-purpleLight rounded-2xl" />
	</div>
{:else if profilePhoto}
	<div
		class="w-[120px] h-[120px] sm:w-[190px] sm:h-[190px] mb-2.5 relative bg-lavandaDark dark:bg-purpleGray box-content p-1.5 sm:p-3 rounded-full"
	>
		<img class="w-full h-full object-cover rounded-full" src={profilePhoto} alt="User face" />
		{#if editable}
			<div class="absolute bottom-0 sm:bottom-2 right-0 sm:right-8 w-fit h-fit">
				<EditPhoto imagename={'profile_photo'} dialogId={'edit_profile_photo_dialog'}>
					<div
						class="w-fit h-fit p-2 rounded-full bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple"
					>
						<Camera />
					</div>
				</EditPhoto>
			</div>
		{/if}
	</div>
	<p class="dark:text-white font-bold w-fit mx-auto text-xl">{username}</p>
{:else}
	<div class="w-[174px] h-[174px] mb-2.5 relative bg-lavandaDark dark:bg-purpleGray box-content p-3 rounded-full">
		<User width={174} height={174} />
		{#if editable}
		<div class="absolute bottom-0 sm:bottom-2 right-0 sm:right-8 w-fit h-fit">
			<EditPhoto imagename={'profile_photo'} dialogId={'edit_profile_photo_dialog'}>
				<div
					class="w-fit h-fit p-2 rounded-full bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple"
				>
					<Camera />
				</div>
			</EditPhoto>
		</div>
		{/if}
	</div>
	<p class="dark:text-white font-bold w-fit mx-auto text-xl">{username}</p>
{/if}
