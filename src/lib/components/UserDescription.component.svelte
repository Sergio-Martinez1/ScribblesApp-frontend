<script lang="ts">
	import Link from '$lib/components/Icon/Link.svelte';
	import Calendar from '$lib/components/Icon/Calendar.svelte';
	import Gift from '$lib/components/Icon/Gift.svelte';
	import MapPin from '$lib/components/Icon/MapPin.svelte';
	import { split } from 'postcss/lib/list';

	export let content: string =
		'Trabajé en Ogilvy, Y&R, Publicis y Mother | Te cuento secretos de marketing, Copywriting & Storytelling para que puedas convertir las palabras en dinero. Trabajé en Ogilvy, Y&R, Publicis y Mother. Trabajé en Ogilvy, Y&R, Publicis y Mother. ';
	export let webSite: string = 'https://www.facebook.com/';
	export let birthDay: string = '1990/08/13';
	export let location: string = 'Xalapa, Mexico';
	export let userCreationDate: string = '2023/08/13';

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

<div class="w-[454px] h-fit bg-purpleGray rounded-2xl p-3.5">
	<p class="text-white w-full max-h-[96px] mb-3 overflow-y-auto break-words">
		{content}
	</p>
	<div class="flex gap-x-5 flex-wrap opacity-70">
		{#if webSite}
			<div class="flex gap-1.5 items-center w-fit">
				<div><Link width={14} height={14} /></div>
				<a class="text-krispyPurple underline" href={webSite}>{webSite}</a>
			</div>
		{/if}
		{#if birthDay}
			<div class="flex gap-1.5 items-center w-fit">
				<div><Gift width={16} height={16} /></div>
				<p class="text-white">
					Born {monthNames[Number(birthDay.split('/')[1]) - 1]}
					{birthDay.split('/')[2]}, {birthDay.split('/')[0]}
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
					Joined {monthNames[Number(userCreationDate.split('/')[1]) - 1]}
					{userCreationDate.split('/')[2]}, {userCreationDate.split('/')[0]}
				</p>
			</div>
		{/if}
	</div>
</div>
