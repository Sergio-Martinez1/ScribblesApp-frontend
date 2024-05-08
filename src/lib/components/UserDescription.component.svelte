<script lang="ts">
	import Link from '$lib/components/Icon/Link.svelte';
	import Calendar from '$lib/components/Icon/Calendar.svelte';
	import Gift from '$lib/components/Icon/Gift.svelte';
	import MapPin from '$lib/components/Icon/MapPin.svelte';

	export let content: string | null = '';
	export let webSite: string | null = '';
	export let birthDay: string | null = '';
	export let location: string | null = '';
	export let userCreationDate: string = '';
	export let loading: boolean = false;

	const monthNames: string[] = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
</script>

{#if loading}
	<div class="w-full h-fit bg-purpleGray rounded-2xl p-3.5">
		<div class="animate-pulse flex space-x-4">
			<div class="flex-1 space-y-6 py-1">
				<div class="h-2 bg-purpleLight rounded" />
				<div class="space-y-3">
					<div class="grid grid-cols-3 gap-4">
						<div class="h-2 bg-purpleLight rounded col-span-2" />
						<div class="h-2 bg-purpleLight rounded col-span-1" />
					</div>
					<div class="h-2 bg-purpleLight rounded" />
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="w-full min-h-[90px] h-fit bg-purpleGray rounded-2xl p-3.5 justify-center flex flex-col">
		{#if content}
			<p class="text-white w-full max-h-[96px] mb-3 overflow-y-auto break-words">
				{content}
			</p>
		{/if}
		<div class="flex gap-x-5 flex-wrap opacity-70">
			{#if webSite}
				<div class="flex gap-1.5 items-center w-fit">
					<div><Link width={14} height={14} /></div>
					<a
						class="text-krispyPurple underline"
						href={webSite.includes('https://') ? webSite : `https://${webSite}`}>{webSite}</a
					>
				</div>
			{/if}
			{#if birthDay}
				<div class="flex gap-1.5 items-center w-fit">
					<div><Gift width={16} height={16} /></div>
					<p class="text-white">
						Born {monthNames[Number(birthDay.substring(0, 10).split('-')[1]) - 1]}
						{birthDay.substring(0, 10).split('-')[2]}, {birthDay.substring(0, 10).split('-')[0]}
					</p>
				</div>
			{/if}
			{#if location}
				<div class="flex gap-1 items-center w-fit">
					<div><MapPin width={14} height={14} /></div>
					<p class="text-white">
						{location}
					</p>
				</div>
			{/if}
			{#if userCreationDate}
				<div class="flex gap-1 items-center w-fit">
					<div><Calendar width={15} height={15} /></div>
					<p class="text-white">
						Joined {monthNames[Number(userCreationDate.substring(0, 10).split('-')[1]) - 1]}
						{userCreationDate.substring(0, 10).split('-')[2]}, {userCreationDate
							.substring(0, 10)
							.split('-')[0]}
					</p>
				</div>
			{/if}
		</div>
	</div>
{/if}
