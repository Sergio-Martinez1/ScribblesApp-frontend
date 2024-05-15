<script lang="ts">
	import EditPhoto from './EditPhoto.component.svelte';
	import Camera from './Icon/Camera.svelte';

	export let coverPhotoUrl: string | null = '';
	export let editable: boolean = false;
	export let loading: boolean = false;
</script>

<div class="w-full aspect-[3/1] relative">
	{#if loading}
		<div class="w-full h-full rounded-2xl bg-lavandaGray dark:bg-purpleLight animate-pulse" />
	{:else if coverPhotoUrl}
		<img class="w-full h-full rounded-2xl object-cover" src={coverPhotoUrl} alt="User cover" />
	{:else}
		<div class="w-full h-full rounded-2xl bg-lavandaGray dark:bg-purpleGray" />
	{/if}
	{#if editable}
		<div class="absolute max-md:top-3 md:bottom-5 right-3 md:right-5 w-fit h-fit">
			<EditPhoto imagename={'cover_photo'} dialogId={'edit_cover_photo_dialog'} cover_mode={true}>
				<div
					class="flex rounded-full sm:rounded-xl p-2 bg-krispyPurple hover:bg-lessLavanda dark:hover:bg-lessPurple active:bg-krispyPurple"
				>
					<div class="w-[24px] h-[24px]">
						<Camera />
					</div>
					<p class="text-white whitespace-nowrap hidden sm:inline-block ml-2">Edit cover photo</p>
				</div>
			</EditPhoto>
		</div>
	{/if}
</div>
